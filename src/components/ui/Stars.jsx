import { FiStar } from 'react-icons/fi';

export default function Stars({ value = 0, count, size = 13, className = '' }) {
  const v = Math.round(Number(value) || 0);
  if (!v && !count) return null;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${v} out of 5`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <FiStar
            key={i}
            size={size}
            className={i <= v ? 'fill-brand-500 text-brand-500' : 'text-line-strong'}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {count != null && <span className="text-[12px] text-ink-muted">({count})</span>}
    </span>
  );
}
