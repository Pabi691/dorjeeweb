import { inr, discountPercent, productPrice, priceLabel } from '../../lib/format';

// Inline price for cards / PDP. Shows sale + struck regular + discount when on
// sale, else the plain price (or "From ₹…" / "Price on request").
export default function Price({ product, size = 'md', className = '' }) {
  const min = productPrice(product);
  if (!min) return <span className={`text-ink-muted ${className}`}>Price on request</span>;

  const regular = Number(product?.regular_price) || 0;
  const onSale = Number(product?.is_sale) === 1 && regular > min;
  const pct = discountPercent(regular, min);
  const label = priceLabel(product);
  const base = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-[13px]' : 'text-[15px]';

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${base} font-medium tabular-nums text-ink`}>{label}</span>
      {onSale && label.startsWith('₹') && (
        <>
          <span className={`${size === 'lg' ? 'text-base' : 'text-[13px]'} tabular-nums text-ink-muted line-through`}>{inr(regular)}</span>
          {pct > 0 && <span className="text-[11px] font-semibold uppercase tracking-wide text-sale">−{pct}%</span>}
        </>
      )}
    </span>
  );
}
