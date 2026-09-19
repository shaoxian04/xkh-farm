# XKH Farm - Design System

The page is **deep highland green so the produce supplies the colour**. Every
crop photograph sits on a warm light plate, and the tile behind it uses the
same value, so each crop reads as a specimen card on the dark ground. That
contrast is the whole visual idea; everything else stays quiet.

## What this replaced, and why

The first pass was a cream-and-serif editorial layout. It was rejected as "too
general", and an audit against known generative-design tells confirmed it:
45 tracked-out all-caps eyebrow labels, a `#F2EEE4` cream ground two shades off
the most common AI default, 24 identical fade-up reveals, hairline broadsheet
rules, a monospace face for data labels, arrows appended to links, and `No. 01`
markers on content that is not a sequence. Those are all gone. Do not
reintroduce them.

## Colour

Tokens live in `src/index.css` under `@theme`. Sampled from the farm's own
assets, not picked from a palette.

| Token     | Hex       | Source / use                                             |
| --------- | --------- | -------------------------------------------------------- |
| `night`   | `#07240F` | The page ground, deep highland forest                    |
| `night-2` | `#0C3319` | Raised surface on the dark ground                        |
| `forest`  | `#0E5A24` | **Sampled from the logo mark.** CTA band                 |
| `sage`    | `#9CB584` | **Sampled from an aerial of the fields.** Secondary text |
| `crate`   | `#2E3B52` | **Sampled from their packing crates.** Held in reserve   |
| `bone`    | `#F5F1E6` | Warm white, body text on dark                            |
| `bone-2`  | `#EAE6DA` | The one light band                                       |
| `sun`     | `#E8B33C` | Emphasis and buttons, used sparingly                     |
| `soil`    | `#1B1A14` | Text on the light band                                   |

`npm run check:contrast` derives every pairing from these tokens and fails if a
text pair drops below 4.5:1. Note the one encoded constraint: gold reaches only
4.37:1 on forest, so on that band it is a **button fill, never text**.

## Typography

One family: **Bricolage Grotesque**, variable across `opsz 12-96`,
`wdth 75-100`, `wght 300-800`. Display type runs narrow and heavy (`wdth 80`,
`wght 800`), which is what gives the headlines their poster weight; body runs at
`wdth 100`. Chinese crop names use **Noto Sans SC** via `.han`.

No monospace, no all-caps labels.

## Motion

One orchestrated moment and one piece of ambient motion. That is the budget.

- **The page-load reveal** (`Intro.jsx`): the farm's own logo draws itself, then
  lifts. It runs on **every page load** - the owner wants each arrival to open
  on the brand - but never on a client-side route change, since the component
  is not keyed to the route. Dismissible by click, key or scroll, with a 5.2s
  failsafe, and skipped entirely under reduced motion. The clip is 600kB, which
  is what makes running it every time affordable.
- **The crop wall** (`CropWall.jsx`): three rows of the 36 crops scrolling in
  alternating directions. It carries content, since the range is the sales
  argument for a wholesaler, so the motion is doing work. Pauses on hover and
  on focus.

Under reduced motion the wall stops animating, wraps into a static grid, and
hides its looping duplicates so each crop appears exactly once.

## Asset pipeline

Everything below is derived; the originals live in `materials/` and `img/`.

- **`public/brand/logo-*.webp`** - the logo keyed out of the animation's final
  frame at 1080p, in brand-green and bone variants. A far better source than the
  old `xkh_logo.jpg`.
- **`public/video/hero.mp4`** - only the text-free windows of the farm film
  (0-3.4s and 22.2-28.2s), concatenated. The rest of the reel carries burned-in
  titles that would collide with page copy.
- **`public/video/film.mp4`** - the full 35s promo with its own titles, offered
  as "watch the film" with `preload="none"`.
- **`public/video/intro.mp4`** - the logo draw-on, trimmed and doubled in speed.
- **`public/img/cut/`**, **`cut-sm/`** - crop photos with the studio backdrop
  flattened to the plate colour by `scripts/key-crops.py`. `cut-sm` feeds the
  crop wall, whose tiles cannot be lazy-loaded.

  The mask there is deliberately strict, and the output is opaque rather than
  cut to transparency. Several subjects are themselves white - turnip, radish,
  milk cabbage, pak choy stems - and nothing reliably separates a white turnip
  from the white paper behind it: same colour, both smooth, meeting at a soft
  edge. Any fill loose enough to swallow the drop shadow also leaks into the
  vegetable and bites a chunk out of it. Compositing onto a light plate makes
  both kinds of error quiet, so the mask never has to take that risk. Read the
  docstring before loosening the threshold.

Source video was HEVC, unplayable in Chrome and Firefox, and 52MB.

## House rules

- The plate colour is defined twice and the two must stay in step: `PLATE` in
  `scripts/key-crops.py` and `bg-bone-2` on the image wrapper in `CropWall.jsx`
  and `ProductGallery.jsx`. If they drift, the photo edge shows as a rectangle.
- Crop images use `object-contain`, not `object-cover`: the produce must not be
  cropped. The letterbox is invisible because the wrapper is the plate colour.
- The crop wall's tiles are deliberately **not** `loading="lazy"`. They start
  outside the viewport and are moved in by a transform, which does not
  re-trigger lazy loading, so they would stay blank.
- Keep `padding-inline` and `padding-block` separate on `.wrap` / `.band`; a
  padding shorthand on the container silently zeroes the section rhythm.
