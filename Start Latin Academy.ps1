Set-Location $PSScriptRoot
if (Get-Command py -ErrorAction SilentlyContinue) {
    py .\serve.py
} else {
    python .\serve.py
}
