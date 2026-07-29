$site = Get-ChildItem -Path $PSScriptRoot -Filter "index.html" -File -Recurse -ErrorAction SilentlyContinue |
Where-Object { $_.FullName -notmatch "\\node_modules\\" } |
Sort-Object { $_.FullName.Length } |
Select-Object -First 1

if (-not $site) {
    Write-Host "ERROR: index.html was not found." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit
}

Start-Process "http://localhost:8080"

npx.cmd --yes http-server "$($site.Directory.FullName)" -p 8080 -c-1