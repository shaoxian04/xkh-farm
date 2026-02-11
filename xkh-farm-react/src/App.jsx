import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ProductGallery from './components/ProductGallery';
import Contact from './components/Contact';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/img/xkh_logo.jpg" alt="XKH Logo" className="h-10 w-auto rounded-full group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold font-serif text-primary">Xin Kiar Huat</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/contact">Contact</NavLink>

          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-primary">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full px-6 py-4 flex flex-col gap-4 shadow-xl">
            <MobileNavLink to="/">Home</MobileNavLink>
            <MobileNavLink to="/products">Products</MobileNavLink>
            <MobileNavLink to="/contact">Contact</MobileNavLink>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-[72px]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductGallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold font-serif mb-4">Xin Kiar Huat Enterprise</h3>
            <p className="opacity-80">Sustainable farming for a healthier tomorrow.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/products" className="hover:text-accent">Products</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition"><Instagram size={20} /></a>
            </div>
            <p className="mt-4 opacity-60 text-sm">&copy; 2026 Xin Kiar Huat Enterprise.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`font-medium transition-colors hover:text-primary ${isActive ? 'text-primary font-bold' : 'text-gray-600'}`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link to={to} className="block text-lg font-medium text-gray-700 py-2 border-b border-gray-50 hover:text-primary">
      {children}
    </Link>
  );
}

export default App;
