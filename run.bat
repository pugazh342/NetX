@echo off
TITLE NetX Launcher
echo ====================================================
echo   STARTING NETX SENTRY PLATFORM
echo ====================================================
echo.

:: 1. Start Backend (New Window)
echo [+] Launching Python Backend...
start "NetX Backend" cmd /k "call venv\Scripts\activate && python -m backend.app.main"

:: 2. Start Frontend (New Window)
echo [+] Launching React Frontend...
start "NetX Frontend" cmd /k "cd frontend && npm run dev"

:: 3. Open Browser
echo [+] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul
echo [+] Opening Dashboard...
start http://localhost:5173

echo.
echo [SUCCESS] NetX Sentry is running.
echo Close the popup windows to stop the servers.
pause