import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import { isLoggedIn } from '../lib/api';
import Seo from '../components/Seo';
import ProductCard from '../components/product/ProductCard';

export default function Wishlist() {
  const { wishlist, wishlistLoading, products } = useGlobal();

  if (!isLoggedIn()) {
    return (
      <>
        <Seo title="Wishlist" />
        <div className="wrap py-28 text-center">
          <p className="eyebrow">Wishlist</p>
          <h1 className="display-lg mt-3 font-display">Save your favourites</h1>
          <p className="mt-3 text-[15px] text-ink-soft">Sign in to keep a wishlist across your devices.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="btn-ink">Sign in</Link>
            <Link to="/register" className="btn-outline">Create account</Link>
          </div>
        </div>
      </>
    );
  }

  // Resolve full product objects so cards render consistently.
  const saved = wishlist
    .map((w) => w.product || products.find((p) => p.id === w.product_id) || null)
    .filter(Boolean);

  return (
    <>
      <Seo title="Wishlist" />
      <div className="wrap py-10">
        <h1 className="display-lg font-display">Wishlist</h1>
        {wishlistLoading ? (
          <p className="mt-6 text-ink-muted">Loading…</p>
        ) : saved.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl">Nothing saved yet</p>
            <Link to="/shop" className="btn-outline mt-6">Browse the collection</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {saved.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
}
