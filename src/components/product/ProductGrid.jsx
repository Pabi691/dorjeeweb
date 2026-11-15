import ProductCard from './ProductCard';

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton mt-4 h-4 w-2/3" />
      <div className="skeleton mt-2 h-3 w-1/3" />
      <div className="skeleton mt-3 h-4 w-1/4" />
    </div>
  );
}

export default function ProductGrid({ products = [], loading = false, skeletonCount = 8, cols = 'default', eagerCount = 0 }) {
  const colClass =
    cols === 'tight'
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid gap-x-5 gap-y-10 ${colClass}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className={`grid gap-x-5 gap-y-10 ${colClass}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} eager={i < eagerCount} />
      ))}
    </div>
  );
}
