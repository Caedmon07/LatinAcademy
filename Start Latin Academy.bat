@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start Latin Academy.ps1"

if errorlevel 1 (
  echo.
  echo Latin Academy could not start.
  echo Please copy the error shown above and send it for review.
  echo.
  pause
)
