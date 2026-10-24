import { useEffect, useLayoutEffect, useMemo, useRef, useState, useId } from "react";
import {
  products,
  CATEGORIES,
  categoryCounts,
  imageFor,
} from "../data/products";
import {
  gsap,
  useGSAP,
  MOTION,
  riseWords,
  riseLines,
  riseIn,
} from "../lib/gsap";

const WHATSAPP = "60142580200";
const LIST_KEY = "xkh-enquiry";

/**
 * The buyer's enquiry: slugs of the crops they have added. Kept for the
 * session so it survives a trip to the contact page and back. Storage can be
 * unavailable (private windows, blocked site data), in which case the list
 * simply lasts as long as the page.
 */
function useEnquiry() {
  const [list, setList] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(LIST_KEY) ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(LIST_KEY, JSON.stringify(list));
    } catch {
      /* storage blocked; the list still works for this page */
    }
  }, [list]);

  const toggle = (slug) =>
    setList((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]));
  return { list, toggle, clear: () => setList([]) };
}

/** The message the buyer sends, written so the farm can reply with prices. */
function enquiryLink(crops) {
  const lines = crops.map((p) => `- ${p.name} (${p.han})`).join("\n");
  const text =
    "Hello XKH Farm, I would like price and availability for:\n" +
    `${lines}\n\n` +
    "Quantity and how often: \n" +
    "Deliver to: ";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function ProductGallery() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const searchId = useId();
  const enquiry = useEnquiry();
  const chosen = products.filter((p) => enquiry.list.includes(p.slug));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      // Match the Chinese name too — a local buyer is as likely to type 菜心.
      return (
        p.name.toLowerCase().includes(q) ||
        p.han.includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const filtering = category !== "All" || query.trim() !== "";
  const headRef = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(headRef);
      gsap.matchMedia().add(MOTION, () => {
        riseWords(q("h1")[0], { trigger: false, delay: 0.1 });
        riseLines(q("p")[0], { trigger: false, delay: 0.35 });
        riseIn(q("[data-filters] > *"), { trigger: false, delay: 0.5 });
      });
    },
    { scope: headRef },
  );

  return (
    <>
      <div ref={headRef}>
        <section className="wrap pb-14 pt-16 md:pt-24">
          <h1 className="max-w-[14ch] text-[clamp(3rem,9vw,7rem)]">
            Everything we grow
          </h1>
          <p className="text-lead mt-6 max-w-xl text-bone/80">
            Thirty-six lines from Bertam Valley. Add the ones you need to an
            enquiry and send it on WhatsApp; we reply with this week's prices
            and availability.
          </p>
        </section>

        <section className="wrap">
          <div
            data-filters
            className="flex flex-col gap-8 border-t border-bone/15 pt-8 lg:flex-row lg:items-start lg:justify-between"
          >
            <div className="flex flex-wrap gap-2">
              <Chip
                active={category === "All"}
                onClick={() => setCategory("All")}
                count={products.length}
              >
                All
              </Chip>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  count={categoryCounts.find((x) => x.name === c).count}
                >
                  {c}
                </Chip>
              ))}
            </div>

            <div className="lg:w-72 lg:shrink-0">
              <label
                htmlFor={searchId}
                className="mb-2 block text-sm text-sage"
              >
                Search crops
              </label>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="kailan, 菜心, root…"
                className="w-full border-b-2 border-bone/25 bg-transparent pb-2 text-lg placeholder:text-bone/35 focus:border-sun focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-sage" aria-live="polite">
              {results.length} {results.length === 1 ? "crop" : "crops"}
              {filtering ? " shown" : ""}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="text-sm text-sun underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>
      </div>

      <section className="wrap pb-24 pt-10">
        {results.length === 0 ? (
          <p className="disp py-24 text-center text-3xl text-bone/50">
            No crop matches that search.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {/* Keyed on slug, so a filter only animates the crops that were
                not already on screen. */}
            {results.map((p, i) => (
              <CropCard key={p.slug} column={i % 4}>
                <div data-photo className="overflow-hidden bg-bone-2">
                  <img
                    src={imageFor(p)}
                    alt={`${p.name} (${p.han}) grown at XKH Farm`}
                    loading="lazy"
                    decoding="async"
                    width="720"
                    height="576"
                    className="aspect-[5/4] w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3.5 flex items-baseline justify-between gap-3">
                  <h2 className="subhead text-lg">{p.name}</h2>
                  <span className="han shrink-0 whitespace-nowrap text-sm text-sage">{p.han}</span>
                </div>
                {/* pb-4 holds the gap above the button; mt-auto on the button
                    pins it to the card's foot so a row's buttons line up
                    however long each note runs. */}
                <p className="mt-1.5 pb-4 text-sm leading-relaxed text-bone/60">
                  {p.note}
                </p>
                <AddButton
                  added={enquiry.list.includes(p.slug)}
                  onClick={() => enquiry.toggle(p.slug)}
                  name={p.name}
                />
              </CropCard>
            ))}
          </ul>
        )}
      </section>

      <EnquiryBar crops={chosen} onClear={enquiry.clear} />
    </>
  );
}

