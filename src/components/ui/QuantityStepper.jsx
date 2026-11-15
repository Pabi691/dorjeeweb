import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantityStepper({ value, onChange, min = 1, max = 99, step = 1, className = '' }) {
  const set = (next) => onChange(Math.max(min, Math.min(max, next)));
  return (
    <div className={`inline-flex items-center border border-line-strong ${className}`}>
      <button
        type="button"
        onClick={() => set(value - step)}
        disabled={value <= min}
        className="grid h-10 w-10 place-items-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <FiMinus size={14} />
      </button>
      <span className="min-w-[2.5rem] text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => set(value + step)}
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
}
