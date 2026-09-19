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
#     It is a finished promo and it carries the farm's own marks twice over:
#       * BURNED-IN TITLES through most of its 35s. Mapped off a 2fps contact
#         sheet, the only caption-free runs long enough to use are
#         17.4-18.8s (tomatoes going into the crate) and 21.8-27.7s
#         (harvesting). The opening aerial is not usable: the logo draws
#         itself on across 0-3.4s and the title holds until about 6.3s.
#       * FAST CUTTING. This is a promo, edited to hold attention on its own,
#         and the harvest run alone cuts four times in 5.9 seconds. Behind
#         static hero copy that reads as a flicker - people take it for the
#         video being sped up. Shot boundaries, from `select='gt(scene,0.25)'`:
#           21.80 cabbage | 23.10 chives | 24.03 greens | 25.83 onions | 27.70
#           17.40 crate   | 18.40 (cut)  | 18.80
#       * A STANDING WATERMARK of the logo in the top-left corner, on almost
#         every frame, roughly x=30..175, y=15..145. Cropping from x=200 is
#         what removes it, at the cost of 200px of width.
#     Both matter for the hero, which sits directly under the page's own logo
#     lockup - a second XKH mark in shot reads as a mistake.
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

echo "hero loop (two longest shots, eased to 0.63x, watermark cropped off)"
# Only the two longest continuous shots are used - greens+onions (24.03-27.70)
# and the crate (17.40-18.40) - so the loop carries three cuts in 7.3s rather
# than six. They are then eased to 0.63x, which lets each shot hold for about
# three seconds instead of one and a half.
#
# minterpolate does the slowdown by synthesising frames, not by repeating them:
# straight setpts would give 30fps carrying 19 distinct frames a second, which
# judders. Check it with `ffmpeg -i hero.mp4 -vf mpdecimate -f null -`; every
# frame should survive. It is the slow step in this script, around 40s.
ffmpeg -v error -y -i "$SRC/xkh-video.mp4" -filter_complex \
  "[0:v]trim=24.03:27.70,setpts=PTS-STARTPTS,crop=1080:720:200:0,\
minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,\
setpts=1.6*PTS[a];\
   [0:v]trim=17.40:18.40,setpts=PTS-STARTPTS,crop=1080:720:200:0,\
minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,\
setpts=1.6*PTS[b];\
   [a][b]concat=n=2:v=1[v]" \
  -map "[v]" -an -r 30 -c:v libx264 -crf 26 -preset slow \
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

# The film keeps its own 16:9 poster. The hero's is 3:2 since the crop, and a
# 3:2 poster in a 16:9 <video> pillarboxes for the moment before playback.
ffmpeg -v error -y -ss 22.4 -i "$OUT/film.mp4" -vframes 1 -q:v 2 "$OUT/.film.jpg"
ffmpeg -v error -y -i "$OUT/.film.jpg" -quality 80 "$OUT/film-poster.webp"
rm -f "$OUT/.film.jpg"

echo
ls -la "$OUT"
