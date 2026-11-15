import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useGlobal } from '../context/GlobalContext';
import { mediaUrl } from '../lib/media';
import { inr } from '../lib/format';
import { FREE_ABOVE } from '../lib/shipping';
import { lineName, lineImage, lineSize, lineColor, lineTotal, lineKey } from '../lib/cart';
import { productPath } from '../lib/links';
import Seo from '../components/Seo';
import QuantityStepper from '../components/ui/QuantityStepper';

export default function Cart() {
  const { cart, cartCount, subtotal, savings, totalMRP, updateCartQuantity, removeCartItem } = useGlobal();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <>
        <Seo title="Your bag" />
        <div className="wrap py-28 text-center">
          <p className="eyebrow">Your bag</p>
          <h1 className="display-lg mt-3 font-display">Your bag is empty</h1>
          <p className="mt-3 text-[15px] text-ink-soft">Once you add pieces they'll show up here.</p>
          <Link to="/shop" className="btn-ink mt-8">Start shopping</Link>
        </div>
      </>
    );
  }

  const remaining = Math.max(0, FREE_ABOVE - subtotal);

  return (
    <>
      <Seo title="Your bag" />
      <div className="wrap py-10">
        <h1 className="display-lg font-display">Your bag <span className="text-ink-muted">({cartCount})</span></h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Lines */}
          <div>
            <div className="border-t border-line">
              {cart.map((item) => (
                <div key={lineKey(item)} className="flex gap-5 border-b border-line py-6">
                  <Link to={productPath(item.slug || item.product?.slug || '')} className="card-media h-36 w-28 flex-shrink-0">
                    <img src={mediaUrl(lineImage(item))} alt={lineName(item)} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-[16px] text-ink">{lineName(item)}</p>
                        <p className="mt-1 text-[13px] text-ink-muted">
                          {[lineColor(item), lineSize(item) && `Size ${lineSize(item)}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <button onClick={() => removeCartItem(item)} aria-label="Remove" className="h-fit text-ink-muted hover:text-sale">
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <QuantityStepper value={Number(item.quantity) || 1} onChange={(q) => updateCartQuantity(item, q)} />
                      <span className="text-[16px] font-medium tabular-nums">{inr(lineTotal(item))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-label">
              <FiArrowLeft /> Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="h-fit border border-line bg-paper-2 p-7 lg:sticky lg:top-24">
            <h2 className="text-[13px] font-medium uppercase tracking-label">Order summary</h2>
            <dl className="mt-5 space-y-3 text-[15px]">
              <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{inr(totalMRP)}</dd></div>
              {savings > 0 && <div className="flex justify-between text-success"><dt>Savings</dt><dd className="tabular-nums">− {inr(savings)}</dd></div>}
              <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="text-ink-muted">{remaining > 0 ? 'At checkout' : 'Free'}</dd></div>
            </dl>
            <div className="mt-5 flex justify-between border-t border-line pt-5">
              <span className="text-[16px] font-medium">Total</span>
              <span className="text-[18px] font-medium tabular-nums">{inr(subtotal)}</span>
            </div>
            {remaining > 0 && (
              <p className="mt-3 text-[12.5px] text-ink-muted">Add {inr(remaining)} more for complimentary shipping.</p>
            )}
            <button onClick={() => navigate('/checkout')} className="btn-ink btn-block mt-6">Checkout <FiArrowRight /></button>
            <p className="mt-3 text-center text-[12px] text-ink-muted">Taxes included. Coupons applied at checkout.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
