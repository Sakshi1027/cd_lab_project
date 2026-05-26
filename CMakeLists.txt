cmake_minimum_required(VERSION 3.10)
project(ASTTool)

find_package(LLVM REQUIRED CONFIG)
find_package(Clang REQUIRED CONFIG)

include_directories(${LLVM_INCLUDE_DIRS})
add_definitions(${LLVM_DEFINITIONS})

add_executable(tool src/tool.cpp)

target_link_libraries(tool
  clangTooling
  clangBasic
  clangASTMatchers
)
