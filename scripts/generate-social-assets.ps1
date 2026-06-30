$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot
$Assets = Join-Path $Root "assets"
New-Item -ItemType Directory -Force -Path $Assets | Out-Null

function New-Canvas($Width, $Height) {
  $bmp = New-Object System.Drawing.Bitmap $Width, $Height
  $bmp.SetResolution(144, 144)
  return $bmp
}

function New-Font($Size, $Style = [System.Drawing.FontStyle]::Regular) {
  return New-Object System.Drawing.Font("Microsoft JhengHei", $Size, $Style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Add-RoundedRect($Graphics, $Brush, $X, $Y, $W, $H, $R) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $R, $R, 180, 90)
  $path.AddArc($X + $W - $R, $Y, $R, $R, 270, 90)
  $path.AddArc($X + $W - $R, $Y + $H - $R, $R, $R, 0, 90)
  $path.AddArc($X, $Y + $H - $R, $R, $R, 90, 90)
  $path.CloseFigure()
  $Graphics.FillPath($Brush, $path)
  $path.Dispose()
}

function Draw-PokeMathMark($Graphics, $Cx, $Cy, $Size) {
  $red = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232, 79, 79))
  $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 33, 47))
  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(24, 33, 47), [Math]::Max(4, $Size * 0.045))
  $circlePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(24, 33, 47), [Math]::Max(5, $Size * 0.06))
  $x = $Cx - $Size / 2
  $y = $Cy - $Size / 2
  $Graphics.FillPie($red, $x, $y, $Size, $Size, 180, 180)
  $Graphics.FillPie($white, $x, $y, $Size, $Size, 0, 180)
  $Graphics.DrawEllipse($circlePen, $x, $y, $Size, $Size)
  $Graphics.DrawLine($linePen, $x + $Size * 0.08, $Cy, $x + $Size * 0.92, $Cy)
  $Graphics.FillEllipse($white, $Cx - $Size * 0.16, $Cy - $Size * 0.16, $Size * 0.32, $Size * 0.32)
  $Graphics.DrawEllipse($circlePen, $Cx - $Size * 0.16, $Cy - $Size * 0.16, $Size * 0.32, $Size * 0.32)
  $font = New-Font ($Size * 0.28) ([System.Drawing.FontStyle]::Bold)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = [System.Drawing.RectangleF]::new(
    [single]($Cx - $Size * 0.5),
    [single]($Cy - $Size * 0.52),
    [single]$Size,
    [single]($Size * 0.34)
  )
  $Graphics.DrawString("+", $font, $ink, $rect, $fmt)
  $font.Dispose(); $fmt.Dispose(); $red.Dispose(); $white.Dispose(); $ink.Dispose(); $linePen.Dispose(); $circlePen.Dispose()
}

function Save-IconPng($Size, $Path, [bool]$Maskable = $false) {
  $bmp = New-Canvas $Size $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)),
    [System.Drawing.Color]::FromArgb(47, 111, 237),
    [System.Drawing.Color]::FromArgb(246, 195, 68),
    35
  )
  if ($Maskable) {
    $g.FillRectangle($bg, 0, 0, $Size, $Size)
    Draw-PokeMathMark $g ($Size / 2) ($Size / 2) ($Size * 0.58)
  } else {
    Add-RoundedRect $g $bg 0 0 $Size $Size ($Size * 0.18)
    Draw-PokeMathMark $g ($Size / 2) ($Size / 2) ($Size * 0.66)
  }
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bg.Dispose(); $g.Dispose(); $bmp.Dispose()
}

function Write-Ico($PngPaths, $OutPath) {
  $fs = [System.IO.File]::Create($OutPath)
  $bw = New-Object System.IO.BinaryWriter($fs)
  $bw.Write([UInt16]0)
  $bw.Write([UInt16]1)
  $bw.Write([UInt16]$PngPaths.Count)
  $offset = 6 + (16 * $PngPaths.Count)
  $entries = @()
  foreach ($path in $PngPaths) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $img = [System.Drawing.Image]::FromFile($path)
    $w = if ($img.Width -ge 256) { 0 } else { [byte]$img.Width }
    $h = if ($img.Height -ge 256) { 0 } else { [byte]$img.Height }
    $entries += [pscustomobject]@{ Width = $w; Height = $h; Bytes = $bytes; Offset = $offset }
    $offset += $bytes.Length
    $img.Dispose()
  }
  foreach ($entry in $entries) {
    $bw.Write([byte]$entry.Width)
    $bw.Write([byte]$entry.Height)
    $bw.Write([byte]0)
    $bw.Write([byte]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]32)
    $bw.Write([UInt32]$entry.Bytes.Length)
    $bw.Write([UInt32]$entry.Offset)
  }
  foreach ($entry in $entries) { $bw.Write($entry.Bytes) }
  $bw.Dispose(); $fs.Dispose()
}

