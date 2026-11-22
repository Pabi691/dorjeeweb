import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';
import { searchProducts, POPULAR_SEARCHES } from '../../lib/search';
import { mediaUrl } from '../../lib/media';
import { priceLabel } from '../../lib/format';
import { productPath } from '../../lib/links';

export default function SearchOverlay({ open, onClose }) {
  const { products } = useGlobal();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = q.trim() ? searchProducts(products, q).slice(0, 6) : [];

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-paper"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="wrap pt-6">
            <div className="flex items-center justify-between">
              <img src="/brand/logo.jpeg" alt="Dorjee Fashion Factory" className="h-10 w-auto mix-blend-multiply" />
              <button onClick={onClose} aria-label="Close search" className="grid h-10 w-10 place-items-center hover:bg-ink/5">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-10 flex items-center gap-4 border-b-2 border-ink pb-4">
              <FiSearch size={24} className="text-ink-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for linen, shirts, trousers…"
                className="w-full bg-transparent font-display text-2xl placeholder:text-ink-muted/60 focus:outline-none md:text-4xl"
              />
            </form>

            {!q.trim() ? (
              <div className="mt-8">
                <p className="eyebrow">Popular searches</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQ(term)}
                      className="chip transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 max-h-[60vh] overflow-y-auto">
                {results.length ? (
                  <ul className="divide-y divide-line">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link to={productPath(p.slug)} onClick={onClose} className="flex items-center gap-4 py-3 hover:bg-ink/[0.03]">
                          <img src={mediaUrl(p.primary_img)} alt="" className="h-16 w-14 object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px]">{p.prod_name}</p>
                            <p className="text-[13px] text-ink-muted">{priceLabel(p)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[15px] text-ink-soft">No pieces match “{q}”.</p>
                )}
                {results.length > 0 && (
                  <button onClick={submit} className="mt-6 text-[13px] font-medium uppercase tracking-label link-underline">
                    See all results
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
