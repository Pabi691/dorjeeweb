import { Link, useLocation } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import Seo from '../components/Seo';
import { SITE } from '../config/site';

export default function ThankYou() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <>
      <Seo title="Order confirmed" />
      <div className="wrap flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-brand-on">
          <FiCheck size={28} />
        </div>
        <p className="eyebrow mt-8">Thank you</p>
        <h1 className="display-lg mt-3 font-display">Your order is confirmed</h1>
        {orderId && <p className="mt-3 text-[15px] text-ink-soft">Order reference <span className="font-medium text-ink">#{orderId}</span></p>}
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          We've emailed your confirmation and will let you know the moment it ships. Every Dorjee piece is checked by
          hand before it leaves the studio.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/account/orders" className="btn-ink">View my orders</Link>
          <Link to="/shop" className="btn-outline">Continue shopping</Link>
        </div>
        <p className="mt-10 text-[13px] text-ink-muted">
          Questions? <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="underline">Message us</a>
        </p>
      </div>
    </>
  );
}
