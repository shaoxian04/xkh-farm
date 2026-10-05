import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/**
 * Every animation on the site is registered inside gsap.matchMedia() under
 * this query, so anyone who has asked for reduced motion gets the markup
 * exactly as written: nothing hidden, nothing split, nothing pinned.
 */
export const MOTION = "(prefers-reduced-motion: no-preference)";

/** The site's one easing family: fast out, long settle. */
export const EASE = "expo.out";

/**
 * Runs `fn` once the intro overlay has started to lift, or straight away if
 * there is no intro (a client-side route change, or reduced motion). Intro
 * sets html[data-intro] while it plays and fires `intro:done` as it leaves.
 */
export function afterIntro(fn) {
  if (!document.documentElement.dataset.intro) {
    fn();
    return () => {};
  }
  window.addEventListener("intro:done", fn, { once: true });
  return () => window.removeEventListener("intro:done", fn);
}

/**
 * A headline that rises out of its own lines, word by word, with a slight
 * tilt that straightens as it lands. Lines are masked, so words come up from
 * behind an invisible edge rather than fading in from nowhere.
 *
 * autoSplit re-splits after the web fonts land and on resize (line breaks
 * move), and because the tween is returned from onSplit GSAP carries its
 * progress across the re-split instead of replaying it.
 */
export function riseWords(el, { trigger = el, delay = 0, start = "top 85%" } = {}) {
  return SplitText.create(el, {
    type: "lines,words",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 140,
        rotate: 6,
        transformOrigin: "0% 100%",
        duration: 1.3,
        ease: EASE,
        stagger: 0.05,
        delay,
        scrollTrigger: trigger === false ? undefined : { trigger, start },
      }),
  });
}

/** Body copy: each line slides up out of its mask, one after another. */
export function riseLines(el, { trigger = el, delay = 0, start = "top 88%" } = {}) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 130,
        duration: 1.1,
        ease: EASE,
        stagger: 0.08,
        delay,
        scrollTrigger: trigger === false ? undefined : { trigger, start },
      }),
  });
}

/** Anything else: lifts and fades in, staggered if given several targets. */
export function riseIn(targets, { trigger, delay = 0, start = "top 88%", y = 50, stagger = 0.1 } = {}) {
  return gsap.from(targets, {
    y,
    autoAlpha: 0,
    duration: 1.1,
    ease: EASE,
    stagger,
    delay,
    scrollTrigger: trigger === false ? undefined : { trigger: trigger ?? targets, start },
  });
}
