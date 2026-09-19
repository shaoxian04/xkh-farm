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

/**
 * The WhatsApp glyph, drawn in currentColor so it takes the button's ink.
 * Brand green on the gold button would fight it, and a two-colour mark inside
 * a solid button reads as a pasted-in logo rather than part of the control.
 */
function WhatsAppMark(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
    </svg>
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
            className="btn btn-sun !min-h-11 gap-2 !px-5 text-[0.95rem]"
          >
            <WhatsAppMark className="h-[1.15em] w-[1.15em]" />
            Chat with us on WhatsApp
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
              className="btn btn-sun mt-5 w-full gap-2"
            >
              <WhatsAppMark className="h-[1.15em] w-[1.15em]" />
              Chat with us on WhatsApp
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
