import { Link } from "react-router-dom";
import { products, thumbFor } from "../data/products";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION, riseWords, riseIn } from "../lib/gsap";

/**
 * The crop wall — the page's memorable element.
 *
 * Three rows of the full 36-crop range scrolling continuously in alternating
 * directions. The motion is the point: it shows the whole catalogue in a
 * glance without asking anyone to scroll a grid, and the range *is* the sales
 * argument for a wholesaler.
 *
 * Each row duplicates its tiles so the -50% keyframe lands on an identical
 * frame and the seam is invisible. Hovering or tabbing into a row pauses it.
 */

const ROWS = [
  { items: products.slice(0, 12), duration: 64, reverse: false },
  { items: products.slice(12, 24), duration: 78, reverse: true },
  { items: products.slice(24, 36), duration: 70, reverse: false },
];

export default function CropWall() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.matchMedia().add(MOTION, () => {
        riseWords(q("h2")[0]);
        riseIn(q("[data-cta]"), { delay: 0.3 });

        // Rows travel against each other as the section crosses the screen,
        // on top of their own marquee — they arrive from opposite sides and
        // keep sliding apart while you read.
        const rows = q(".wall-row");
        rows.forEach((row, i) => {
          const fromRight = i % 2 === 0;
          gsap.fromTo(
            row,
            { xPercent: fromRight ? 14 : -14 },
            {
              xPercent: fromRight ? -5 : 5,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });

        // And they lean into a fast scroll, then spring back upright.
        const lean = { skew: 0 };
        const setSkew = gsap.quickSetter(rows, "skewX", "deg");
        const clamp = gsap.utils.clamp(-10, 10);
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const skew = clamp(self.getVelocity() / -250);
            if (Math.abs(skew) > Math.abs(lean.skew)) {
              lean.skew = skew;
              gsap.to(lean, {
                skew: 0,
                duration: 0.9,
                ease: "power3",
                overwrite: true,
                onUpdate: () => setSkew(lean.skew),
              });
            }
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="band overflow-hidden border-y border-bone/10">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)]">
            Thirty-six vegetables, cut to order and packed the same day.
          </h2>
          <div data-cta className="shrink-0 self-start md:self-auto">
            <Link to="/products" className="btn btn-ghost">
              See every crop
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 md:mt-20 md:gap-5">
        {ROWS.map((row, i) => (
          <WallRow key={i} {...row} />
        ))}
      </div>
    </section>
  );
}

function WallRow({ items, duration, reverse }) {
  // Doubled so the loop closes on itself; the copy is hidden from the
  // accessibility tree so screen readers hear each crop once.
  return (
    <div className="wall-row">
      <div
        className="wall-track gap-4 md:gap-5"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items.map((p) => (
          <CropTile key={p.slug} product={p} />
        ))}
        {items.map((p) => (
          <CropTile key={`dup-${p.slug}`} product={p} duplicate />
        ))}
      </div>
    </div>
  );
}

function CropTile({ product, duplicate = false }) {
  return (
    <figure
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate ? "true" : undefined}
      className="group relative w-[54vw] shrink-0 overflow-hidden bg-night-2 sm:w-[34vw] lg:w-[22vw] xl:w-[18rem]"
    >
      {/* The photo background is flattened to bone-2, so the plate behind it
          must be bone-2 too or the photo edge shows as a rectangle.

          Not lazy: these tiles start outside the viewport and are moved in by
          a transform, which does not re-trigger lazy loading — they would stay
          blank. Hence the smaller thumbnail source. */}
      <div className="overflow-hidden bg-bone-2">
        <img
          src={thumbFor(product)}
          alt={duplicate ? "" : `${product.name} grown at XKH Farm`}
          decoding="async"
          width="440"
          height="352"
          className="aspect-[5/4] w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 px-4 py-3.5">
        <span className="font-semibold" style={{ fontVariationSettings: '"wdth" 92' }}>
          {product.name}
        </span>
        <span className="han text-sm text-sage">{product.han}</span>
      </figcaption>
    </figure>
  );
}
