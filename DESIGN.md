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

The original budget here was one orchestrated moment and one piece of ambient
motion. **On 2026-10-05 the owner asked for considerably more** - every
section moving as you scroll, and "fancier" than a plain fade - so the budget
is now per section, with each one given a single idea of its own rather than
the same reveal repeated 24 times (which is what the first pass was rejected
for; see above).

Everything is GSAP: ScrollTrigger for scroll-linked work, SplitText for the
headlines, and Lenis for inertial scrolling driven off GSAP's ticker so the
two read the same frame. Setup and the shared helpers are in
`src/lib/gsap.js` and `src/lib/smooth.js`. The libraries add about 57kB
gzipped to the bundle.

- **The page-load reveal** (`Intro.jsx`): the farm's own logo draws itself, then
  lifts. It runs on **every page load** - the owner wants each arrival to open
  on the brand - but never on a client-side route change, since the component
  is not keyed to the route. Dismissible by click, key or scroll, with a 5.2s
  failsafe, and skipped entirely under reduced motion. The clip is 600kB, which
  is what makes running it every time affordable. While it plays it sets
  `html[data-intro]`; `afterIntro()` holds the hero entrance and Lenis until it
  fires `intro:done`, or they would finish unseen behind it.
- **The hero film**: the farm's whole 35.4s promo, muted and looping. It is
  the film as the farm made it, titles and end card included, which is the
  owner's call - the alternative, a re-cut of only the caption-free windows,
  is recorded in `scripts/build-video.sh` if the view changes. The overlay is
  tuned to it: the last 7.7s are a cream end card, so the scrim has to hold
  light text against a light frame, which is why the top stop is `night/45`
  and the header has a scrim of its own. Measured over that frame: nav 8.4:1,
  headline 6.5:1, paragraph 8.6:1, stat labels 6.5:1.

  On arrival the logo un-blurs, the letters of the title flip up one by one,
  and the figures count up. Scrolling away pushes the film in and lifts the
  copy out.
- **Headlines everywhere** rise word by word out of masked lines
  (`riseWords`); body copy rises line by line (`riseLines`).
- **The crop wall** (`CropWall.jsx`): three rows of the 36 crops scrolling in
  alternating directions. It carries content, since the range is the sales
  argument for a wholesaler, so the motion is doing work. Pauses on hover and
  on focus. On top of the marquee, the rows slide against each other with the
  scroll and lean into a fast scroll.
- **The story photo** opens out of a growing circle, then drifts.
- **The commitments** (`Commitment` in `Home.jsx`): from 1024px the row pins
  and the scroll moves the four promises sideways; each photo opens from a
  rounded window and un-zooms as it arrives. Below 1024px they stack and do
  the same one at a time.
- **The film** grows from a small rounded card to full width; its play button
  follows the pointer.
- **The enquiry** has "Fresh · Healthy · Chemical-free" in outlined type
  sliding along its foot.
- **Site-wide**: the header hides on the way down and returns on the way up;
  solid buttons lean toward the pointer; a sun hairline tracks scroll progress.

Things that have already gone wrong once, so check them if you touch this:

- SplitText masks each line with a box exactly one line tall, which shaves the
  descenders off Fraunces at its tight leading. `.split-line-mask` pads the
  box (and the rise starts far enough down to clear the padding). Always pass
  `linesClass: "split-line"` when splitting with a mask.
- When two tweens touch the same element, write the entrance as `fromTo`, not
  `from`. A `from` records the element's *current* value as its end, and the
  story photo once settled at 1.6x zoom that way.
- In the pinned row, the last panel never travels further left than about
  halfway across, because the row stops flush right. Its trigger has to finish
  before that (`left 62%`) or the last photo is left half open.
- The crop-wall rows carry `margin-inline: -25vw` (motion only) so their
  scroll-linked slide never exposes an empty strip at either edge.
- Lenis turns off iframe pointer events while it runs; `index.css` turns them
  back on so the contact map stays usable.

Every animation is registered inside `gsap.matchMedia()` under
`(prefers-reduced-motion: no-preference)`, so under reduced motion nothing is
hidden, split or pinned, Lenis is not started, and the page is the markup as
written. The wall stops animating, wraps into a static grid, and hides its
looping duplicates so each crop appears exactly once; the promise row scrolls
sideways on its own.

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

## Caching

Two policies, in `xkh-farm-react/vercel.json`.

Everything under `/assets/` is emitted by Vite with a content hash in the
filename, so the URL changes whenever the bytes do. Those are immutable for a
year.

Everything under `/video/`, `/img/` and `/brand/` keeps a **fixed filename
across rebuilds** - `hero.mp4` is always `hero.mp4`. That means the only thing
telling a browser its copy is out of date is the cache header, so those are
`max-age=0, must-revalidate`: the browser asks every time and the CDN answers
304 when nothing changed, which costs a round trip rather than a re-download.

This was originally `max-age=86400, must-revalidate`, which is a trap.
`must-revalidate` does not mean "revalidate every time" - it only governs what
happens once a response has gone *stale*. While still fresh, the browser
serves from cache without asking. So a rebuilt `hero.mp4` kept showing the old
one for up to 24 hours, on the same URL, with the right file sitting on the
server.

If these files ever get big enough that the round trip matters, the fix is to
fingerprint them rather than to lengthen the max-age: move them into `src/`
and `import` them so Vite hashes the names, and they can then be immutable
like everything else.
