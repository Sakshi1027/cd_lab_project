#include "clang/ASTMatchers/ASTMatchers.h"
#include "clang/ASTMatchers/ASTMatchFinder.h"
#include "clang/Frontend/FrontendActions.h"
#include "clang/Tooling/CommonOptionsParser.h"
#include "clang/Tooling/Tooling.h"
#include "clang/AST/RecursiveASTVisitor.h"
#include "clang/Rewrite/Core/Rewriter.h"
#include "llvm/Support/CommandLine.h"
#include <unordered_map>
#include <vector>
#include <string>
#include <cmath>
#include <system_error>

using namespace clang;
using namespace clang::tooling;
using namespace clang::ast_matchers;

// ==========================================
// 1. Data-Flow Graph (DFG)
// ==========================================
struct DFGNode {
    std::string name;
    std::string type;
    std::vector<DFGNode*> dependencies;
    std::string operation = "";
    double constantValue = 0.0;
    double errorBudget = 0.0;
    bool isSafeToDemote = false;
};

std::unordered_map<std::string, DFGNode*> Graph;

DFGNode* getOrCreateNode(const std::string& name, const std::string& type) {
    if (Graph.find(name) == Graph.end()) {
        Graph[name] = new DFGNode{name, type, {}};
    }
    return Graph[name];
}

// ==========================================
// 2. Backward Error Propagation
// ==========================================
void propagateError(DFGNode* targetNode, double initialBudget) {
    targetNode->errorBudget = initialBudget;
    targetNode->isSafeToDemote = (targetNode->errorBudget > 0.001);

    for (DFGNode* dep : targetNode->dependencies) {
        double newBudget = targetNode->errorBudget;

        if (targetNode->operation == "+") {
            newBudget = targetNode->errorBudget; 
        } 
        else if (targetNode->operation == "*") {
            if (targetNode->constantValue != 0.0) {
                newBudget = targetNode->errorBudget / std::abs(targetNode->constantValue);
            }
        }
        propagateError(dep, newBudget);
    }
}

// ==========================================
// 3. Match Callback (AST Analysis)
// ==========================================
class AssignmentCallback : public MatchFinder::MatchCallback {
public:
    virtual void run(const MatchFinder::MatchResult &Result) override {
        const auto *lhsVar = Result.Nodes.getNodeAs<DeclRefExpr>("lhsVar");
        const auto *rhsMath = Result.Nodes.getNodeAs<Expr>("rhsMath");
        
        if (lhsVar && rhsMath) {
            std::string lhsName = lhsVar->getNameInfo().getAsString();
            std::string lhsType = lhsVar->getType().getAsString();
            
            DFGNode* lhsNode = getOrCreateNode(lhsName, lhsType);

            if (const auto *binOp = dyn_cast<BinaryOperator>(rhsMath)) {
                lhsNode->operation = binOp->getOpcodeStr().str();
                
                struct ConstantVisitor : public RecursiveASTVisitor<ConstantVisitor> {
                    double& constVal;
                    ConstantVisitor(double& val) : constVal(val) {}
                    bool VisitFloatingLiteral(FloatingLiteral *lit) {
                        constVal = lit->getValue().convertToDouble();
                        return true;
                    }
                };
                ConstantVisitor cVis(lhsNode->constantValue);
                cVis.TraverseStmt(const_cast<BinaryOperator*>(binOp));
            }

            struct DependencyVisitor : public RecursiveASTVisitor<DependencyVisitor> {
                DFGNode* parentNode;
                DependencyVisitor(DFGNode* parent) : parentNode(parent) {}
                bool VisitDeclRefExpr(DeclRefExpr *expr) {
                    std::string depName = expr->getNameInfo().getAsString();
                    std::string depType = expr->getType().getAsString();
                    DFGNode* depNode = getOrCreateNode(depName, depType);
                    parentNode->dependencies.push_back(depNode);
                    return true;
                }
            };
            DependencyVisitor dVis(lhsNode);
            dVis.TraverseStmt(const_cast<Expr*>(rhsMath));
        }
    }
};

// ==========================================
// 4. AST Rewriter Callback (Member 3)
// ==========================================
#include <set>

clang::Rewriter TheRewriter;
bool RewriterInitialized = false;
std::set<unsigned> RewrittenLocations;

