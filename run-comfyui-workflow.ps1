param(
  [string]$WorkflowPath = "D:\anitgravity work\liveportrait_1650_api.json",
  [string]$ComfyUIHost = "http://127.0.0.1:8188",
  [int]$TimeoutSeconds = 1500
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $WorkflowPath)) {
  throw "Workflow file not found: $WorkflowPath"
}

$workflow = Get-Content -LiteralPath $WorkflowPath -Raw | ConvertFrom-Json
$clientId = "codex-" + [guid]::NewGuid().ToString()
$body = @{
  prompt = $workflow
  client_id = $clientId
} | ConvertTo-Json -Depth 40

$response = Invoke-RestMethod -Uri ($ComfyUIHost + "/prompt") -Method Post -ContentType "application/json" -Body $body -TimeoutSec 120
if (-not $response.prompt_id) {
  throw "ComfyUI did not return a prompt_id."
}

$promptId = $response.prompt_id
Write-Host ("Queued prompt: " + $promptId)

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
  Start-Sleep -Seconds 3
  $history = Invoke-RestMethod -Uri ($ComfyUIHost + "/history/" + $promptId) -TimeoutSec 60
  $entry = $history.$promptId
  if (-not $entry) {
    continue
  }

  $status = [string]$entry.status.status_str
  if ($status -eq "error") {
    $messages = @()
    foreach ($message in @($entry.status.messages)) {
      $messages += ($message | ConvertTo-Json -Compress -Depth 20)
    }
    throw ("Workflow failed: " + ($messages -join " | "))
  }

  if ($entry.outputs) {
    $entry.outputs | ConvertTo-Json -Depth 20
    exit 0
  }
}

throw "Timed out waiting for ComfyUI history."
