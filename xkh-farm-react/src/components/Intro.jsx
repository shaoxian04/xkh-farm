import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The page-load moment: the farm's own logo draws itself, then lifts away.
 *
 * This is the only non-user-triggered motion on the site, so it has to be
 * worth it and it has to get out of the way. It runs on every page load —
 * the owner wants every arrival to open on the brand — but never on a
 * client-side route change, and never for anyone who has asked for reduced
 * motion. A click, a key or a scroll dismisses it at any point.
 *
 * The clip is 600kB and sits on the critical path for that reason; if it
 * ever grows, gate it behind a connection check rather than making people
 * wait on it.
 */
export default function Intro() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return "done";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return reduced ? "done" : "playing";
  });

  const videoRef = useRef(null);

  // Page entrances and smooth scrolling are held while the overlay covers
  // them, otherwise they would finish unseen (see afterIntro in lib/gsap).
  // Layout effect so the flag is set before the first paint; `intro:done`
  // fires as soon as the overlay starts to lift.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (state === "playing") {
      root.dataset.intro = "playing";
      return;
    }
    if (root.dataset.intro) {
      delete root.dataset.intro;
      window.dispatchEvent(new Event("intro:done"));
    }
  }, [state]);

  // The overlay covers the page while it plays, so hold the scroll position.
  useEffect(() => {
    if (state === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  useEffect(() => {
    if (state === "done") return;
    function dismiss() {
      setState("leaving");
    }
    window.addEventListener("keydown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    // A swipe is how a phone scrolls; there is no wheel to listen for.
    window.addEventListener("touchmove", dismiss, { passive: true });
    // Never strand someone behind the overlay if the video fails to fire.
    const failsafe = setTimeout(dismiss, 5200);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      clearTimeout(failsafe);
    };
  }, [state]);

  if (state === "done") return null;

  return (
    <div
      onClick={() => setState("leaving")}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#E7DCCE] transition-opacity duration-[600ms] ease-out ${
        state === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={() => state === "leaving" && setState("done")}
    >
      {/* Sized, not object-cover. The logo spans the middle 34% of the 16:9
          frame; cover on a portrait phone blows it up past the screen edge
          and leaves a few arcs. So the clip covers the screen where it can,
          but never grows past 235vw, which keeps the logo at about 80% of
          the screen width. On a phone that leaves a band above and below;
          the mask (portrait only, where the band exists) feathers the clip's
          paper texture into the backdrop, whose colour is the clip's paper
          averaged. */}
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 aspect-video w-[min(max(100vw,177.78vh),235vw)] max-w-none -translate-x-1/2 -translate-y-1/2 portrait:[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
        src="/video/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setState("leaving")}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setState("leaving")}
        className="absolute bottom-10 right-8 text-sm font-medium text-[#0E5A24] underline underline-offset-4 hover:decoration-2"
      >
        Skip
      </button>
    </div>
  );
}
