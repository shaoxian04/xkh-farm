import { useEffect, useRef, useState } from "react";

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
