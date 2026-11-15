import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useGlobal } from '../../context/GlobalContext';
import { mediaUrl } from '../../lib/media';
import { cleanTag } from '../../lib/format';
import { productPath } from '../../lib/links';
import Price from '../ui/Price';
import Stars from '../ui/Stars';

export default function ProductCard({ product, index = 0, eager = false }) {
  const { isInWishlist, toggleWishlist, addToCart } = useGlobal();
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(null);

  const variations = product.product_variations || [];
  const colorCount = useMemo(() => new Set(variations.map((v) => v.color_id).filter(Boolean)).size, [variations]);
  const primaryColorId = product.color_id || variations[0]?.color_id || null;
  const sizeVariations = useMemo(
    () => variations.filter((v) => v.size && (primaryColorId ? v.color_id === primaryColorId : true)),
    [variations, primaryColorId]
  );

  const tag = cleanTag(product.product_tag);
  const onSale = Number(product.is_sale) === 1;
  const img = mediaUrl(product.primary_img);
  const img2 = mediaUrl(product.secondary_img) || img;
  const path = productPath(product.slug);

  const onWishlist = async (e) => {
    e.preventDefault();
    const res = await toggleWishlist(product);
    if (res?.needsLogin) {
      toast.info('Sign in to save pieces to your wishlist.');
      navigate('/login');
    } else if (res?.added) toast.success('Saved to wishlist');
  };

  const quickAdd = async (e, v) => {
    e.preventDefault();
    setAdding(v.id);
    const res = await addToCart(product, v.id, 1);
    setAdding(null);
    if (res?.ok) toast.success(`${product.prod_name} · ${v.size} added`);
    else toast.error(res?.message || 'Could not add to bag');
  };

  const saved = isInWishlist(product.id);

  return (
    <div
      className="group relative animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={path} className="block">
        <div className="card-media aspect-[4/5]">
          <img
            src={img}
            alt={product.prod_name}
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: hover && img2 !== img ? 0 : 1 }}
          />
          {img2 !== img && (
            <img
              src={img2}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: hover ? 1 : 0 }}
            />
          )}

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {onSale && <span className="badge-sale">Sale</span>}
            {tag && !onSale && <span className="badge-soft">{tag}</span>}
          </div>

          {/* wishlist */}
          <button
            onClick={onWishlist}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-paper/85 text-ink backdrop-blur transition-colors hover:bg-paper"
          >
            <FiHeart size={16} className={saved ? 'fill-sale text-sale' : ''} />
          </button>

          {/* quick size add */}
          {sizeVariations.length > 0 && (
            <div
              className="absolute inset-x-2 bottom-2 hidden translate-y-2 opacity-0 transition-all duration-300 ease-soft group-hover:translate-y-0 group-hover:opacity-100 sm:block"
            >
              <div className="flex flex-wrap items-center gap-1 bg-paper/92 p-1.5 backdrop-blur">
                <span className="px-1.5 text-[10px] font-medium uppercase tracking-label text-ink-muted">Add</span>
                {sizeVariations.map((v) => {
                  const out = Number(v.stock_qty) <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={(e) => (out ? e.preventDefault() : quickAdd(e, v))}
                      disabled={out || adding === v.id}
                      className={`min-w-[2rem] px-1.5 py-1 text-[11px] font-medium uppercase tracking-wide transition-colors ${
                        out
                          ? 'text-ink-muted/40 line-through'
                          : 'text-ink hover:bg-ink hover:text-paper'
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] leading-snug text-ink">{product.prod_name}</h3>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-muted">
            {product.product_quality && <span>{product.product_quality}</span>}
            {colorCount > 1 && <span>· {colorCount} colours</span>}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <Price product={product} />
            <Stars value={product.product_rating} size={12} />
          </div>
        </div>
      </Link>
    </div>
  );
}
