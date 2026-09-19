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
- [ ] Confirm the wholesale claims below

## Facts taken from the farm's own film

`materials/xkh-video.mp4` carries burned-in titles, which is where these come
from - they are the farm's own words, not invented:

- "Growing Fresh in Cameron Highlands Since 2005"
- "Over 20 Years of Farming Experience"
- "Wholesale Supply for Businesses and Retailers"
- "A Wide Variety of Fresh Vegetables"
- "Quality Produce. Delivered Fresh."

## Copy to confirm

These were written to fit the positioning and should be checked by the farm
before launch:

- "cut to order and packed the same day" (crop wall heading)
- Same-day dispatch and field-cooling for leafy lines
- Hand-grading at the packhouse
- The per-crop handling notes in `src/data/products.js`

## Known asset limitations

- The cherry tomato and tomato photographs show the fruit on a white dish. The
  dish is part of the photograph, not the backdrop, so background keying cannot
  remove it. Reshoot on a plain surface if it bothers you.
- The farm film is 720p, so it is used at its native width and never stretched
  full-bleed beyond it.
