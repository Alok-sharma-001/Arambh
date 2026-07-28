#!/usr/bin/env python3
"""
⚔️ Arambh Development Launcher ⚔️
Launches both Backend (FastAPI/Uvicorn) and Frontend (Vite) concurrently with unified output, automatic port cleanup, and graceful Ctrl+C handling.
"""

import sys
import os
import subprocess
import signal
import time
import socket
from pathlib import Path

ROOT_DIR = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# Determine python/uvicorn binary inside backend virtualenv
VENV_BIN = BACKEND_DIR / "venv" / ("Scripts" if sys.platform == "win32" else "bin")
UVICORN_BIN = VENV_BIN / ("uvicorn.exe" if sys.platform == "win32" else "uvicorn")

processes = []

def print_banner():
    print("\033[36m" + "=" * 60 + "\033[0m")
    print("\033[1;33m          ⚔️  ARAMBH DEVELOPMENT LAUNCHER ⚔️\033[0m")
    print("\033[36m" + "=" * 60 + "\033[0m")

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

def kill_process_on_port(port: int):
    if not is_port_in_use(port):
        return
    print(f"\033[33m🧹 Port {port} is currently in use by an existing process. Cleaning up...\033[0m")
    try:
        if sys.platform == "win32":
            subprocess.run(
                f"for /f \"tokens=5\" %a in ('netstat -aon ^| findstr :{port}') do taskkill /f /pid %a",
                shell=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        else:
            subprocess.run(
                ["fuser", "-k", f"{port}/tcp"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
    except Exception:
        pass
    time.sleep(1)

def cleanup(signum=None, frame=None):
    print("\n\033[31m🛑 Shutting down Arambh dev servers...\033[0m")
    for p in processes:
        if p.poll() is None:
            try:
                p.terminate()
                p.wait(timeout=3)
            except Exception:
                p.kill()
    print("\033[32m✓ Cleanup complete. Have a great day!\033[0m")
    sys.exit(0)

def main():
    print_banner()

    # Register signal handlers for graceful exit
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # Automatically free ports if leftover background processes exist
    kill_process_on_port(8000)
    kill_process_on_port(5173)

    env = os.environ.copy()
    env["CI"] = "true"  # Prevents Vite from attempting interactive TTY shortcut reads

    # 0. Run Database Migrations
    alembic_bin = VENV_BIN / ("alembic.exe" if sys.platform == "win32" else "alembic")
    if alembic_bin.exists():
        print("\033[34m⚡ Checking database migrations (Alembic)... \033[0m")
        try:
            subprocess.run([str(alembic_bin), "upgrade", "head"], cwd=str(BACKEND_DIR), check=True)
            print("\033[32m✓ Database migrations up to date!\033[0m")
        except Exception as e:
            print(f"\033[33m⚠️ Migration check notice: {e}\033[0m")

    # 1. Start Backend
    print("\033[34m⚡ Starting Backend Server (Uvicorn)... \033[0m")
    backend_cmd = [
        str(UVICORN_BIN) if UVICORN_BIN.exists() else "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000"
    ]
    
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(BACKEND_DIR),
        stdin=subprocess.DEVNULL,
        env=env,
        shell=False
    )
    processes.append(backend_proc)
    print("\033[32m✓ Backend running at: http://localhost:8000\033[0m")

    # 2. Start Frontend
    print("\033[34m⚡ Starting Frontend Dev Server (Vite)... \033[0m")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev", "--", "--host"]
    
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(FRONTEND_DIR),
        stdin=subprocess.DEVNULL,
        env=env,
        shell=False
    )
    processes.append(frontend_proc)
    print("\033[32m✓ Frontend running at: http://localhost:5173\033[0m")

    print("\n\033[1;32m🔥 Both servers are running in parallel!\033[0m")
    print("\033[1;36m👉 Open your browser: http://localhost:5173\033[0m")
    print("\033[90mPress [Ctrl + C] to terminate both servers.\033[0m\n")

    # Monitor processes
    try:
        while True:
            for p in processes:
                if p.poll() is not None:
                    print(f"\033[31m⚠️ A process terminated unexpectedly with exit code {p.returncode}\033[0m")
                    cleanup()
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