function Save-OgImage($Path) {
  $W = 1200; $H = 630
  $bmp = New-Canvas $W $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $W, $H)),
    [System.Drawing.Color]::FromArgb(246, 249, 252),
    [System.Drawing.Color]::FromArgb(224, 236, 255),
    20
  )
  $g.FillRectangle($bg, 0, 0, $W, $H)

  $blue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(47, 111, 237))
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 33, 47))
  $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(86, 101, 126))
  $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 255, 255, 255))
  $yellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(246, 195, 68))

  Add-RoundedRect $g $white 54 54 1092 522 28
  Draw-PokeMathMark $g 970 240 250

  $eyebrowFont = New-Font 30 ([System.Drawing.FontStyle]::Bold)
  $titleFont = New-Font 76 ([System.Drawing.FontStyle]::Bold)
  $subFont = New-Font 36 ([System.Drawing.FontStyle]::Bold)
  $bodyFont = New-Font 27 ([System.Drawing.FontStyle]::Regular)
  $smallFont = New-Font 24 ([System.Drawing.FontStyle]::Bold)

  $g.DrawString("PokéAPI Math Battle", $eyebrowFont, $blue, 92, 102)
  $g.DrawString("寶可夢數學道館", $titleFont, $ink, 88, 148)
  $g.DrawString("ATG 即時對戰 × 加減乘除挑戰", $subFont, $ink, 94, 250)
  $g.DrawString("選寶可夢、答數學題、放招式，擊敗道館關主！", $bodyFont, $muted, 96, 314)

  Add-RoundedRect $g $blue 94 438 330 62 31
  $g.DrawString("立即開啟挑戰", $smallFont, [System.Drawing.Brushes]::White, 130, 456)
  Add-RoundedRect $g $yellow 454 438 420 62 31
  $g.DrawString("cagoooo.github.io/Poke", $smallFont, $ink, 492, 456)

  $eyebrowFont.Dispose(); $titleFont.Dispose(); $subFont.Dispose(); $bodyFont.Dispose(); $smallFont.Dispose()
  $bg.Dispose(); $blue.Dispose(); $ink.Dispose(); $muted.Dispose(); $white.Dispose(); $yellow.Dispose(); $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$tmp = Join-Path $Assets "_ico"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Save-IconPng 16 (Join-Path $tmp "favicon-16.png")
Save-IconPng 32 (Join-Path $tmp "favicon-32.png")
Save-IconPng 48 (Join-Path $tmp "favicon-48.png")
Save-IconPng 180 (Join-Path $Root "apple-touch-icon.png")
Save-IconPng 192 (Join-Path $Assets "icon-192.png")
Save-IconPng 512 (Join-Path $Assets "icon-512.png")
Save-IconPng 192 (Join-Path $Assets "icon-192-maskable.png") $true
Save-IconPng 512 (Join-Path $Assets "icon-512-maskable.png") $true
Write-Ico @((Join-Path $tmp "favicon-16.png"), (Join-Path $tmp "favicon-32.png"), (Join-Path $tmp "favicon-48.png")) (Join-Path $Root "favicon.ico")
Remove-Item -Recurse -Force $tmp
Save-OgImage (Join-Path $Assets "og-pokemon-math.png")

$svg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f6fed"/>
      <stop offset="1" stop-color="#f6c344"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="13" fill="url(#bg)"/>
  <circle cx="32" cy="32" r="21" fill="#fff" stroke="#18212f" stroke-width="4"/>
  <path d="M11 32h42" stroke="#18212f" stroke-width="4" stroke-linecap="round"/>
  <path d="M12 31a20 20 0 0 1 40 0z" fill="#e34f4f"/>
  <circle cx="32" cy="32" r="8" fill="#fff" stroke="#18212f" stroke-width="4"/>
  <path d="M32 13v10M27 18h10" stroke="#18212f" stroke-width="4" stroke-linecap="round"/>
</svg>
'@
[System.IO.File]::WriteAllText((Join-Path $Root "favicon.svg"), $svg, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "Generated favicon, app icons, and OG image."
