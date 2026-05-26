import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Code2, 
  TreePine, 
  Cpu, 
  Zap, 
  Activity, 
  FileJson, 
  Network,
  Terminal,
  ArrowRight,
  Target,
  ShieldCheck,
  ChevronDown,
  Github
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0.2, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            filter: "blur(2px)"
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage({ onLaunch }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <FloatingParticles />
      
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0f1d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
            <Cpu className="text-blue-400" />
            <span>Compiler<span className="text-blue-400">IDE</span></span>
          </div>
          <button 
            onClick={onLaunch}
            className="px-5 py-2 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all font-medium flex items-center gap-2 group cursor-pointer"
          >
            Launch IDE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Precision-Aware <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Compiler Platform
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
          >
            A next-generation compiler visualization platform for lexical, syntax, semantic, intermediate code, optimization, and code generation analysis.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onLaunch}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Enter IDE Environment
              <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700 backdrop-blur-sm transition-all text-center flex items-center justify-center gap-2"
            >
              Explore Features
              <ChevronDown className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Compiler Phases / About */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Inside the Pipeline</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Real-time visualization and deep inspection of every compiler phase.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Code2, title: "Lexical Analysis", desc: "Tokenization with glowing syntax highlighting and regex-based scanning." },
              { icon: TreePine, title: "Syntax Tree", desc: "Interactive graph-based AST visualization using React Flow." },
              { icon: ShieldCheck, title: "Semantic Analysis", desc: "Type checking and scope validation before code translation." },
              { icon: Network, title: "Intermediate Code", desc: "Three-address code generation for language-independent optimization." },
              { icon: Zap, title: "Optimization Phase", desc: "Constant folding, dead code elimination, and loop unrolling." },
              { icon: Target, title: "Precision Analysis", desc: "Interval arithmetic to safely demote float32 to float16 within error bounds." },
              { icon: FileJson, title: "Code Generation", desc: "Final target output mapped perfectly back to the optimized graph." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn} className="p-6 rounded-2xl bg-[#1e293b]/60 border border-slate-700 hover:border-blue-500/50 hover:bg-[#1e293b] transition-all group backdrop-blur-md shadow-xl">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <feature.icon className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Flow */}
      <section className="py-24 border-y border-white/5 bg-slate-900/30 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Precision-Aware Data Flow</h2>
            <p className="text-slate-400">Demoting types while mathematically guaranteeing safety.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/50 w-full md:w-1/3 text-center">
              <div className="text-blue-400 font-mono mb-2">Source Code</div>
              <div className="text-white text-lg font-semibold">float32 Operations</div>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-600 rotate-90 md:rotate-0" />
            <div className="p-6 rounded-xl border border-indigo-500/50 bg-indigo-500/10 w-full md:w-1/3 text-center shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              <div className="text-indigo-400 font-mono mb-2">Analysis Engine</div>
              <div className="text-white text-lg font-semibold">Error Budget Allocation</div>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-600 rotate-90 md:rotate-0" />
            <div className="p-6 rounded-xl border border-purple-500/50 bg-purple-500/10 w-full md:w-1/3 text-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="text-purple-400 font-mono mb-2">Optimized Code</div>
              <div className="text-white text-lg font-semibold">float16 Translation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100%", label: "AST Coverage" },
              { value: "<0.05", label: "Error Tolerance" },
              { value: "O(n)", label: "Analysis Time" },
              { value: "2x", label: "Memory Saved" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium tracking-wide uppercase text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Project */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Build This?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Provides deep educational insights into how modern compilers work under the hood.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Interactive visualizations make abstract concepts like Syntax Trees tangible.</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Solves real-world ML/DSP problems by safely demoting types to save bandwidth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Bridges the gap between backend compiler logic and front-end user experience.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Developed By</h2>
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl border border-white/10 bg-[#161f30] inline-block w-full shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-blue-500/50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-bold text-blue-400">CD</span>
            </div>
            <h3 className="text-xl font-bold text-white">SAKSHI A S & Team</h3>
            <p className="text-blue-400 font-medium mb-4">Compiler Design Lab Project</p>
            <p className="text-slate-400 text-sm">
              Focusing on LLVM, Clang, React, and AST Optimization for Next-Gen tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050810] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-300">
            <Cpu className="text-blue-500 w-5 h-5" />
            CompilerIDE
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Precision-Aware Compiler Project.
          </div>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Shimmer Animation for the flow section */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
