@echo off
setlocal
cd /d "D:\anitgravity work"

if not exist "D:\anitgravity work\.runtime-cache" mkdir "D:\anitgravity work\.runtime-cache"
if not exist "D:\anitgravity work\.runtime-cache\tmp" mkdir "D:\anitgravity work\.runtime-cache\tmp"
if not exist "D:\anitgravity work\.runtime-cache\npm-cache" mkdir "D:\anitgravity work\.runtime-cache\npm-cache"
if not exist "D:\anitgravity work\.runtime-cache\hf-home" mkdir "D:\anitgravity work\.runtime-cache\hf-home"
if not exist "D:\anitgravity work\.runtime-cache\transformers-cache" mkdir "D:\anitgravity work\.runtime-cache\transformers-cache"
if not exist "D:\anitgravity work\.runtime-cache\xdg-cache" mkdir "D:\anitgravity work\.runtime-cache\xdg-cache"
if not exist "D:\anitgravity work\.runtime-cache\pip-cache" mkdir "D:\anitgravity work\.runtime-cache\pip-cache"
if not exist "D:\remotion-cache" mkdir "D:\remotion-cache"

set "TEMP=D:\anitgravity work\.runtime-cache\tmp"
set "TMP=D:\anitgravity work\.runtime-cache\tmp"
set "TMPDIR=D:\anitgravity work\.runtime-cache\tmp"
set "REMOTION_TMPDIR=D:\remotion-cache"
set "HF_HOME=D:\anitgravity work\.runtime-cache\hf-home"
set "TRANSFORMERS_CACHE=D:\anitgravity work\.runtime-cache\transformers-cache"
set "XDG_CACHE_HOME=D:\anitgravity work\.runtime-cache\xdg-cache"
set "NPM_CONFIG_CACHE=D:\anitgravity work\.runtime-cache\npm-cache"
set "PIP_CACHE_DIR=D:\anitgravity work\.runtime-cache\pip-cache"

set "TARGET_DATE=%~1"
if not defined TARGET_DATE (
  for /f %%i in ('powershell -NoProfile -Command "(Get-Date).ToString(\"yyyy-MM-dd\")"') do set TARGET_DATE=%%i
)

echo Running batch preflight for %TARGET_DATE%
echo.

call node -e "require('dotenv').config(); require('./comfyui-bridge').isComfyUIRunning().then((ok)=>{ if(ok){ console.log('ComfyUI check: OK via authenticated bridge'); process.exit(0);} console.log('ComfyUI check: FAILED. Start the ComfyUI backend on the configured host first.'); process.exit(1);} ).catch((err)=>{ console.log('ComfyUI check: FAILED - ' + (err && err.message ? err.message : err)); process.exit(1); })"
if errorlevel 1 goto :fail

call cmd /c npm run voice:test
if errorlevel 1 goto :fail

call cmd /c npm run media:check
if errorlevel 1 goto :fail

call cmd /c npm run prepare:daily -- --date %TARGET_DATE% --force
if errorlevel 1 goto :fail

call cmd /c npm run daily:check -- --date %TARGET_DATE%
if errorlevel 1 goto :fail

echo.
echo Preflight complete for %TARGET_DATE%
exit /b 0

:fail
echo.
echo Preflight failed for %TARGET_DATE%
exit /b 1
