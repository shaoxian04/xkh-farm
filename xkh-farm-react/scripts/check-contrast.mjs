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

const luminance = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** [foreground, background, minimum] — null minimum means non-text. */
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
  // The light band
  ["soil", "bone-2", 4.5],
  ["soil-2", "bone-2", 4.5],
  ["bone", "forest", 4.5],
  // Button fills
  ["night", "sun", 4.5],
  ["night", "sun-hi", 4.5],
];

let failed = 0;

for (const [fg, bg, min] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    console.error(`? missing token: ${!tokens[fg] ? fg : bg}`);
    failed++;
    continue;
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  const label = `${fg} on ${bg}`.padEnd(26);
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
