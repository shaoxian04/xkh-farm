import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CropWall from "./CropWall";

export default function Home() {
  return (
    <>
      <Hero />
      <CropWall />
      <Story />
      <Commitment />
      <Film />
      <Enquiry />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Only the text-free windows of the farm film are used here — the rest
          of the reel carries its own burned-in titles. Encoded at its native
          1280x720 and never upscaled past that by the gradient treatment. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/hero.mp4"
        poster="/video/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/35"
      />

      <div className="wrap relative pb-16 pt-28 md:pb-24">
        <img
          src="/brand/logo-lockup-light.webp"
          alt=""
          width="644"
          height="787"
          className="mb-8 h-32 w-auto md:h-44"
        />

        <h1 className="max-w-[16ch] text-[clamp(3rem,10vw,8.5rem)]">
          XKH Farm
        </h1>

        <p className="mt-6 max-w-xl text-lg text-bone/85 md:text-xl">
          Growing fresh vegetables in Cameron Highlands since 2005, and
          supplying them wholesale to markets, distributors and retailers
          across Malaysia.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://wa.me/60142580200"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-sun"
          >
            Talk to us on WhatsApp
          </a>
          <Link to="/products" className="btn btn-ghost">
            Browse the crops
          </Link>
        </div>

        {/* items-end so the labels sit on one line even though the place
            name runs longer than the figures. */}
        <dl className="mt-14 grid max-w-3xl grid-cols-2 items-end gap-x-8 gap-y-6 border-t border-bone/15 pt-8 sm:grid-cols-4">
          {[
            ["2005", "Growing since"],
            ["20 yrs", "Farming experience"],
            ["36", "Vegetable lines"],
            // A place, not a figure — set smaller so it reads as a name
            // rather than pretending to be another statistic.
            ["Cameron Highlands", "Pahang", "text-xl md:text-2xl"],
          ].map(([value, label, size]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className={`disp-lg ${size ?? "text-3xl md:text-4xl"}`}>
                {value}
              </dd>
              <p className="mt-1 text-sm text-sage">{label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Story() {
  return (
    <section className="band bg-bone-2 text-soil">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.25rem)]">
            A family farm that grew into a supplier.
          </h2>

          <div className="mt-8 max-w-2xl space-y-5 text-[1.0625rem] leading-relaxed text-soil-2">
            <p>
              Xin Kiar Huat Enterprise was founded by Mr Tan and built on years
              of hands-on experience, perseverance and a firm commitment to
              quality farming. It started small, growing fresh vegetables for
              local communities.
            </p>
            <p>
              Two decades on, the farm supplies wholesale buyers across the
              country from the same ground in Bertam Valley. The scale changed;
              the standards that got it there did not.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="btn bg-forest text-bone hover:bg-[#0A4A1D]"
            >
              Visit the farm
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          {/* The source is 4:3 landscape; a portrait crop would throw away most
              of the field, which is the subject of the photograph. */}
          <img
            src="/img/webp/intro.webp"
            alt="Rows of young vegetables growing under cover at the farm in Bertam Valley."
            loading="lazy"
            decoding="async"
            width="720"
            height="540"
            className="aspect-[5/4] w-full object-cover lg:sticky lg:top-28"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Reveals an element the first time it reaches the viewport, and then leaves
 * it alone — nothing re-animates on the way back up.
 *
 * Returns the hidden state rather than the visible one on purpose: the markup
 * renders finished, and JS only ever *adds* the starting position. Reduced
 * motion, a missing IntersectionObserver and a JS failure therefore all land
 * on the finished section rather than an empty green band.
 *
 * Attach the returned ref to a wrapper that is never clipped, NOT to the
 * element carrying data-reveal. Chrome intersects the target's own clip-path,
 * so observing a clipped element deadlocks: the hidden state clips it out of
 * the viewport, the observer therefore never reports it as intersecting, and
 * it stays hidden forever.
 */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(
    () =>
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (shown || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Hold until the element is a little way in, so it is not already
      // finished by the time it is worth looking at.
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return [ref, shown ? undefined : "hidden"];
}

/* -------------------------------------------------------------------------- */

/**
 * Why the farm exists, in the owner's own terms: customers should be able to
 * eat vegetables that are fresh, healthy, free of chemicals and safe — and the
 * premium lines besides.
 *
 * The first pass set this as a two-column table of terms and definitions. It
 * was readable and completely inert: a wall of small text on a flat green
 * field with nothing for the eye to land on. This version gives each promise
 * a photograph of the thing it describes, pulled from the farm's own film
 * (see scripts/build-video.sh), and lets each one arrive as you reach it.
 *
 * The right-hand column is dropped half a panel so the four do not read as a
 * grid of identical cards.
 */
const PLEDGES = [
  {
    term: "Fresh from the highlands",
    text: "Cut in Cameron Highlands and packed on the farm, so a crate is on its way to your market the same day.",
    img: "/img/farm/field.webp",
    alt: "Rows of lettuce growing in the farm's highland beds.",
  },
  {
    term: "Grown without chemicals",
    text: "Nothing goes on the crop that the family would not want on their own table, and that covers every line the farm sells.",
    img: "/img/farm/harvest.webp",
    alt: "A worker cutting a cabbage by hand in the field.",
  },
  {
    term: "The same quality in every crate",
    text: "Thirty-six lines, graded and packed to one specification, so a repeat order arrives looking like the last one.",
    img: "/img/farm/crate.webp",
    alt: "Gloved hands lifting cherry tomatoes out of a blue packing crate.",
  },
  {
    term: "Handled clean, start to finish",
    text: "Washed, sorted and crated under the farm's own hygiene routine before anything is loaded.",
    img: "/img/farm/bundle.webp",
    alt: "A worker bundling spring onions by hand at the edge of the bed.",
  },
];

function Commitment() {
  const [headRef, headState] = useReveal();
  const [leadRef, leadState] = useReveal();

  return (
    <section className="band bg-forest" aria-labelledby="commitment">
      <div className="wrap">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          {/* The ref goes on the wrapper, not on the clipped heading — see
              the note in useReveal. */}
          <div ref={headRef} className="lg:col-span-7">
            <h2
              id="commitment"
              data-reveal={headState}
              className="reveal-wipe-x max-w-[14ch] text-[clamp(2.5rem,6vw,5rem)]"
            >
              Vegetables you can serve without a second thought.
            </h2>
          </div>

          <p
            ref={leadRef}
            data-reveal={leadState}
            style={{ "--reveal-delay": "140ms" }}
            className="max-w-md self-end text-lg leading-relaxed text-bone/85 lg:col-span-5"
          >
            Mr Tan started the farm so that families could eat vegetables they
            never had to worry about: fresh, healthy, grown without chemicals,
            and held to a premium standard. Two decades on, that is still the
            only standard the farm packs to.
          </p>
        </div>

        {/* Two independent columns rather than a two-up grid: on a grid every
            row is as tall as its tallest cell, which left a hole under the
            shorter promise. The right column is dropped by one step so the
            four do not read as a block of identical cards. */}
        <div className="mt-20 grid gap-x-16 md:grid-cols-2">
          <div className="space-y-20">
            {PLEDGES.slice(0, 2).map((pledge) => (
              <Pledge key={pledge.term} {...pledge} />
            ))}
          </div>
          {/* The split is first-two / last-two rather than odds / evens so
              that when the columns stack on a phone the four still read in
              their written order. */}
          <div className="mt-20 space-y-20 md:mt-28">
            {PLEDGES.slice(2).map((pledge) => (
              <Pledge key={pledge.term} {...pledge} offset />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pledge({ term, text, img, alt, offset }) {
  const [ref, state] = useReveal();

  return (
    <div
      ref={ref}
      className="group"
      style={{ "--reveal-delay": offset ? "120ms" : "0ms" }}
    >
      <figure
        data-reveal={state}
        className="reveal-wipe m-0 aspect-[5/4] overflow-hidden bg-night-2"
      >
        <img
          src={img}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="960"
          height="720"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </figure>

      <h3
        data-reveal={state}
        style={{ "--reveal-delay": offset ? "300ms" : "180ms" }}
        className="disp-lg mt-7 max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.05]"
      >
        {term}
      </h3>

      <p
        data-reveal={state}
        style={{ "--reveal-delay": offset ? "380ms" : "260ms" }}
        className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-bone/85"
      >
        {text}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The farm's own promotional film. It is 35 seconds with its own titles and
 * narration, so it is presented as a film to watch rather than as decoration —
 * and it only downloads once someone asks for it.
 */
function Film() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);

  function start() {
    setPlaying(true);
    // Wait for the source to mount before asking it to play.
    requestAnimationFrame(() => ref.current?.play());
  }

  return (
    <section className="band">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[20ch] text-[clamp(2.25rem,5.5vw,4.25rem)]">
            Half a minute on the farm, from the air and the ground.
          </h2>
          <p className="max-w-xs text-sage">
            Filmed at Bertam Valley: the fields, the packhouse, and the crops
            going into crates.
          </p>
        </div>

        <div className="relative mt-12 bg-night-2">
          {playing ? (
            <video
              ref={ref}
              className="mx-auto block aspect-video w-full max-w-[1280px]"
              src="/video/film.mp4"
              poster="/video/hero-poster.webp"
              controls
              playsInline
              preload="none"
            />
          ) : (
            <button
              type="button"
              onClick={start}
              className="group relative mx-auto block aspect-video w-full max-w-[1280px] overflow-hidden"
            >
              <img
                src="/video/hero-poster.webp"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-night/35 transition-colors group-hover:bg-night/20"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="btn btn-sun">Watch the film</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Enquiry() {
  return (
    <section className="band bg-forest">
      <div className="wrap">
        <h2 className="max-w-[16ch] text-[clamp(2.5rem,7vw,6rem)]">
          Tell us what you need, and how often.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-bone/85">
          Volumes, crop lines and delivery schedules are arranged directly with
          the farm. A message is the quickest way to start.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://wa.me/60142580200"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-sun"
          >
            Message us on WhatsApp
          </a>
          <a href="tel:+60142580200" className="btn btn-ghost">
            +60 14-258 0200
          </a>
        </div>
      </div>
    </section>
  );
}
