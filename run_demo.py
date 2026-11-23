"""
ChronosMatch Master Live Demo Launcher
======================================
One-click runner for internship presentations and viva demonstrations:
1. Detects if FastAPI ChronosMatch engine is already running or starts it
2. Waits for health checks to pass with clear diagnostic output
3. Opens the real-time web dashboard in the system default browser
4. Streams simulated live orders, market depth, and executions
5. Gracefully handles shutdown on Ctrl+C

Usage:
    python run_demo.py
"""
import os
import sys
import time
import subprocess
import webbrowser
import urllib.request

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
HEALTH_URL = "http://127.0.0.1:8000/health"
DASHBOARD_URL = "http://127.0.0.1:8000/dashboard"


def is_backend_healthy() -> bool:
    try:
        with urllib.request.urlopen(HEALTH_URL, timeout=1.0) as resp:
            return resp.status == 200
    except Exception:
        return False


def wait_for_backend(proc: subprocess.Popen, timeout: int = 15) -> bool:
    start_time = time.time()
    while time.time() - start_time < timeout:
        # Check if process crashed prematurely
        if proc and proc.poll() is not None:
            _, stderr_text = proc.communicate(timeout=2)
            print("\n[ERROR] Server process terminated unexpectedly:")
            if stderr_text:
                print(stderr_text.strip())
            return False

        if is_backend_healthy():
            return True
        time.sleep(0.4)
    return False


def main():
    print("=" * 60)
    print("  CHRONOSMATCH: ZERO-COPY HIGH-FREQUENCY MATCHING ENGINE")
    print("  Interactive Internship Demonstration Environment")
    print("=" * 60)

    server_proc = None

    # 1. Check if backend is already online
    if is_backend_healthy():
        print("\n[1/4] Existing ChronosMatch backend already detected and healthy on port 8000.")
    else:
        print("\n[1/4] Starting FastAPI High-Performance Matching Server...")
        server_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
        server_proc = subprocess.Popen(
            server_cmd,
            cwd=BACKEND_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("[2/4] Waiting for engine initialization & SQLite persistence...")
        if not wait_for_backend(server_proc):
            print("\n[ERROR] Server failed to start within timeout.")
            if server_proc:
                try:
                    server_proc.kill()
                except Exception:
                    pass
            sys.exit(1)
        print("      -> Engine initialized! REST APIs & in-memory book ready.")

    try:
        # 3. Open browser dashboard
        print(f"[3/4] Launching Dashboard in browser: {DASHBOARD_URL}")
        try:
            webbrowser.open(DASHBOARD_URL)
        except Exception as e:
            print(f"      (Could not auto-open browser: {e}. Please open manually.)")

        # 4. Start live market simulator in foreground
        print("\n[4/4] Starting Live Simulated Market Feed (TCS)...")
        print("      Dashboard URL : http://127.0.0.1:8000/dashboard")
        print("      Swagger Docs  : http://127.0.0.1:8000/docs")
        print("      Press Ctrl+C at any time to shut down the server and demo.\n")

        sim_cmd = [sys.executable, os.path.join(BACKEND_DIR, "simulate_market.py"), "--symbol", "TCS", "--interval", "0.5"]
        sim_proc = subprocess.Popen(sim_cmd, cwd=BACKEND_DIR)
        sim_proc.wait()

    except KeyboardInterrupt:
        print("\n\nShutting down ChronosMatch demo services...")
    finally:
        if server_proc:
            try:
                server_proc.terminate()
                server_proc.wait(timeout=2)
            except Exception:
                try:
                    server_proc.kill()
                except Exception:
                    pass
        print("Demo services cleanly stopped. Goodbye!")


if __name__ == "__main__":
    main()