function AddButton({ added, onClick, name }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={added}
      aria-label={added ? `Remove ${name} from enquiry` : `Add ${name} to enquiry`}
      className={`mt-auto inline-flex h-11 w-full items-center justify-center px-3 text-[0.95rem] font-semibold transition-colors ${
        added
          ? "bg-sun text-night hover:bg-sun-hi"
          : "border border-bone/30 text-bone hover:border-bone hover:bg-bone/10"
      }`}
      style={{ fontVariationSettings: '"wdth" 95' }}
    >
      {added ? "Added to enquiry" : "Add to enquiry"}
    </button>
  );
}

/**
 * Rises from the foot of the screen once the first crop is added, so the
 * buyer sees where their choices went, and leaves when the list is empty.
 */
function EnquiryBar({ crops, onClear }) {
  const open = crops.length > 0;
  const names = crops.map((p) => p.name).join(", ");
  const ref = useRef(null);

  // While open, the bar is fixed over the foot of the page, so the page
  // reserves its height at the very bottom (after the footer, which a
  // spacer inside this page could not reach) or it would cover the
  // copyright line. Measured, because the bar wraps to two rows on a phone.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.style.removeProperty("--enquiry-bar");
      return;
    }
    const bar = ref.current;
    const sync = () => root.style.setProperty("--enquiry-bar", `${bar.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--enquiry-bar");
    };
  }, [open]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Your enquiry"
      inert={!open}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-bone/15 bg-night-2 transition-transform duration-500 ease-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="wrap flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p aria-live="polite" className="min-w-0">
          <span className="font-semibold">
            {crops.length} {crops.length === 1 ? "crop" : "crops"} in your enquiry
          </span>
          <span className="block truncate text-sm text-sage">{names}</span>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={onClear}
            className="btn btn-ghost !min-h-11 !px-4 text-[0.95rem]"
          >
            Clear
          </button>
          <a
            href={open ? enquiryLink(crops) : undefined}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-sun !min-h-11 flex-1 !px-5 text-[0.95rem] sm:flex-none"
          >
            Send on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * A crop rises into place with its photo uncovering upward and settling from
 * a zoom. Cards in the same row are staggered by column so a row lands left
 * to right rather than as one block.
 */
function CropCard({ column, children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const scrollTrigger = { trigger: ref.current, start: "top 92%" };
        const delay = column * 0.08;
        gsap.from(ref.current, {
          y: 80,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay,
          scrollTrigger,
        });
        gsap.from(ref.current.querySelector("[data-photo]"), {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          delay,
          scrollTrigger,
        });
        gsap.from(ref.current.querySelector("[data-photo] img"), {
          scale: 1.4,
          duration: 1.8,
          ease: "expo.out",
          delay: delay + 0.2,
          scrollTrigger,
        });
      });
    },
    { scope: ref },
  );

  return (
    <li ref={ref} className="group flex flex-col">
      {children}
    </li>
  );
}

function Chip({ active, onClick, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-11 items-center gap-2 px-4 font-medium transition-colors ${
        active
          ? "bg-sun text-night"
          : "border border-bone/25 text-bone/80 hover:border-bone hover:text-bone"
      }`}
    >
      {children}
      <span className={active ? "text-night/55" : "text-bone/40"}>{count}</span>
    </button>
  );
}
