import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';
import { NAV } from '../../config/site';
import { categoryPath } from '../../lib/links';
import MegaMenu from './MegaMenu';

export default function Header({ onOpenCart, onOpenMenu, onOpenSearch }) {
  const { cartCount, categoryTree, wishlist } = useGlobal();
  const [mega, setMega] = useState(null); // active top-level slug

  const nodeFor = (slug) => categoryTree.find((c) => c.slug === slug);
  const activeNode = mega ? nodeFor(mega) : null;

  const iconBtn = 'relative grid h-10 w-10 place-items-center text-ink transition-colors hover:text-brand-600';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur" onMouseLeave={() => setMega(null)}>
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* left — nav / hamburger */}
        <div className="flex items-center">
          <button onClick={onOpenMenu} className={`${iconBtn} lg:hidden -ml-2`} aria-label="Open menu">
            <FiMenu size={20} />
          </button>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => {
              const node = item.mega ? nodeFor(item.slug) : null;
              const to = item.mega ? categoryPath(item.slug) : item.to;
              return (
                <div key={item.label} onMouseEnter={() => setMega(item.mega ? item.slug : null)}>
                  <Link
                    to={to}
                    className={`text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-brand-600 ${
                      mega === item.slug ? 'text-brand-600' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* center — logo */}
        <Link to="/" className="justify-self-center" onMouseEnter={() => setMega(null)} aria-label="Dorjee Fashion Factory — home">
          <img src="/brand/logo.jpeg" alt="Dorjee Fashion Factory" className="h-12 w-auto mix-blend-multiply sm:h-14" />
        </Link>

        {/* right — actions */}
        <div className="flex items-center justify-end gap-0.5" onMouseEnter={() => setMega(null)}>
          <button onClick={onOpenSearch} className={iconBtn} aria-label="Search"><FiSearch size={19} /></button>
          <Link to="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Account"><FiUser size={19} /></Link>
          <Link to="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label="Wishlist">
            <FiHeart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-brand-on">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button onClick={onOpenCart} className={iconBtn} aria-label="Bag">
            <FiShoppingBag size={19} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] font-semibold text-paper"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>{activeNode && <MegaMenu node={activeNode} onNavigate={() => setMega(null)} />}</AnimatePresence>
    </header>
  );
}
