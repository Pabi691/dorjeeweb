import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Lenis from 'lenis';
import { useGlobal } from '../../context/GlobalContext';
import { watchBrandColor } from '../../lib/theme';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

export default function Layout() {
  const { cartPulse } = useGlobal();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const lenisRef = useRef(null);
  const firstPulse = useRef(true);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
    lenisRef.current = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Brand colour from CRM
  useEffect(() => watchBrandColor(), []);

  // Scroll to top on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  // Open the bag after an add (skip the initial mount)
  useEffect(() => {
    if (firstPulse.current) {
      firstPulse.current = false;
      return;
    }
    setCartOpen(true);
  }, [cartPulse]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header onOpenCart={() => setCartOpen(true)} onOpenMenu={() => setMenuOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1">
        <Outlet context={{ openCart: () => setCartOpen(true) }} />
      </main>
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <ToastContainer position="top-center" autoClose={2400} hideProgressBar={false} newestOnTop limit={2} closeButton={false} />
    </div>
  );
}
