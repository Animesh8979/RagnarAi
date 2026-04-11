@echo off
setlocal

set "COMFYUI_DIR=D:\ComfyUI"
set "COMFYUI_PYTHON=D:\comfy_data\.venv\Scripts\python.exe"
set "COMFYUI_PORT=8188"
set "TEMP=D:\comfy_data\tmp"
set "TMP=D:\comfy_data\tmp"
set "PIP_CACHE_DIR=D:\comfy_data\pip-cache"
set "HF_HOME=D:\comfy_data\hf"
set "HUGGINGFACE_HUB_CACHE=D:\comfy_data\hf\hub"
set "XDG_CACHE_HOME=D:\comfy_data\xdg-cache"
set "TORCH_HOME=D:\comfy_data\torch-cache"
set "CUDA_CACHE_PATH=D:\comfy_data\cuda-cache"
set "PYTHONPYCACHEPREFIX=D:\comfy_data\pycache"
set "TQDM_DISABLE=1"
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"

if not exist "%COMFYUI_PYTHON%" (
  echo ComfyUI Python runtime not found at %COMFYUI_PYTHON%
  exit /b 1
)

if not exist "%COMFYUI_DIR%\main.py" (
  echo ComfyUI entrypoint not found at %COMFYUI_DIR%\main.py
  exit /b 1
)

if not exist "%TEMP%" mkdir "%TEMP%"
if not exist "%PIP_CACHE_DIR%" mkdir "%PIP_CACHE_DIR%"
if not exist "%HF_HOME%" mkdir "%HF_HOME%"
if not exist "%HUGGINGFACE_HUB_CACHE%" mkdir "%HUGGINGFACE_HUB_CACHE%"
if not exist "%XDG_CACHE_HOME%" mkdir "%XDG_CACHE_HOME%"
if not exist "%TORCH_HOME%" mkdir "%TORCH_HOME%"
if not exist "%CUDA_CACHE_PATH%" mkdir "%CUDA_CACHE_PATH%"
if not exist "%PYTHONPYCACHEPREFIX%" mkdir "%PYTHONPYCACHEPREFIX%"

echo Checking ComfyUI on http://127.0.0.1:%COMFYUI_PORT%/system_stats ...
powershell -NoProfile -Command ^
  "try { Invoke-RestMethod 'http://127.0.0.1:%COMFYUI_PORT%/system_stats' -TimeoutSec 3 | Out-Null; Write-Host 'ComfyUI is already running on http://127.0.0.1:%COMFYUI_PORT%'; exit 0 } catch { exit 1 }"
if %errorlevel%==0 exit /b 0

echo Launching ComfyUI from %COMFYUI_PYTHON%
start "ComfyUI" cmd /c "\"%COMFYUI_PYTHON%\" \"%COMFYUI_DIR%\main.py\" --port %COMFYUI_PORT%"

echo Waiting for ComfyUI API to come online on 127.0.0.1:%COMFYUI_PORT% ...
powershell -NoProfile -Command ^
  "$deadline=(Get-Date).AddSeconds(150);" ^
  "while((Get-Date) -lt $deadline){" ^
  "  try { Invoke-RestMethod 'http://127.0.0.1:%COMFYUI_PORT%/system_stats' -TimeoutSec 3 | Out-Null; Write-Host 'ComfyUI is ready on http://127.0.0.1:%COMFYUI_PORT%'; exit 0 } catch {}" ^
  "  Start-Sleep -Seconds 2" ^
  "}" ^
  "Write-Host 'ComfyUI did not become ready within 150 seconds. Check the new terminal window for model or dependency errors.'; exit 1"

exit /b %errorlevel%