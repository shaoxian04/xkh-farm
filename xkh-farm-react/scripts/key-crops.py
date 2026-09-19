#!/usr/bin/env python3
"""
Normalise the studio backdrop of the crop photographs to one flat plate colour.

Source:  ../img/prod_*.jpg|png  (repo root, the originals)
Output:  public/img/cut/*.webp     720px, for the crops grid
         public/img/cut-sm/*.webp  440px, for the crop wall

Background goes to PLATE rather than to transparency, and the mask that decides
what counts as background is deliberately conservative. Both choices come from
the same observation:

The photographs were shot on white with soft drop shadows, and several subjects
are themselves white - turnip, radish, milk cabbage, the stems of pak choy.
There is no reliable signal separating a white turnip from the white paper
behind it: they share colour, they are both smooth, and they meet at a soft
edge, so any flood fill loose enough to swallow the drop shadow also leaks into
the vegetable and bites a chunk out of it.

Cutting to transparency on a dark page makes both errors loud - a missed shadow
is a bright white pool, a bite is a hole. Compositing onto a light plate makes
both quiet: the plate is already light, so a surviving shadow just reads as the
soft shadow it is. That removes the need to chase shadows aggressively, so the
mask can stay strict and never damage the produce.

The tile behind these images in the UI uses the same PLATE value, so the photo
edge is seamless. Output is opaque, which also rules out the halo that lossy
WebP's separately-stored alpha channel produces.

Requires: pillow, numpy, scipy, and ffmpeg on PATH.
"""
import glob
import os
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = os.path.join(os.path.dirname(__file__), "..", "..", "img")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")

PLATE = (234, 230, 218)  # --color-bone-2 #EAE6DA
GRID_WIDTH = 720  # crops page tiles render ~330px, so 720 covers 2x
WALL_WIDTH = 440  # crop wall tiles render ~288px


def flatten(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)

    # Estimate the backdrop from the border: it is not always pure white, some
    # sheets are a warm off-white with a soft gradient.
    border = np.concatenate([a[0, :], a[-1, :], a[:, 0], a[:, -1]])
    ref = np.median(border, axis=0)

    # Strict: unmistakably the backdrop. Loosening this is what bites into
    # white produce - see the module docstring before touching it.
    backdrop = np.abs(a - ref).max(2) < 18

    labelled, _ = ndimage.label(backdrop)
    touching = (
        set(labelled[0, :])
        | set(labelled[-1, :])
        | set(labelled[:, 0])
        | set(labelled[:, -1])
    )
    touching.discard(0)
    bg = (
        np.isin(labelled, list(touching))
        if touching
        else np.zeros(backdrop.shape, bool)
    )
    bg = ndimage.binary_closing(bg, np.ones((5, 5)))

    # Some sources carry a 1-2px frame line that would otherwise survive as a
    # rectangle once the rest of the backdrop is flattened.
    bg[:2, :] = True
    bg[-2:, :] = True
    bg[:, :2] = True
    bg[:, -2:] = True

    # Soft boundary so the subject keeps a natural edge against the plate.
    cover = ndimage.gaussian_filter(bg.astype(np.float32), sigma=1.0)
    cover = np.clip((cover - 0.30) / 0.45, 0, 1)[..., None]

    out = a * (1 - cover) + np.array(PLATE, np.float32) * cover
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def webp(src_png, dst, width, quality):
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", src_png,
         "-vf", f"scale='min({width},iw)':-1", "-quality", str(quality), dst],
        check=True,
    )


def main():
    for d in ("cut", "cut-sm"):
        os.makedirs(os.path.join(OUT, d), exist_ok=True)

    sources = sorted(
        glob.glob(os.path.join(SRC, "prod_*.jpg"))
        + glob.glob(os.path.join(SRC, "prod_*.png"))
    )
    if not sources:
        sys.exit(f"no source crops found in {os.path.abspath(SRC)}")

    for src in sources:
        stem = os.path.splitext(os.path.basename(src))[0]
        tmp = os.path.join(OUT, "cut", stem + ".png")
        flatten(src).save(tmp)
        webp(tmp, os.path.join(OUT, "cut", stem + ".webp"), GRID_WIDTH, 84)
        webp(tmp, os.path.join(OUT, "cut-sm", stem + ".webp"), WALL_WIDTH, 80)
        os.remove(tmp)

    print(f"flattened {len(sources)} crops onto the plate -> cut/ and cut-sm/")


if __name__ == "__main__":
    main()
