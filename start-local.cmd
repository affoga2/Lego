@echo off
cd /d "%~dp0"
set "PATH=%~dp0.tools\node-v22.22.0-win-x64;%PATH%"
call npm.cmd run dev
