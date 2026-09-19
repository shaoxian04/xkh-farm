import { useMemo, useState, useId } from "react";
import { products, CATEGORIES, categoryCounts, imageFor } from "../data/products";

export default function ProductGallery() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const searchId = useId();

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

  return (
    <>
      <section className="wrap pb-14 pt-16 md:pt-24">
        <h1 className="max-w-[14ch] text-[clamp(3rem,9vw,7rem)]">
          Everything we grow
        </h1>
        <p className="mt-6 max-w-xl text-lg text-bone/80">
          Thirty-six lines from Bertam Valley. What is cutting each week shifts
          with the season, so ask us for current availability.
        </p>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-8 border-t border-bone/15 pt-8 lg:flex-row lg:items-start lg:justify-between">
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
            <label htmlFor={searchId} className="mb-2 block text-sm text-sage">
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

      <section className="wrap pb-24 pt-10">
        {results.length === 0 ? (
          <p className="disp py-24 text-center text-3xl text-bone/50">
            No crop matches that search.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {results.map((p) => (
              <li key={p.slug} className="group">
                <div className="overflow-hidden bg-bone-2">
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
                  <h2
                    className="subhead text-lg"
                  >
                    {p.name}
                  </h2>
                  <span className="han text-sm text-sage">{p.han}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-bone/60">
                  {p.note}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
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
