import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiSliders, FiX, FiChevronDown } from 'react-icons/fi';
import { useGlobal } from '../context/GlobalContext';
import { productPrice } from '../lib/format';
import { categoryPath } from '../lib/links';
import Seo from '../components/Seo';
import ProductGrid from '../components/product/ProductGrid';
import Drawer from '../components/ui/Drawer';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

export default function Shop() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { products, productsLoading, categories, categoryTree } = useGlobal();

  const tag = params.get('tag') || '';
  const sort = params.get('sort') || 'featured';
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sel, setSel] = useState({ sizes: [], colors: [], sale: false });

  // Resolve the category (and its descendants) from the slug.
  const category = useMemo(() => categories.find((c) => c.slug === slug) || null, [categories, slug]);
  const idSet = useMemo(() => {
    if (!category) return null;
    const node = categoryTree.find((c) => c.id === category.id);
    const ids = new Set([category.id]);
    (node?.children || []).forEach((ch) => ids.add(ch.id));
    // also direct children by parent field
    categories.forEach((c) => (c.parent_category_id === category.id) && ids.add(c.id));
    return ids;
  }, [category, categoryTree, categories]);

  // Base set: by category, then by tag.
  const base = useMemo(() => {
    let list = products;
    if (idSet) list = list.filter((p) => (p.product_categories || []).some((c) => idSet.has(c.id)));
    if (tag) list = list.filter((p) => (p.product_tag || '').toLowerCase() === tag.toLowerCase());
    return list;
  }, [products, idSet, tag]);

  // Available facets from the base set.
  const facets = useMemo(() => {
    const sizes = new Map();
    const colors = new Map();
    base.forEach((p) =>
      (p.product_variations || []).forEach((v) => {
        if (v.size) sizes.set(v.size, true);
        if (v.color) colors.set(v.color, true);
      })
    );
    return { sizes: [...sizes.keys()], colors: [...colors.keys()] };
  }, [base]);

  const filtered = useMemo(() => {
    let list = base.filter((p) => {
      if (sel.sale && Number(p.is_sale) !== 1) return false;
      if (sel.sizes.length && !(p.product_variations || []).some((v) => sel.sizes.includes(v.size))) return false;
      if (sel.colors.length && !(p.product_variations || []).some((v) => sel.colors.includes(v.color))) return false;
      return true;
    });
    const arr = [...list];
    if (sort === 'price-asc') arr.sort((a, b) => productPrice(a) - productPrice(b));
    else if (sort === 'price-desc') arr.sort((a, b) => productPrice(b) - productPrice(a));
    else if (sort === 'newest') arr.sort((a, b) => (b.id || 0) - (a.id || 0));
    return arr;
  }, [base, sel, sort]);

  const title = category ? category.category_name : tag || 'All products';
  const toggle = (group, value) =>
    setSel((s) => ({ ...s, [group]: s[group].includes(value) ? s[group].filter((v) => v !== value) : [...s[group], value] }));
  const activeCount = sel.sizes.length + sel.colors.length + (sel.sale ? 1 : 0);
  const childNodes = category ? categoryTree.find((c) => c.id === category.id)?.children || [] : [];

  return (
    <>
      <Seo title={title} description={category?.cat_desc} />

      {/* Page head */}
      <div className="border-b border-line bg-paper-2">
        <div className="wrap py-10">
          <nav className="text-[12px] text-ink-muted">
            <Link to="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span>
            <Link to="/shop" className="hover:text-ink">Shop</Link>
            {category && <> <span className="px-1">/</span> <span className="text-ink">{category.category_name}</span></>}
          </nav>
          <h1 className="display-lg mt-3 font-display">{title}</h1>
          {category?.cat_desc && <p className="mt-2 max-w-xl text-[15px] text-ink-soft">{category.cat_desc}</p>}
          {childNodes.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {childNodes.map((c) => (
                <Link key={c.id} to={categoryPath(c.slug)} className="chip hover:border-ink hover:bg-ink hover:text-paper">
                  {c.category_name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="wrap flex items-center justify-between py-3">
          <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-label">
            <FiSliders size={15} /> Filters {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-paper">{activeCount}</span>}
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-[12px] text-ink-muted sm:block">{filtered.length} items</span>
            <label className="relative inline-flex items-center">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(e) => { const p = new URLSearchParams(params); p.set('sort', e.target.value); setParams(p, { replace: true }); }}
                className="appearance-none border border-line-strong bg-paper py-2 pl-3 pr-9 text-[13px] focus:border-ink focus:outline-none"
              >
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3 text-ink-muted" size={14} />
            </label>
          </div>
        </div>
      </div>

      {/* Active chips */}
      {activeCount > 0 && (
        <div className="wrap flex flex-wrap items-center gap-2 pt-5">
          {sel.sizes.map((s) => <button key={s} onClick={() => toggle('sizes', s)} className="chip">{s} <FiX size={12} /></button>)}
          {sel.colors.map((c) => <button key={c} onClick={() => toggle('colors', c)} className="chip">{c} <FiX size={12} /></button>)}
          {sel.sale && <button onClick={() => setSel((s) => ({ ...s, sale: false }))} className="chip">On sale <FiX size={12} /></button>}
          <button onClick={() => setSel({ sizes: [], colors: [], sale: false })} className="text-[12px] text-ink-muted underline">Clear all</button>
        </div>
      )}

      {/* Grid */}
      <section className="wrap py-10">
        {!productsLoading && filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="mt-2 text-[15px] text-ink-soft">Try removing a filter or browse the full collection.</p>
            <Link to="/shop" className="btn-outline mt-6">View all products</Link>
          </div>
        ) : (
          <ProductGrid products={filtered} loading={productsLoading} skeletonCount={8} eagerCount={4} />
        )}
      </section>

      {/* Filters drawer */}
      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" title="Filters" width="max-w-[380px]"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setSel({ sizes: [], colors: [], sale: false })} className="btn-ghost btn-sm flex-1">Clear</button>
            <button onClick={() => setFiltersOpen(false)} className="btn-ink btn-sm flex-1">Show {filtered.length}</button>
          </div>
        }
      >
        <div className="px-6 py-6">
          {facets.sizes.length > 0 && (
            <div className="mb-8">
              <p className="eyebrow mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {facets.sizes.map((s) => (
                  <button key={s} onClick={() => toggle('sizes', s)}
                    className={`min-w-[3rem] border px-3 py-2 text-[13px] uppercase transition-colors ${sel.sizes.includes(s) ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {facets.colors.length > 0 && (
            <div className="mb-8">
              <p className="eyebrow mb-3">Colour</p>
              <div className="flex flex-wrap gap-2">
                {facets.colors.map((c) => (
                  <button key={c} onClick={() => toggle('colors', c)}
                    className={`border px-3 py-2 text-[13px] transition-colors ${sel.colors.includes(c) ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={sel.sale} onChange={(e) => setSel((s) => ({ ...s, sale: e.target.checked }))} className="h-4 w-4 accent-ink" />
            <span className="text-[14px]">On sale only</span>
          </label>
        </div>
      </Drawer>
    </>
  );
}
