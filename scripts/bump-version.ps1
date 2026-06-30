param([string]$Notes = "內容更新")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$enc = New-Object System.Text.UTF8Encoding($false)
$today = Get-Date -Format "yyyy.MM.dd"
$versionPath = Join-Path $root "version.json"
$seq = 1

if (Test-Path $versionPath) {
  $oldVersion = (Get-Content $versionPath -Raw -Encoding UTF8 | ConvertFrom-Json).version
  if ($oldVersion -match "^$([regex]::Escape($today))-(\d+)$") {
    $seq = [int]$Matches[1] + 1
  }
}

$version = "$today-$seq"
$versionJson = [ordered]@{
  version = $version
  notes = $Notes
} | ConvertTo-Json
[System.IO.File]::WriteAllText($versionPath, $versionJson + [Environment]::NewLine, $enc)

$swPath = Join-Path $root "sw.js"
$sw = [System.IO.File]::ReadAllText($swPath, [System.Text.Encoding]::UTF8)
$sw = [regex]::Replace($sw, 'const BUILD_VERSION = "[^"]+";', "const BUILD_VERSION = `"$version`";")
$sw = [regex]::Replace($sw, 'styles\.css\?v=[^"]+', "styles.css?v=$version")
$sw = [regex]::Replace($sw, 'script\.js\?v=[^"]+', "script.js?v=$version")
[System.IO.File]::WriteAllText($swPath, $sw, $enc)

$indexPath = Join-Path $root "index.html"
$html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$html = [regex]::Replace($html, 'styles\.css\?v=[^"]+', "styles.css?v=$version")
$html = [regex]::Replace($html, 'script\.js\?v=[^"]+', "script.js?v=$version")
$html = [regex]::Replace($html, 'var APP_VERSION = "[^"]+";', "var APP_VERSION = `"$version`";")
[System.IO.File]::WriteAllText($indexPath, $html, $enc)

Write-Host "bumped -> $version"
