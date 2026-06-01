# Precision-Aware Compiler IDE

A next-generation compiler visualization platform and Clang-based tool that safely demotes high-precision floating-point types (`float`) to reduced-precision types (`_Float16`) while mathematically guaranteeing safety bounds using interval arithmetic.

## Features

- **Precision-Aware Type Demotion Framework**: Clang tool that parses C/C++ AST, extracts a Data-Flow Graph (DFG), calculates Backward Precision Budgets, and rewrites variables safely.
- **Dual-Precision Verification**: Compiles and runs original `float32` code alongside demoted `_Float16` code, computing the absolute error dynamically.
- **Modern Web IDE**: An interactive React-based dashboard built with Vite and Tailwind CSS.
  - **Monaco Editor**: Edit and run C code directly in the browser.
  - **AST Viewer**: Interactive, graphical Abstract Syntax Tree visualization using React Flow.
  - **Tokens Explorer**: A glowing, categorized lexical analysis token table.
  - **Output Panel**: Side-by-side terminal logs, intermediate DFG instructions, and rewritten code.
- **FastAPI Backend**: Provides REST API endpoints to trigger the Clang compiler processes and feed output to the frontend.

## Project Structure

- `compiler-ide/` - The React/Vite web application and UI.
- `compiler-ide/backend/` - The FastAPI backend serving the compilation endpoints.
- `build/` - Output directory for compiled tools, scripts, and logs.
- `kernels/` - ML/DSP algorithm kernels (Dot Product, FIR filter, Softmax, Sigmoid, etc.) used for testing.

## Prerequisites

- **Clang / LLVM** (for compiling and analyzing the C code)
- **Python 3.8+** (for the backend and verification scripts)
- **Node.js 18+** & **npm** (for the web frontend)

## Quick Start

### 1. Start the Backend (FastAPI)
```bash
cd compiler-ide/backend
pip install fastapi uvicorn pydantic
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend (React + Vite)
```bash
cd compiler-ide
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser to access the Precision-Aware Compiler IDE!

## Testing the Compiler Locally

You can test the compiler purely through the terminal using our verification scripts.

Run a specific ML kernel:
```bash
cd build
python verify.py ../kernels/kernel_dot_product.c
```

Test all kernels simultaneously:
```bash
cd build
bash run_all_kernels.sh
```

