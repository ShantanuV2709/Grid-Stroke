#!/usr/bin/env bash
# Grid Stroke Studio - High Performance Video Transcoder
set -euo pipefail

INPUT_DIR="${1:-./content/raw-videos}"
OUTPUT_DIR="${2:-./content/videos}"

mkdir -p "$INPUT_DIR" "$OUTPUT_DIR"

for file in "$INPUT_DIR"/*.{mp4,mov,mkv,avi}; do
  [ -e "$file" ] || continue
  filename=$(basename -- "$file")
  base="${filename%.*}"
  
  echo ">>> Encoding $filename..."
  
  # 1. Poster WebP at 1.0s
  ffmpeg -y -ss 00:00:01.000 -i "$file" -vframes 1 -vf "scale='min(1280,iw)':-2" -q:v 80 "$OUTPUT_DIR/${base}-poster.webp"
  
  # 2. Main Web MP4 (H.264, 720p, faststart)
  ffmpeg -y -i "$file" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "$OUTPUT_DIR/${base}.mp4"
  
  # 3. 4-second Muted Preview for hover-scrub
  ffmpeg -y -ss 00:00:00 -to 00:00:04 -i "$file" -c:v libx264 -crf 28 -preset fast -an -vf "scale='min(640,iw)':-2" -movflags +faststart "$OUTPUT_DIR/${base}-preview.mp4"
  
  echo ">>> Finished $base"
done

