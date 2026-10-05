import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CropWall from "./CropWall";
import {
  gsap,
  SplitText,
  useGSAP,
  MOTION,
  EASE,
  afterIntro,
  riseWords,
  riseLines,
  riseIn,
} from "../lib/gsap";

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

const STATS = [
  { value: "2005", label: "Growing since", count: [1985, 2005] },
  { value: "20 yrs", label: "Farming experience", count: [0, 20], suffix: " yrs" },
  { value: "36", label: "Vegetable lines", count: [0, 36] },
  // A place, not a figure — set smaller so it reads as a name rather than
  // pretending to be another statistic.
  { value: "Cameron Highlands", label: "Pahang", size: "text-xl md:text-2xl" },
];

function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.matchMedia().add(MOTION, (ctx) => {
        const copy = q("[data-hero-copy]");
        // Held invisible until the intro lifts, then built: splitting has to
        // wait for the web fonts or the lines break in the wrong places.
        gsap.set(copy, { autoAlpha: 0 });

        let cancelled = false;
        const cancel = afterIntro(async () => {
          await document.fonts.ready;
          if (cancelled) return;
          // Built inside the matchMedia context even though it runs after an
          // await, so it is reverted with everything else on unmount.
          ctx.add(() => buildEntrance());
        });

        function buildEntrance() {
          gsap.set(copy, { autoAlpha: 1 });

          const split = SplitText.create(q("h1"), { type: "chars" });
          const lede = SplitText.create(q("[data-lede]"), {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
          });

          const tl = gsap.timeline({ defaults: { ease: EASE } });
          tl.from(q("[data-logo]"), {
            autoAlpha: 0,
            scale: 0.6,
            rotate: -8,
            filter: "blur(14px)",
            duration: 1.6,
          })
            // Each letter flips up off its baseline, like a card turning.
            .from(
              split.chars,
              {
                yPercent: 90,
                rotateX: -95,
                autoAlpha: 0,
                transformPerspective: 700,
                transformOrigin: "50% 100%",
                duration: 1.4,
                stagger: 0.06,
              },
              0.25,
            )
            .from(lede.lines, { yPercent: 130, duration: 1.2, stagger: 0.1 }, 0.7)
            .from(
              q("[data-cta] > *"),
              { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1 },
              0.95,
            )
            .from(
              q("[data-stat]"),
              { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 },
              1.1,
            )
            .from(
              q("[data-rule]"),
              { scaleX: 0, transformOrigin: "0% 50%", duration: 1.6 },
              1.0,
            );

          // The figures count up to their value as they land.
          q("[data-count]").forEach((el) => {
            const [from, to] = el.dataset.count.split(",").map(Number);
            const suffix = el.dataset.suffix ?? "";
            const n = { v: from };
            tl.to(
              n,
              {
                v: to,
                duration: 2,
                ease: "power3.out",
                onUpdate: () => (el.textContent = Math.round(n.v) + suffix),
              },
              1.1,
            );
          });
        }

        // Scrolling away pushes the film in and lets the copy drift up and
        // fade, so the hero hands over to the next section instead of just
        // sliding off the top.
        const scrub = {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to(q("video"), { scale: 1.25, yPercent: 12, ease: "none", scrollTrigger: scrub });
        gsap.to(q("[data-hero-inner]"), {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { ...scrub, start: "top top", end: "90% top" },
        });

        return () => {
          cancelled = true;
          cancel();
        };
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* The farm's whole film, uncut, at the owner's request.
          Two consequences worth knowing before editing this.

          Its burned-in titles cross the copy below, and the last 7.7s are a
          cream end card that takes the whole frame pale, so the scrim has to
          hold text against a LIGHT background as well as a dark one — hence
          to-night/45 rather than /35, and the separate top scrim that keeps
          the nav legible while the header is still transparent. Verified by
          sampling rendered pixels over the end card, not by eye.

          The corner watermark stays. Cropping it off would slice the left
          edge from two of the captions, which start at x=43 and x=53, and
          delogo leaves a smeared rectangle that is worse than the mark. */}
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
        className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-night/80 to-transparent"
      />

      <div data-hero-inner className="wrap relative pb-16 pt-28 md:pb-24">
        <div data-hero-copy>
          <img
            data-logo
            src="/brand/logo-lockup-light.webp"
            alt=""
            width="644"
            height="787"
            className="mb-8 h-32 w-auto md:h-44"
          />

          <h1 className="max-w-[16ch] text-[clamp(3rem,10vw,8.5rem)]">
            XKH Farm
          </h1>

          <p data-lede className="mt-6 max-w-xl text-lg text-bone/85 md:text-xl">
            Growing fresh vegetables in Cameron Highlands since 2005, and
            supplying them wholesale to markets, distributors and retailers
            across Malaysia.
          </p>

          <div data-cta className="mt-10 flex flex-wrap gap-3">
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

          <div data-rule aria-hidden="true" className="mt-14 h-px max-w-3xl bg-bone/15" />

          {/* items-end so the labels sit on one line even though the place
              name runs longer than the figures. */}
          <dl className="grid max-w-3xl grid-cols-2 items-end gap-x-8 gap-y-6 pt-8 sm:grid-cols-4">
            {STATS.map(({ value, label, size, count, suffix }) => (
              <div key={label} data-stat>
                <dt className="sr-only">{label}</dt>
                <dd
                  data-count={count?.join(",")}
                  data-suffix={suffix}
                  className={`disp-lg tabular-nums ${size ?? "text-3xl md:text-4xl"}`}
                >
                  {value}
                </dd>
                <p className="mt-1 text-sm text-sage">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Story() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.matchMedia().add(MOTION, () => {
        riseWords(q("h2")[0]);
        q("[data-para]").forEach((p, i) => riseLines(p, { delay: 0.15 + i * 0.1 }));
        riseIn(q("[data-cta]"), { delay: 0.3 });

        // The photograph opens out of a growing circle, settling from a deep
        // zoom as it does, then keeps drifting against the scroll. The clip is
        // cleared at the end so the finished frame is a plain rectangle.
        const frame = q("[data-frame]")[0];
        const img = q("[data-frame] img")[0];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: frame, start: "top 80%" },
          defaults: { duration: 1.8, ease: "expo.inOut" },
        });
        tl.fromTo(
          frame,
          { clipPath: "circle(0% at 50% 60%)" },
          { clipPath: "circle(75% at 50% 50%)", clearProps: "clipPath" },
        ).fromTo(img, { scale: 1.6 }, { scale: 1 }, 0);

        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="band bg-bone-2 text-soil">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.25rem)]">
            A family farm that grew into a supplier.
          </h2>

          <div className="mt-8 max-w-2xl space-y-5 text-[1.0625rem] leading-relaxed text-soil-2">
            <p data-para>
              Xin Kiar Huat Enterprise was founded by Mr Tan and built on years
              of hands-on experience, perseverance and a firm commitment to
              quality farming. It started small, growing fresh vegetables for
              local communities.
            </p>
            <p data-para>
              Two decades on, the farm supplies wholesale buyers across the
              country from the same ground in Bertam Valley. The scale changed;
              the standards that got it there did not.
            </p>
          </div>

          <div data-cta className="mt-10 flex flex-wrap gap-3">
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
          <figure
            data-frame
            className="relative m-0 aspect-[5/4] overflow-hidden bg-soil/10 lg:sticky lg:top-28"
          >
            <img
              src="/img/webp/intro.webp"
              alt="Rows of young vegetables growing under cover at the farm in Bertam Valley."
              loading="lazy"
              decoding="async"
              width="720"
              height="540"
              className="overscan"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Why the farm exists, in the owner's own terms: customers should be able to
 * eat vegetables that are fresh, healthy, free of chemicals and safe — and the
 * premium lines besides. Each promise leads with what it does for the
 * customer's health, then says how the farm keeps it.
 *
 * The first pass set this as a two-column table of terms and definitions. It
 * was readable and completely inert. Each promise now has a photograph of the
 * thing it describes, pulled from the farm's own film (see
 * scripts/build-video.sh).
 *
 * On a wide screen the section pins and the four promises travel sideways
 * past the reader as they scroll down; each photograph opens out and settles
 * as it comes in. On a phone they stack, which is how they also lay out
 * without motion.
 */
const PLEDGES = [
  {
    benefit: "More nutrition on your plate",
    term: "Picked fresh, so the goodness stays in",
    text: "Vegetables lose their goodness the longer they wait. Ours are cut in Cameron Highlands and packed the same day, so your family eats them while they are still full of the nutrients that keep you well.",
    img: "/img/farm/field.webp",
    alt: "Rows of lettuce growing in the farm's highland beds.",
  },
  {
    benefit: "Nothing harmful in your body",
    term: "Grown without chemicals",
    text: "No chemical residue ends up on your table, because none goes on the crop. We grow every line the way we would for our own children, so it is safe for yours.",
    img: "/img/farm/harvest.webp",
    alt: "A worker cutting a cabbage by hand in the field.",
  },
  {
    benefit: "Safe to eat, every single order",
    term: "Checked crate by crate",
    text: "All thirty-six lines are graded and checked to one standard before they leave, so every order you serve is as clean and wholesome as the last.",
    img: "/img/farm/crate.webp",
    alt: "Gloved hands lifting cherry tomatoes out of a blue packing crate.",
  },
  {
    benefit: "Hygienic from field to kitchen",
    term: "Handled clean, start to finish",
    text: "Gloved hands at every step, then washed, sorted and crated under the farm's own hygiene routine, so what reaches you is fit for the family table.",
    img: "/img/farm/bundle.webp",
    alt: "A worker bundling spring onions by hand at the edge of the bed.",
  },
];

function Commitment() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        riseLines(q("[data-tagline]")[0]);
        riseWords(q("h2")[0], { delay: 0.1 });
        riseLines(q("[data-lead]")[0], { delay: 0.25 });
      });

      // Wide screens: pin the row and turn vertical scroll into sideways
      // travel. The track moves by exactly its overflow, so the last promise
      // finishes flush with the right edge.
      mm.add(`(min-width: 1024px) and ${MOTION}`, () => {
        const pin = q("[data-pin]")[0];
        const track = q("[data-track]")[0];
        const distance = () => track.scrollWidth - window.innerWidth;

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.from(q("[data-progress]"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });

        q("[data-pledge]").forEach((panel) => {
          // Panels already on screen when the row pins open as the row
          // scrolls up into place; the rest open as they slide in from the
          // right, timed against the sideways travel.
          const onScreen = panel.offsetLeft < window.innerWidth * 0.8;
          const trigger = onScreen
            ? { trigger: pin, start: "top 85%", end: "top 15%" }
            : {
                trigger: panel,
                containerAnimation: travel,
                start: "left right",
                // The row stops with the last panel flush right, so its left
                // edge only ever reaches about halfway across. Finish before
                // that, or the last photo is left half open.
                end: "left 62%",
              };
          openPledge(panel, { ...trigger, scrub: true }, onScreen
            ? { trigger: pin, start: "top 60%" }
            : { trigger: panel, containerAnimation: travel, start: "left 75%" });
        });
      });

      // Phones and narrow tablets: the same opening, one card at a time as
      // each scrolls up into view.
      mm.add(`(max-width: 1023px) and ${MOTION}`, () => {
        q("[data-pledge]").forEach((panel) => {
          openPledge(
            panel,
            { trigger: panel, start: "top 95%", end: "top 35%", scrub: true },
            { trigger: panel, start: "top 60%" },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-forest" aria-labelledby="commitment">
      <div className="wrap pt-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* The tagline. It is the one line the owner wants a customer to
                leave with, so it sits in sun above the headline. */}
            <p data-tagline className="subhead mb-6 text-lg text-sun md:text-xl">
              Keeping your family healthy, one harvest at a time.
            </p>
            <h2
              id="commitment"
              className="max-w-[15ch] text-[clamp(2.5rem,6vw,5rem)]"
            >
              Your health is the reason we farm.
            </h2>
          </div>

          <p
            data-lead
            className="max-w-md self-end text-lg leading-relaxed text-bone/85 lg:col-span-5"
          >
            Mr Tan started the farm with one aim: that the people who eat its
            vegetables stay well. So every crop is grown fresh, without
            chemicals, handled clean and held to a premium standard. Two
            decades on, keeping our customers healthy is still the only
            standard the farm packs to.
          </p>
        </div>
      </div>

      <div data-pin className="pledge-pin">
        <ol data-track className="pledge-track">
          {PLEDGES.map((pledge) => (
            <Pledge key={pledge.term} {...pledge} />
          ))}
        </ol>
        <div className="wrap hidden lg:block">
          <div className="h-px bg-bone/15">
            <div data-progress className="h-px bg-sun" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One promise's entrance. The photograph's frame opens from a rounded window
 * while the picture inside un-zooms — both scrubbed, so the reader's scroll
 * drives them. The copy then rises in line by line, once.
 */
function openPledge(panel, frameTrigger, copyTrigger) {
  const frame = panel.querySelector("figure");
  const img = frame.querySelector("img");

  const tl = gsap.timeline({ scrollTrigger: frameTrigger, defaults: { ease: "none" } });
  tl.fromTo(
    frame,
    { clipPath: "inset(22% 26% 22% 0% round 40px)" },
    { clipPath: "inset(0% 0% 0% 0% round 0px)" },
  ).fromTo(img, { scale: 1.5, filter: "brightness(0.5) saturate(0.6)" }, { scale: 1, filter: "brightness(1) saturate(1)" }, 0);

  gsap.from(panel.querySelectorAll("[data-copy] > *"), {
    y: 60,
    autoAlpha: 0,
    duration: 1.2,
    ease: EASE,
    stagger: 0.09,
    scrollTrigger: copyTrigger,
  });
}

function Pledge({ benefit, term, text, img, alt }) {
  return (
    <li data-pledge className="pledge group">
      <figure className="relative m-0 aspect-[5/4] overflow-hidden bg-night-2">
        <img
          src={img}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="960"
          height="720"
          className="h-full w-full object-cover"
        />
      </figure>

      <div data-copy>
        {/* Sentence case, no number: the four are not a sequence, and
            tracked-out caps labels are on DESIGN.md's list of what not to
            bring back. */}
        <p className="subhead mt-7 text-lg text-sun">{benefit}</p>

        <h3 className="disp-lg mt-3 max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.05]">
          {term}
        </h3>

        <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-bone/85">
          {text}
        </p>
      </div>
    </li>
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
  const videoRef = useRef(null);

  function start() {
    setPlaying(true);
    // Wait for the source to mount before asking it to play.
    requestAnimationFrame(() => videoRef.current?.play());
  }

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.matchMedia().add(MOTION, () => {
        riseWords(q("h2")[0]);
        riseLines(q("[data-note]")[0], { delay: 0.2 });

        // The frame grows from a small rounded card to its full width as it
        // rises toward the middle of the screen.
        const frame = q("[data-frame]")[0];
        const scrollTrigger = {
          trigger: frame,
          start: "top bottom",
          end: "center 55%",
          scrub: true,
        };
        gsap.fromTo(
          frame,
          { clipPath: "inset(10% 18% 10% 18% round 48px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger },
        );
        gsap.fromTo(q("[data-poster]"), { scale: 1.4 }, { scale: 1, ease: "none", scrollTrigger });

        // The play button follows the pointer around the frame.
        const chip = q("[data-chip]")[0];
        if (chip && window.matchMedia("(pointer: fine)").matches) {
          const toX = gsap.quickTo(chip, "x", { duration: 0.6, ease: "power3" });
          const toY = gsap.quickTo(chip, "y", { duration: 0.6, ease: "power3" });
          const onMove = (e) => {
            const r = frame.getBoundingClientRect();
            toX((e.clientX - r.left - r.width / 2) * 0.6);
            toY((e.clientY - r.top - r.height / 2) * 0.6);
          };
          const onLeave = () => {
            toX(0);
            toY(0);
          };
          frame.addEventListener("pointermove", onMove);
          frame.addEventListener("pointerleave", onLeave);
          return () => {
            frame.removeEventListener("pointermove", onMove);
            frame.removeEventListener("pointerleave", onLeave);
          };
        }
      });
    },
    { scope: ref, dependencies: [playing], revertOnUpdate: true },
  );

  return (
    <section ref={ref} className="band overflow-hidden">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[20ch] text-[clamp(2.25rem,5.5vw,4.25rem)]">
            Half a minute on the farm, from the air and the ground.
          </h2>
          <p data-note className="max-w-xs text-sage">
            Filmed at Bertam Valley: the fields, the packhouse, and the crops
            going into crates.
          </p>
        </div>

        <div data-frame className="relative mt-12 overflow-hidden bg-night-2">
          {playing ? (
            <video
              ref={videoRef}
              className="mx-auto block aspect-video w-full max-w-[1280px]"
              src="/video/film.mp4"
              poster="/video/film-poster.webp"
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
                data-poster
                src="/video/film-poster.webp"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-night/35 transition-colors group-hover:bg-night/20"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  data-chip
                  className="flex h-32 w-32 items-center justify-center rounded-full bg-sun text-center font-semibold leading-tight text-night transition-transform duration-300 group-hover:scale-110 md:h-40 md:w-40"
                >
                  Watch
                  <br />
                  the film
                </span>
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
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.matchMedia().add(MOTION, () => {
        riseWords(q("h2")[0]);
        riseLines(q("[data-note]")[0], { delay: 0.25 });
        riseIn(q("[data-cta] > *"), { trigger: q("[data-cta]")[0], delay: 0.35 });

        // The promise, outlined and enormous, slides across under the ask.
        gsap.fromTo(
          q("[data-marquee]"),
          { xPercent: 4 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="band relative overflow-hidden bg-forest pb-0">
      <div className="wrap relative">
        <h2 className="max-w-[16ch] text-[clamp(2.5rem,7vw,6rem)]">
          Tell us what you need, and how often.
        </h2>
        <p data-note className="mt-6 max-w-xl text-lg text-bone/85">
          Volumes, crop lines and delivery schedules are arranged directly with
          the farm. A message is the quickest way to start.
        </p>
        <div data-cta className="mt-10 flex flex-wrap gap-3">
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

      {/* Its own band under the ask, not behind it: laid over the headline
          the words only ever showed as fragments between the letters. */}
      <p
        data-marquee
        aria-hidden="true"
        className="outline-type pointer-events-none mt-16 whitespace-nowrap pb-[0.25em] md:mt-20"
      >
        Fresh · Healthy · Chemical-free · Fresh · Healthy · Chemical-free
      </p>
    </section>
  );
}
