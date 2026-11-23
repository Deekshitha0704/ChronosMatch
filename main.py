"""
ChronosMatch Root Application Entrypoint
Allows running `python -m uvicorn main:app` directly from the project root directory.
"""
import os
import sys
import importlib.util

# Add backend directory to sys.path so that 'app' package is discoverable
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Load the actual main app from backend/main.py
backend_main_file = os.path.join(BACKEND_DIR, "main.py")
spec = importlib.util.spec_from_file_location("backend_main_module", backend_main_file)
backend_main_module = importlib.util.module_from_spec(spec)
sys.modules["backend_main_module"] = backend_main_module
spec.loader.exec_module(backend_main_module)

app = backend_main_module.app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
