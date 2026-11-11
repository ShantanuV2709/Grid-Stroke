<#
.SYNOPSIS
  GRID STROKE STUDIO Video Processing Pipeline
.DESCRIPTION
  Processes master source videos into:
  1. High-efficiency WebP poster image (at 1 second mark)
  2. Web-optimized 720p H.264 MP4 with faststart (web streaming)
  3. WebM VP9 fallback (optional/lightweight)
  4. 3 to 5 second muted preview loop (WebP or short MP4)
#>

param(
    [string]$InputDir = "./content/raw-videos",
    [string]$OutputDir = "./content/videos"
)

if (!(Test-Path $InputDir)) {
    Write-Host "Creating input directory: $InputDir"
    New-Item -ItemType Directory -Path $InputDir -Force | Out-Null
}
if (!(Test-Path $OutputDir)) {
    Write-Host "Creating output directory: $OutputDir"
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$videos = Get-ChildItem -Path $InputDir -Include *.mp4,*.mov,*.mkv,*.avi -Recurse

if ($videos.Count -eq 0) {
    Write-Host "No raw video files found in $InputDir. Place raw source videos there and run again."
    Write-Host "Usage: .\scripts\encode-videos.ps1 -InputDir ./content/raw -OutputDir ./content/videos"
    exit 0
}

foreach ($video in $videos) {
    $baseName = $video.BaseName
    $targetMp4 = Join-Path $OutputDir "$baseName.mp4"
    $targetPoster = Join-Path $OutputDir "$baseName-poster.webp"
    $targetPreview = Join-Path $OutputDir "$baseName-preview.mp4"

    Write-Host "Processing: $($video.Name)..."

    # 1. Generate WebP Poster
    ffmpeg -y -ss 00:00:01.000 -i $video.FullName -vframes 1 -vf "scale='min(1280,iw)':-2" -q:v 80 "$targetPoster"

    # 2. Web-Optimized H.264 720p with moov atom at beginning
    ffmpeg -y -i $video.FullName -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "$targetMp4"

    # 3. 4-second Muted Preview Loop (low bitrate, no audio)
    ffmpeg -y -ss 00:00:00 -to 00:00:04 -i $video.FullName -c:v libx264 -crf 28 -preset fast -an -vf "scale='min(640,iw)':-2" -movflags +faststart "$targetPreview"

    Write-Host "Done: $baseName"
}

Write-Host "All videos encoded successfully!"

