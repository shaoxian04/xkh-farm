import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Inertial scrolling, driven from GSAP's ticker so Lenis and ScrollTrigger
 * read the same frame — otherwise pinned and scrubbed sections visibly lag a
 * frame behind the page.
 *
 * Not started under reduced motion: native scrolling is the right answer
 * there, and every ScrollTrigger works the same on it.
 */
let lenis = null;

export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Hold the page still behind the intro overlay.
  if (document.documentElement.dataset.intro) {
    lenis.stop();
    window.addEventListener("intro:done", resume, { once: true });
  }

  return () => {
    window.removeEventListener("intro:done", resume);
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

function resume() {
  lenis?.start();
}

/** Freeze or release scrolling, e.g. while the mobile menu is open. */
export function setScrollLocked(locked) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

/** Jump to the top without easing, as a route change should. */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
