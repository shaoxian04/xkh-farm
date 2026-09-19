#!/usr/bin/env bash
# Derive the site's web video from the farm's source footage.
#
# The sources live in ../../materials/ and are deliberately NOT in git: they are
# ~64MB, one file is 51MB (past GitHub's warning threshold), and git stores no
# delta for video, so every re-encode would add a full copy to history forever.
# Keep them in the project's own storage; only the derived files below ship.
#
# Source notes that drive the trims:
#   - xkh-video.mp4 is HEVC, which Chrome and Firefox will not play, and 720p.
#     It is a finished promo with BURNED-IN TITLES, so only its text-free
#     windows can be used behind page copy: 0-3.4s (aerial) and 22.2-28.2s
#     (harvest). Everything between carries the farm's own captions.
#   - "logo animation 2.mp4" is 1080p and draws the logo on between ~1.1s and
#     ~7.3s; the intro takes that span at double speed.
#
# Usage: bash scripts/build-video.sh
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="../materials"
OUT="public/video"
mkdir -p "$OUT"

if [ ! -f "$SRC/xkh-video.mp4" ]; then
  echo "missing $SRC/xkh-video.mp4 — restore the source footage first" >&2
  exit 1
fi

echo "hero loop (text-free windows only, native 1280x720)"
ffmpeg -v error -y -i "$SRC/xkh-video.mp4" -filter_complex \
  "[0:v]trim=0:3.4,setpts=PTS-STARTPTS,scale=1280:720[a];\
   [0:v]trim=22.2:28.2,setpts=PTS-STARTPTS,scale=1280:720[b];\
   [a][b]concat=n=2:v=1[v]" \
  -map "[v]" -an -c:v libx264 -crf 26 -preset veryslow \
  -maxrate 2600k -bufsize 5200k -movflags +faststart -pix_fmt yuv420p \
  "$OUT/hero.mp4"

echo "full promo film (their own titles; loaded only on click)"
ffmpeg -v error -y -i "$SRC/xkh-video.mp4" -an -vf "scale=1280:720" \
  -c:v libx264 -crf 30 -preset veryslow -movflags +faststart -pix_fmt yuv420p \
  "$OUT/film.mp4"

echo "logo draw-on, trimmed and doubled in speed, for the page-load reveal"
ffmpeg -v error -y -i "$SRC/logo animation 2.mp4" -filter_complex \
  "[0:v]trim=1.1:7.3,setpts=0.5*(PTS-STARTPTS),scale=1440:-2[v]" \
  -map "[v]" -an -c:v libx264 -crf 20 -preset slow \
  -movflags +faststart -pix_fmt yuv420p "$OUT/intro.mp4"


echo "farm stills for the commitments section"
# Four frames from text-free moments of the promo, one per promise. The film
# is 1280x720 and carries a small XKH watermark in the top-left corner, so
# every frame is cropped to 960x720 from x=240, which drops the watermark and
# keeps the subject. Timestamps were chosen off a 1fps contact sheet; the
# farm's own burned-in captions rule out everything else.
mkdir -p public/img/farm
still() {  # still <seconds> <name>
  ffmpeg -v error -y -ss "$1" -i "$SRC/xkh-video.mp4" -frames:v 1     -vf "crop=960:720:240:0" -quality 78 "public/img/farm/$2.webp"
}
still 13.60 field    # rows of lettuce in the highland beds
still 22.40 harvest  # a worker cutting a cabbage by hand
still 17.80 crate    # gloved hands lifting cherry tomatoes from a crate
still 26.60 bundle   # a worker bundling spring onions

echo "posters"
ffmpeg -v error -y -ss 0.6 -i "$OUT/hero.mp4" -vframes 1 -q:v 2 "$OUT/.hero.jpg"
ffmpeg -v error -y -i "$OUT/.hero.jpg" -quality 80 "$OUT/hero-poster.webp"
rm -f "$OUT/.hero.jpg"

echo
ls -la "$OUT"
