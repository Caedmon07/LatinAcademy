param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

function Get-ContentType([string]$Path) {
    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "application/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".svg"  { return "image/svg+xml" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".webp" { return "image/webp" }
        ".gif"  { return "image/gif" }
        ".mp3"  { return "audio/mpeg" }
        ".wav"  { return "audio/wav" }
        ".ico"  { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

function Resolve-SafePath([string]$UrlPath) {
    $decoded = [System.Uri]::UnescapeDataString($UrlPath)
    $relative = $decoded.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)

    if ([string]::IsNullOrWhiteSpace($relative)) {
        $relative = "index.html"
    }

    $candidate = [System.IO.Path]::GetFullPath((Join-Path $Root $relative))
    $rootFull = [System.IO.Path]::GetFullPath($Root)

    if (-not $candidate.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }

    if (Test-Path $candidate -PathType Container) {
        $candidate = Join-Path $candidate "index.html"
    }

    return $candidate
}

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "Unable to start Latin Academy on port $Port." -ForegroundColor Red
    Write-Host "Another application may already be using that port." -ForegroundColor Yellow
    Write-Host "Try running:" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -Port 8080"
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host ""
Write-Host "Latin Academy is running at $prefix" -ForegroundColor Green
Write-Host "Keep this window open while using the site." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Cyan
Write-Host ""

Start-Process $prefix

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $requestPath = $context.Request.Url.AbsolutePath
        $filePath = Resolve-SafePath $requestPath

        if ($null -eq $filePath -or -not (Test-Path $filePath -PathType Leaf)) {
            $context.Response.StatusCode = 404
            $message = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
            $context.Response.ContentType = "text/plain; charset=utf-8"
            $context.Response.ContentLength64 = $message.Length
            $context.Response.OutputStream.Write($message, 0, $message.Length)
            $context.Response.OutputStream.Close()
            continue
        }

        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $context.Response.StatusCode = 200
            $context.Response.ContentType = Get-ContentType $filePath
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.AddHeader("Cache-Control", "no-store")
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $context.Response.StatusCode = 500
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("500 - Server error")
            $context.Response.ContentType = "text/plain; charset=utf-8"
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } finally {
            $context.Response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
