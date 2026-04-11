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
if not exist "D:\anitgravity work\.runtime-cache\torch-cache" mkdir "D:\anitgravity work\.runtime-cache\torch-cache"
if not exist "D:\anitgravity work\.runtime-cache\cuda-cache" mkdir "D:\anitgravity work\.runtime-cache\cuda-cache"
if not exist "D:\anitgravity work\.runtime-cache\puppeteer-cache" mkdir "D:\anitgravity work\.runtime-cache\puppeteer-cache"
if not exist "D:\anitgravity work\.runtime-cache\playwright" mkdir "D:\anitgravity work\.runtime-cache\playwright"
if not exist "D:\anitgravity work\.runtime-cache\pycache" mkdir "D:\anitgravity work\.runtime-cache\pycache"
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
set "TORCH_HOME=D:\anitgravity work\.runtime-cache\torch-cache"
set "CUDA_CACHE_PATH=D:\anitgravity work\.runtime-cache\cuda-cache"
set "PUPPETEER_CACHE_DIR=D:\anitgravity work\.runtime-cache\puppeteer-cache"
set "PLAYWRIGHT_BROWSERS_PATH=D:\anitgravity work\.runtime-cache\playwright"
set "PYTHONPYCACHEPREFIX=D:\anitgravity work\.runtime-cache\pycache"
set "NODE_OPTIONS=--max-old-space-size=4096"

if not defined FORCE_REFRESH_SCRIPT_PACK set "FORCE_REFRESH_SCRIPT_PACK=1"
if not defined ENABLE_REMOTE_STORY_MOTION set "ENABLE_REMOTE_STORY_MOTION=0"
if not defined DAILY_NORMAL_VIDEO_COUNT set "DAILY_NORMAL_VIDEO_COUNT=4"
if not defined DAILY_STORY_VIDEO_COUNT set "DAILY_STORY_VIDEO_COUNT=2"
if not defined STORY_PART_COUNT set "STORY_PART_COUNT=2"

for /f %%i in ('powershell -NoProfile -Command "(Get-Date).ToString(\"yyyy-MM-dd\")"') do set DATESTAMP=%%i
set "LOGFILE=renders\today-launch-%DATESTAMP%.log"
set "ERRFILE=renders\today-launch-%DATESTAMP%.err.log"
set "RUNNER_ARGS=--gap-minutes 60 --instagram"

if /I "%FORCE_REFRESH_SCRIPT_PACK%"=="1" (
  set "RUNNER_ARGS=--refresh-script-pack %RUNNER_ARGS%"
)

echo Starting daily pipeline for %DATESTAMP%
echo Log: %LOGFILE%
echo Error Log: %ERRFILE%
echo Ensuring ComfyUI is online...
call "D:\anitgravity work\start-comfyui.cmd"
if errorlevel 1 exit /b 1

"C:\Program Files\nodejs\node.exe" run-today-watchdog.js %RUNNER_ARGS% >> "%LOGFILE%" 2>> "%ERRFILE%"