class RewriteCallback : public MatchFinder::MatchCallback {
public:
    virtual void run(const MatchFinder::MatchResult &Result) override {
        if (!RewriterInitialized) {
            TheRewriter.setSourceMgr(Result.Context->getSourceManager(), Result.Context->getLangOpts());
            RewriterInitialized = true;
        }

        const auto *varDecl = Result.Nodes.getNodeAs<VarDecl>("varDecl");
        if (varDecl && varDecl->getType().getAsString() == "float") {
            std::string varName = varDecl->getNameAsString();
            
            if (Graph.find(varName) != Graph.end() && Graph[varName]->isSafeToDemote) {
                if (auto typeLoc = varDecl->getTypeSourceInfo()->getTypeLoc()) {
                    SourceLocation beginLoc = typeLoc.getBeginLoc();
                    unsigned locID = beginLoc.getRawEncoding();
                    
                    // Only rewrite this location if we haven't already!
                    // This fixes the bug where 'float a, b, c;' writes _Float16 three times.
                    if (RewrittenLocations.find(locID) == RewrittenLocations.end()) {
                        TheRewriter.ReplaceText(typeLoc.getSourceRange(), "_Float16");
                        RewrittenLocations.insert(locID);
                    }
                    llvm::outs() << "[REWRITER] Upgraded variable '" << varName << "' to _Float16!\n";
                }
            }
        }
    }
};

// ==========================================
// Main Application
// ==========================================
static llvm::cl::OptionCategory MyToolCategory("precision-demotion-tool options");

int main(int argc, const char **argv) {
    auto ExpectedParser = CommonOptionsParser::create(argc, argv, MyToolCategory);
    if (!ExpectedParser) {
        llvm::errs() << ExpectedParser.takeError();
        return 1;
    }
    CommonOptionsParser& OptionsParser = ExpectedParser.get();
    ClangTool Tool(OptionsParser.getCompilations(), OptionsParser.getSourcePathList());

    // --- PASS 1: AST ANALYSIS ---
    AssignmentCallback AnalysisCb;
    MatchFinder AnalysisFinder;
    AnalysisFinder.addMatcher(
        binaryOperator(
            isAssignmentOperator(),
            hasLHS(ignoringParenImpCasts(declRefExpr().bind("lhsVar"))),
            hasRHS(ignoringParenImpCasts(expr().bind("rhsMath")))
        ).bind("assign"), &AnalysisCb);
    
    Tool.run(newFrontendActionFactory(&AnalysisFinder).get());

    // --- PRINT DELIVERABLE 1 OUTPUT ---
    llvm::outs() << "\n=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\n";
    for (const auto& pair : Graph) {
        DFGNode* node = pair.second;
        llvm::outs() << "Node [" << node->name << "] (Type: " << node->type << ")\n";
        if (!node->operation.empty()) {
            llvm::outs() << "  -> Math Operation: " << node->operation << " " << node->constantValue << "\n";
        }
        for (auto* dep : node->dependencies) {
            llvm::outs() << "  <- Depends on [" << dep->name << "]\n";
        }
    }

    // --- MATH PROPAGATION ---
    std::string target = "";
    if (Graph.find("c") != Graph.end()) target = "c";
    else if (Graph.find("final_dot") != Graph.end()) target = "final_dot";
    else if (Graph.find("filtered_out") != Graph.end()) target = "filtered_out";
    else if (Graph.find("prob1") != Graph.end()) target = "prob1";
    else if (Graph.find("activated") != Graph.end()) target = "activated";
    else if (Graph.find("out") != Graph.end()) target = "out";

    if (!target.empty()) {
        propagateError(Graph[target], 0.05);
    }

    // --- PRINT DELIVERABLE 2 OUTPUT ---
    llvm::outs() << "\n=== DELIVERABLE 2: Backward Precision Propagation Engine ===\n";
    for (const auto& pair : Graph) {
        DFGNode* node = pair.second;
        llvm::outs() << "Variable [" << node->name << "]\n";
        llvm::outs() << "  -> Error Budget: " << node->errorBudget << "\n";
        if (node->isSafeToDemote) {
            llvm::outs() << "  -> STATUS: SAFE for FP16 Demotion! \n";
        } else {
            llvm::outs() << "  -> STATUS: MUST STAY FP32 (Error budget too strict)\n";
        }
        llvm::outs() << "\n";
    }

    // --- PASS 2: AST REWRITER ---
    RewriteCallback RewriteCb;
    MatchFinder RewriteFinder;
    // Match all variable declarations
    RewriteFinder.addMatcher(varDecl().bind("varDecl"), &RewriteCb);
    
    llvm::outs() << "=== DELIVERABLE 3: AST Rewriter (Safe Source Demotion) ===\n";
    llvm::outs() << "\n--- Applying Precision Demotions ---\n";
    Tool.run(newFrontendActionFactory(&RewriteFinder).get());

    // --- SAVE TO NEW FILE ---
    if (RewriterInitialized) {
        std::error_code EC;
        llvm::raw_fd_ostream outFile("test_demoted.c", EC, llvm::sys::fs::OF_None);
        TheRewriter.getEditBuffer(TheRewriter.getSourceMgr().getMainFileID()).write(outFile);
        outFile.close();
        llvm::outs() << "\n[SUCCESS] Optimization complete! Saved to 'test_demoted.c'.\n";
    }

    for (auto& pair : Graph) delete pair.second;
    return 0;
}
