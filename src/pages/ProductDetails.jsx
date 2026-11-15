import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiChevronDown, FiTruck, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { mediaUrl } from '../lib/media';
import { inr, discountPercent, toNumber } from '../lib/format';
import { colorHex } from '../lib/colors';
import { isDistributor } from '../lib/userRole';
import { productPath } from '../lib/links';
import { recentlyViewed } from '../lib/cache';
import Seo from '../components/Seo';
import Stars from '../components/ui/Stars';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, addToCart, toggleWishlist, isInWishlist } = useGlobal();

  const fromGlobal = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
  const [detail, setDetail] = useState(fromGlobal || null);
  const product = detail || fromGlobal || null;

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openHL, setOpenHL] = useState('Description');
  const [adding, setAdding] = useState(false);

  // Fetch richer detail (size chart, gallery) by slug.
  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    api
      .get(`/api/v1/get_slug_data/${slug}`)
      .then(({ data }) => alive && data?.product_details && setDetail(data.product_details))
      .catch(() => {});
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => { if (product) recentlyViewed.add(product); }, [product?.id]);

  const variations = product?.product_variations || [];
  const colors = useMemo(() => {
    const seen = new Map();
    variations.forEach((v) => v.color && !seen.has(v.color) && seen.set(v.color, v.color_id));
    return [...seen.keys()];
  }, [variations]);

  // Initialise selection
  useEffect(() => {
    if (!product) return;
    setColor((c) => c || product.color_details?.color_name || colors[0] || null);
    setQty(isDistributor() ? toNumber(product.pack_qty) || 1 : 1);
  }, [product?.id]);

  const sizesForColor = useMemo(
    () => variations.filter((v) => (color ? v.color === color : true) && v.size),
    [variations, color]
  );
  const selectedVariation = useMemo(
    () => sizesForColor.find((v) => v.size === size) || null,
    [sizesForColor, size]
  );

  // Gallery
  const gallery = useMemo(() => {
    if (!product) return [];
    const extra = (product.product_images || (product.product_image_list || []).map((i) => i.prod_img_url) || []).filter(Boolean);
    return [...new Set([product.primary_img, product.secondary_img, ...extra].filter(Boolean))].map(mediaUrl);
  }, [product]);

  if (!product) {
    if (productsLoading) return <div className="wrap py-24"><div className="skeleton h-[60vh]" /></div>;
    return (
      <div className="wrap py-28 text-center">
        <p className="font-display text-3xl">Piece not found</p>
        <Link to="/shop" className="btn-outline mt-6">Back to shop</Link>
      </div>
    );
  }

  const regular = toNumber(selectedVariation?.regular_price || product.regular_price);
  const sale = toNumber(selectedVariation?.sale_price || product.sale_price) || regular;
  const onSale = Number(product.is_sale) === 1 && regular > sale;
  const pct = discountPercent(regular, sale);
  const distributor = isDistributor();
  const packQty = toNumber(selectedVariation?.pack_qty || product.pack_qty);
  const packPrice = toNumber(selectedVariation?.pack_price || product.pack_price);
  const unitTrade = packQty > 0 && packPrice > 0 ? packPrice / packQty : sale;
  const saved = isInWishlist(product.id);
  const outOfStock = selectedVariation ? toNumber(selectedVariation.stock_qty) <= 0 : false;

  const highlights = product.product_key_highlights || [];
  const ratings = product.product_ratings || [];
  const related = products.filter((p) => p.id !== product.id && (p.product_categories || []).some((c) => (product.product_categories || []).some((pc) => pc.id === c.id))).slice(0, 4);

  const add = async () => {
    if (sizesForColor.length && !selectedVariation) return toast.error('Please select a size.');
    setAdding(true);
    const res = await addToCart(product, selectedVariation?.id, qty);
    setAdding(false);
    if (res?.ok) toast.success('Added to your bag');
    else toast.error(res?.message || 'Could not add to bag');
  };

  const wish = async () => {
    const res = await toggleWishlist(product);
    if (res?.needsLogin) { toast.info('Sign in to save pieces.'); navigate('/login'); }
    else if (res?.added) toast.success('Saved to wishlist');
  };

  return (
    <>
      <Seo title={product.prod_name} description={product.prod_desc?.slice(0, 150)} image={gallery[0]} type="product" />

      <div className="wrap py-8">
        <nav className="text-[12px] text-ink-muted">
          <Link to="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link> <span className="px-1">/</span>
          <span className="text-ink">{product.prod_name}</span>
        </nav>
      </div>

      <div className="wrap grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {gallery.length > 1 && (
            <div className="flex gap-3 md:flex-col">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(i)}
                  onClick={() => setActiveImg(i)}
                  className={`card-media h-20 w-16 flex-shrink-0 md:h-24 md:w-20 ${activeImg === i ? 'ring-1 ring-ink' : ''}`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="card-media aspect-[4/5] flex-1">
            <img src={gallery[activeImg] || gallery[0]} alt={product.prod_name} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="lg:py-4">
          {product.product_tag && <p className="eyebrow mb-3">{product.product_tag}</p>}
          <h1 className="display-md font-display">{product.prod_name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {ratings.length > 0 ? <Stars value={product.product_rating} count={ratings.length} /> : <span className="text-[12px] text-ink-muted">New arrival</span>}
            {product.product_quality && <span className="text-[12px] text-ink-muted">· {product.product_quality}</span>}
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            {distributor ? (
              <>
                <span className="text-2xl font-medium tabular-nums">{inr(unitTrade)}<span className="ml-1 text-[13px] text-ink-muted">/ unit</span></span>
                <span className="badge-soft">Trade · pack of {packQty || 1}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-medium tabular-nums">{inr(sale)}</span>
                {onSale && <span className="text-base text-ink-muted line-through">{inr(regular)}</span>}
                {onSale && pct > 0 && <span className="text-[13px] font-semibold text-sale">−{pct}%</span>}
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] text-ink-muted">MRP incl. of all taxes.</p>

          {/* Colour */}
          {colors.length > 0 && (
            <div className="mt-8">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[12px] font-medium uppercase tracking-label">Colour — <span className="text-ink-soft">{color}</span></p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setSize(null); }}
                    aria-label={c}
                    className={`relative h-9 w-9 rounded-full border transition-transform ${color === c ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper' : 'border-line-strong hover:scale-105'}`}
                    style={{ backgroundColor: colorHex(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {sizesForColor.length > 0 && (
            <div className="mt-7">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[12px] font-medium uppercase tracking-label">Size</p>
                <Link to="/size-guide" className="text-[12px] text-ink-muted underline hover:text-ink">Size guide</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((v) => {
                  const out = toNumber(v.stock_qty) <= 0;
                  const low = !out && toNumber(v.stock_qty) <= 3;
                  return (
                    <button
                      key={v.id}
                      onClick={() => !out && setSize(v.size)}
                      disabled={out}
                      title={low ? 'Low stock' : undefined}
                      className={`relative min-w-[3.25rem] border px-3 py-2.5 text-[13px] font-medium uppercase transition-colors ${
                        size === v.size ? 'border-ink bg-ink text-paper' : out ? 'cursor-not-allowed border-line text-ink-muted/40 line-through' : 'border-line-strong hover:border-ink'
                      }`}
                    >
                      {v.size}
                      {low && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sale" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariation && toNumber(selectedVariation.stock_qty) <= 3 && toNumber(selectedVariation.stock_qty) > 0 && (
                <p className="mt-2 text-[12px] text-sale">Only {selectedVariation.stock_qty} left in {size}.</p>
              )}
            </div>
          )}

          {/* Qty + actions */}
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center border border-line-strong">
              <button onClick={() => setQty((q) => Math.max(distributor ? packQty || 1 : 1, q - (distributor ? packQty || 1 : 1)))} className="grid h-12 w-12 place-items-center hover:bg-ink/5"><FiMinus size={14} /></button>
              <span className="min-w-[3rem] text-center tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => q + (distributor ? packQty || 1 : 1))} className="grid h-12 w-12 place-items-center hover:bg-ink/5"><FiPlus size={14} /></button>
            </div>
            <button onClick={add} disabled={adding || outOfStock} className="btn-ink flex-1">
              {outOfStock ? 'Out of stock' : adding ? 'Adding…' : distributor ? 'Add to trade order' : 'Add to bag'}
            </button>
            <button onClick={wish} aria-label="Save" className={`grid h-12 w-12 place-items-center border transition-colors ${saved ? 'border-sale text-sale' : 'border-line-strong hover:border-ink'}`}>
              <FiHeart size={18} className={saved ? 'fill-sale' : ''} />
            </button>
          </div>

          {/* Perks */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-y border-line py-5 text-[13px] text-ink-soft">
            <span className="inline-flex items-center gap-2"><FiTruck size={16} /> Free shipping over ₹2,500</span>
            <span className="inline-flex items-center gap-2"><FiRefreshCw size={16} /> 15-day easy returns</span>
          </div>

          {/* Accordions */}
          <div className="mt-2">
            {[{ label: 'Description', content: <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{product.prod_desc}</p> },
              ...(highlights.length ? [{ label: 'Details & care', content: (
                <dl className="divide-y divide-line">
                  {highlights.map((h, i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr] gap-3 py-2.5 text-[14px]">
                      <dt className="text-ink-muted">{h.label}</dt>
                      <dd className="text-ink-soft">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              ) }] : []),
              { label: 'Shipping & returns', content: <p className="text-[15px] leading-relaxed text-ink-soft">Dispatched in 1–2 business days. Complimentary shipping on orders over ₹2,500. Unworn pieces can be returned or exchanged within 15 days of delivery.</p> },
            ].map((acc) => (
              <div key={acc.label} className="border-b border-line">
                <button onClick={() => setOpenHL(openHL === acc.label ? '' : acc.label)} className="flex w-full items-center justify-between py-4 text-left text-[14px] font-medium uppercase tracking-[0.06em]">
                  {acc.label}
                  <FiChevronDown className={`transition-transform ${openHL === acc.label ? 'rotate-180' : ''}`} />
                </button>
                {openHL === acc.label && <div className="pb-5">{acc.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="wrap border-t border-line py-16">
          <h2 className="display-md mb-8 font-display">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
