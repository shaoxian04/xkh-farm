import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "xkh-intro-seen";

/**
 * The page-load moment: the farm's own logo draws itself, then lifts away.
 *
 * This is the only non-user-triggered motion on the site, so it has to be
 * worth it and it has to get out of the way. It plays once per browser
 * session, can be skipped with a click or any key, and is skipped outright
 * for anyone who has asked for reduced motion.
 */
export default function Intro() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return "done";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode or blocked storage — treat as unseen, it's only a cosmetic.
    }
    return reduced || seen ? "done" : "playing";
  });

  const videoRef = useRef(null);

  useEffect(() => {
    if (state === "done") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* not important enough to handle */
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
    // Never strand someone behind the overlay if the video fails to fire.
    const failsafe = setTimeout(dismiss, 5200);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      clearTimeout(failsafe);
    };
  }, [state]);

  if (state === "done") return null;

  return (
    <div
      onClick={() => setState("leaving")}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#DCD9CA] transition-opacity duration-[600ms] ease-out ${
        state === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={() => state === "leaving" && setState("done")}
    >
      {/* Full-bleed: the clip carries its own paper texture, so any letterbox
          around it shows as a visible seam against a flat backdrop. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
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
        className="absolute bottom-10 right-8 text-sm font-medium text-[#0E5A24]/60 underline underline-offset-4 hover:text-[#0E5A24]"
      >
        Skip
      </button>
    </div>
  );
}
