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

Two families, kept firmly apart so the serif stays the loud thing on the page.

**Fraunces** carries the big statements only - the h1/h2 rules, the `.disp`
wordmark, and the figures in the hero strip. It is variable across
`opsz 9-144`, `wght 100-900`, plus two custom axes: `SOFT` rounds the
terminals and `WONK` swaps in the off-kilter alternates. Display is set at
`opsz 144, SOFT 70, WONK 1` (`--disp-lg`) and label-size display at
`opsz 36, SOFT 50, WONK 0` (`--disp-sm`). `opsz` is a true optical size axis,
so it has to track the rendered size - a 20px run at `opsz 144` loses its thin
strokes.

**Archivo** carries everything meant to be read: body copy, navigation,
buttons, and every small heading via `.subhead`. It is variable across
`wdth 62-125`, `wght 100-900`; body sits at `wdth 100`, buttons at `wdth 95`,
small headings at `wdth 92`.

Chinese crop names and the owner's own mission line use **Noto Sans SC** via
`.han`.

No monospace, no all-caps labels.

Swapping the face is a two-file change: the two `--font-*` values in
`src/index.css` and the Google Fonts `<link>` in `index.html`. Nothing in the
components names a font.

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

- **The commitments** (`Commitment` in `Home.jsx`): each promise arrives as
  you reach it - the photograph uncovers upward out of a slight push-in, then
  its heading and text follow, with the right-hand column a step behind the
  left. Driven by `useReveal`, an IntersectionObserver hook that fires once
  and then leaves the element alone, so nothing re-animates on the way back
  up the page.

  Two things to keep in mind if you touch it. The markup renders **finished**
  and the hook only ever *adds* the starting position, so no-JS, reduced
  motion and a failed observer all land on a filled-in section rather than an
  empty green band. And the observed ref must go on a wrapper that is never
  clipped: Chrome intersects the target's own `clip-path`, so observing a
  clipped element deadlocks - it is clipped out of the viewport, never reports
  as intersecting, and stays hidden for good.

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
