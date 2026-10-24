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
#
#     The hero ran the film WHOLE for a while, at the owner's decision. It
#     was reverted on 2026-10-24: the burned-in titles ran straight through
#     the hero copy, and the 4.6MB file downloaded on every visit. The hero
#     is now the harvest run alone, watermark cropped and slowed to half
#     speed (see below). The whole film stays available as film.mp4.
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

echo "hero background (the caption-free harvest run, slowed)"
# 21.8-27.7s is the longest run with no burned-in titles. It cuts four times
# in 5.9s, which reads as a flicker behind static copy, so it plays at half
# speed: an 11.8s loop with a cut every 2-4s. Cropping from x=200 removes the
# standing watermark. ~1.5MB, against the 4.6MB of the whole film.
ffmpeg -v error -y -ss 21.8 -to 27.7 -i "$SRC/xkh-video.mp4" -an \
  -vf "crop=iw-200:ih:200:0,setpts=2*PTS,scale=-2:720" \
  -c:v libx264 -crf 30 -preset veryslow \
  -maxrate 1200k -bufsize 2400k -movflags +faststart -pix_fmt yuv420p \
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
# The hero's poster is its own first shot, so the frame does not jump when
# playback starts.
ffmpeg -v error -y -ss 1.5 -i "$OUT/hero.mp4" -vframes 1 -q:v 2 "$OUT/.hero.jpg"
ffmpeg -v error -y -i "$OUT/.hero.jpg" -quality 80 "$OUT/hero-poster.webp"
rm -f "$OUT/.hero.jpg"

# The film's poster is the greens being cut at 24.8s: caption-free, and the
# one harvest shot none of the commitment stills already uses.
ffmpeg -v error -y -ss 24.8 -i "$OUT/film.mp4" -vframes 1 -q:v 2 "$OUT/.film.jpg"
ffmpeg -v error -y -i "$OUT/.film.jpg" -quality 80 "$OUT/film-poster.webp"
rm -f "$OUT/.film.jpg"

echo
ls -la "$OUT"
