import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';
import { mediaUrl } from '../../lib/media';
import { inr } from '../../lib/format';
import { FREE_ABOVE } from '../../lib/shipping';
import { lineName, lineImage, lineSize, lineColor, lineUnitPrice, lineTotal, lineKey } from '../../lib/cart';
import Drawer from '../ui/Drawer';
import QuantityStepper from '../ui/QuantityStepper';

export default function CartDrawer({ open, onClose }) {
  const { cart, cartCount, subtotal, updateCartQuantity, removeCartItem } = useGlobal();
  const navigate = useNavigate();

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const remaining = Math.max(0, FREE_ABOVE - subtotal);
  const pct = Math.min(100, (subtotal / FREE_ABOVE) * 100);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Your bag${cartCount ? ` (${cartCount})` : ''}`}
      footer={
        cart.length ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-medium tabular-nums">{inr(subtotal)}</span>
            </div>
            <p className="text-[12px] text-ink-muted">Shipping & taxes calculated at checkout.</p>
            <button onClick={() => go('/checkout')} className="btn-ink btn-block">
              Checkout <FiArrowRight />
            </button>
            <button onClick={() => go('/cart')} className="btn-ghost btn-block btn-sm">
              View full bag
            </button>
          </div>
        ) : null
      }
    >
      {!cart.length ? (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-2xl">Your bag is empty</p>
          <p className="mt-2 text-[14px] text-ink-soft">Pieces you add will appear here.</p>
          <button onClick={() => go('/shop')} className="btn-outline mt-6">Start shopping</button>
        </div>
      ) : (
        <div>
          {/* free shipping progress */}
          <div className="border-b border-line px-6 py-4">
            {remaining > 0 ? (
              <p className="text-[13px] text-ink-soft">
                Add <span className="font-medium text-ink">{inr(remaining)}</span> for complimentary shipping.
              </p>
            ) : (
              <p className="text-[13px] text-success">You've unlocked complimentary shipping.</p>
            )}
            <div className="mt-2 h-[3px] w-full bg-line">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <ul>
            {cart.map((item) => (
              <li key={lineKey(item)} className="flex gap-4 border-b border-line px-6 py-5">
                <div className="card-media h-28 w-[88px] flex-shrink-0">
                  <img src={mediaUrl(lineImage(item))} alt={lineName(item)} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <p className="truncate text-[14px] text-ink">{lineName(item)}</p>
                    <button onClick={() => removeCartItem(item)} aria-label="Remove" className="text-ink-muted hover:text-sale">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">
                    {[lineColor(item), lineSize(item) && `Size ${lineSize(item)}`].filter(Boolean).join(' · ')}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper
                      value={Number(item.quantity) || 1}
                      onChange={(q) => updateCartQuantity(item, q)}
                    />
                    <span className="text-[14px] font-medium tabular-nums">{inr(lineTotal(item))}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
