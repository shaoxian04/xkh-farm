/**
 * Verifies the colour-contrast claims in DESIGN.md against the tokens actually
 * defined in src/index.css. Run with `npm run check:contrast`.
 *
 * Exits non-zero if any pair used for text drops below WCAG AA (4.5:1), so a
 * token tweak cannot silently break contrast.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** What the eye actually receives when `fg` is painted at `alpha` over `bg`. */
const over = (fg, bg, alpha) =>
  rgb(fg).map((c, i) => alpha * c + (1 - alpha) * rgb(bg)[i]);

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * [foreground, background, minimum, alpha?]
 * A null minimum means the pair is never used for text. An alpha is the
 * opacity the foreground is actually painted at, so a `text-bone/75` in the
 * markup is checked as what the eye receives, not as solid bone.
 */
const PAIRS = [
  // On the dark ground
  ["bone", "night", 4.5],
  ["sage", "night", 4.5],
  ["sun", "night", 4.5],
  ["bone", "night-2", 4.5],
  ["sage", "night-2", 4.5],
  // The forest CTA band. Gold reaches only 4.37:1 on forest, so on that band
  // it is used as a button fill (night on sun, 8.63:1) and never as text.
  ["bone", "forest", 4.5],
  ["sun", "forest", null],
  // Translucent body copy. These mirror the /NN opacities used in the markup;
  // change one there and change it here.
  ["bone", "forest", 4.5, 0.75],
  ["bone", "forest", 4.5, 0.8],
  ["bone", "night", 4.5, 0.85],
  ["bone", "night", 4.5, 0.65],
  // The light band
  ["soil", "bone-2", 4.5],
  ["soil-2", "bone-2", 4.5],
  ["bone", "forest", 4.5],
  // Button fills
  ["night", "sun", 4.5],
  ["night", "sun-hi", 4.5],
];

let failed = 0;

for (const [fg, bg, min, alpha] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    console.error(`? missing token: ${!tokens[fg] ? fg : bg}`);
    failed++;
    continue;
  }
  const front =
    alpha === undefined
      ? rgb(tokens[fg])
      : over(tokens[fg], tokens[bg], alpha);
  const ratio = contrast(front, rgb(tokens[bg]));
  const label = `${fg}${alpha === undefined ? "" : `/${alpha * 100}`} on ${bg}`.padEnd(
    26,
  );
  if (min === null) {
    console.log(`SKIP ${label} ${ratio.toFixed(2)}:1  fill only, never text`);
  } else if (ratio >= min) {
    console.log(`PASS ${label} ${ratio.toFixed(2)}:1`);
  } else {
    console.error(`FAIL ${label} ${ratio.toFixed(2)}:1  below ${min}:1`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} contrast check(s) failed.`);
  process.exit(1);
}
console.log("\nAll text pairs meet WCAG AA.");
