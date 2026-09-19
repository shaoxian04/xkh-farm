import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import Intro from "./components/Intro";
import Home from "./components/Home";
import ProductGallery from "./components/ProductGallery";
import Contact from "./components/Contact";

const NAV = [
  { label: "Farm", to: "/" },
  { label: "Crops", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Only the home page puts content underneath a transparent header.
  const overlayHeader = location.pathname === "/";

  return (
    <>
      <Intro />
      <div className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-sun focus:px-4 focus:py-2 focus:text-night"
        >
          Skip to content
        </a>

        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} overlay={overlayHeader} />

        <main id="main" className={overlayHeader ? "flex-1" : "flex-1 pt-[4.5rem]"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductGallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

function Header({ menuOpen, setMenuOpen, overlay }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overlay || scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-night/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3" aria-label="XKH Farm, home">
          <img
            src="/brand/logo-badge-light.webp"
            alt=""
            width="644"
            height="700"
            className="h-10 w-auto"
          />
          <span className="disp text-xl">XKH Farm</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? "text-sun" : "text-bone/80 hover:text-bone"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="https://wa.me/60142580200"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-sun !min-h-11 text-[0.95rem]"
          >
            Enquire
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-11 min-w-11 items-center justify-end px-2 font-medium md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-bone/10 bg-night md:hidden"
        >
          <div className="wrap py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                style={{ fontVariationSettings: '"wdth" 85' }}
                className={({ isActive }) =>
                  `block border-b border-bone/10 py-4 text-3xl font-extrabold ${
                    isActive ? "text-sun" : "text-bone"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href="https://wa.me/60142580200"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setMenuOpen(false)}
              className="btn btn-sun mt-5 w-full"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-night">
      <div className="wrap py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <img
              src="/brand/logo-lockup-light.webp"
              alt=""
              width="644"
              height="787"
              className="h-24 w-auto"
            />
            <p className="disp mt-5 text-lg">
              Xin Kiar Huat Enterprise{" "}
              <span className="han font-normal text-sage">新加發企业</span>
            </p>
            <p className="mt-2 max-w-xs text-[0.95rem] text-bone/65">
              Growing fresh in Cameron Highlands since 2005.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="subhead text-sage">Pages</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-bone/80 hover:text-sun">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="subhead text-sage">Get in touch</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="tel:+60142580200" className="text-bone/80 hover:text-sun">
                  +60 14-258 0200
                </a>
              </li>
              <li>
                <a
                  href="mailto:xinkiarhuat88@gmail.com"
                  className="break-all text-bone/80 hover:text-sun"
                >
                  xinkiarhuat88@gmail.com
                </a>
              </li>
              <li className="text-bone/55">
                Jln Ringlet – Sungai Koyan, Bertam Valley, 39200 Ringlet, Pahang
              </li>
              <li className="text-bone/55">Open daily, 8am – 6pm</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-bone/10 pt-6 text-sm text-bone/45">
          © {new Date().getFullYear()} Xin Kiar Huat Enterprise
        </p>
      </div>
    </footer>
  );
}
