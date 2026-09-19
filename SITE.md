# Site Vision: Xin Kiar Huat Vegetables Supplier

A clean, attractive, and responsive portfolio website for a vegetable supplier in Cameron Highlands.
Showcasing fresh vegetables, company ethos, and contact details to potential clients and partners.

## Core Pages
1. Landing Page (Home)
   - Intro to Xin Kiar Huat
   - Values (Consistency, Freshness, Ethics)
2. Products
   - Comprehensive list of vegetables with images
3. Contact Us
   - Google Map
   - Contact details (+60 14-258 0200)

## Roadmap
- [x] Initial build
- [x] Product grid, contact map
- [x] Brand video integrated (transcoded from HEVC; 52MB source)
- [x] Crop filtering + bilingual search
- [x] Accessibility pass (AA contrast, focus, reduced motion)
- [x] Redesign: dark highland ground, keyed-out produce, crop wall - see DESIGN.md
- [x] Owner's vision and mission section (Fraunces/Archivo type, "Commitment")
- [x] Commitments rebuilt around four stills from the farm's own film
- [ ] Confirm the wholesale claims below

## Facts taken from the farm's own film

`materials/xkh-video.mp4` carries burned-in titles, which is where these come
from - they are the farm's own words, not invented:

- "Growing Fresh in Cameron Highlands Since 2005"
- "Over 20 Years of Farming Experience"
- "Wholesale Supply for Businesses and Retailers"
- "A Wide Variety of Fresh Vegetables"
- "Quality Produce. Delivered Fresh."

## The owner's vision and mission

Given by the owner, in Chinese:

> 我们的 vision 还有 mission 让客户吃到新鲜健康有机无化学安心的蔬菜还有其他的 premium 菜

The `Commitment` section on the home page is built from this. Two notes on how
it was worded:

- He said 有机 ("organic"). **The site does not use the word "organic"**, because
  in Malaysia that is a certification term (myOrganic) and claiming it without
  the certificate is a regulatory problem, not a copy problem. The page says
  "grown without chemicals" instead, which is what 无化学 means and which is his
  claim to make. If the farm does hold myOrganic certification, say so and the
  wording can change.
- 安心 has no clean English equivalent; the headline "Vegetables you can serve
  without a second thought" is carrying it.
- The Chinese line was on the page in the first pass and has been taken off at
  the owner's request. `.han` is still used for the crop names.

Each promise is illustrated with a still from `materials/xkh-video.mp4` rather
than a stock or crop photograph, so what the page shows is the farm's own
ground and its own people. `scripts/build-video.sh` regenerates them.

## Copy to confirm

These were written to fit the positioning and should be checked by the farm
before launch:

- "cut to order and packed the same day" (crop wall heading)
- Same-day dispatch and field-cooling for leafy lines
- Hand-grading at the packhouse
- The per-crop handling notes in `src/data/products.js`
- All four commitments in the `Commitment` section, which describe operations
  nobody has confirmed to me: same-day movement out of Bertam Valley, grading
  to one specification across all 36 lines, and a washing/sorting/crating
  hygiene routine. They are plausible for a farm of this size and they match
  the owner's four themes, but he should read them line by line.

## Known asset limitations

- The cherry tomato and tomato photographs show the fruit on a white dish. The
  dish is part of the photograph, not the backdrop, so background keying cannot
  remove it. Reshoot on a plain surface if it bothers you.
- The farm film is 720p, so it is used at its native width and never stretched
  full-bleed beyond it.
- The film carries the farm's own marks twice: burned-in titles across 12.5s of
  its 35.4s, and a standing logo watermark in the top-left corner of nearly
  every frame. With the film playing whole in the hero, neither can be removed
  - cropping the watermark slices the left edge from two captions, and delogo
  leaves a smeared rectangle that reads worse than the mark. **A copy of the
  footage without the titles would fix this, and would also make the aerials
  usable.** They are the only shots that show the scale of the place, and all
  three caption-free runs of aerial are under 0.6s. Worth asking whoever cut
  the promo.
- The hero and the "Watch the film" section now carry the same 35.4s, and
  film.mp4 has no audio track, so the section adds controls and nothing else.
  It is a candidate for removal, which would also drop 7.1MB from the repo.
