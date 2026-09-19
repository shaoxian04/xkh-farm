import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CropWall from "./CropWall";

export default function Home() {
  return (
    <>
      <Hero />
      <CropWall />
      <Story />
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

        <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-bone/15 pt-8 sm:grid-cols-4">
          {[
            ["2005", "Growing since"],
            ["20 yrs", "Farming experience"],
            ["36", "Vegetable lines"],
            ["Pahang", "Bertam Valley"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd
                className="font-display text-3xl font-extrabold md:text-4xl"
                style={{ fontVariationSettings: '"wdth" 82' }}
              >
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
