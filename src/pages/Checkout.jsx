import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiCheck, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { isLoggedIn } from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { inr, toNumber } from '../lib/format';
import { mediaUrl } from '../lib/media';
import { deliveryCharge } from '../lib/shipping';
import {
  lineName, lineImage, lineSize, lineColor, lineUnitPrice, lineRegularPrice, lineVariation, lineProduct, lineTotal,
} from '../lib/cart';
import Seo from '../components/Seo';

const bearer = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } });
const EMPTY_ADDR = { address_label: 'Home', full_name: '', email: '', mobile_number: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', country: 'India' };

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartLoading, subtotal, fetchCart } = useGlobal();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null); // { code, discount }
  const [placing, setPlacing] = useState(false);

  const loggedIn = isLoggedIn();

  const loadAddresses = () =>
    api.get('/api/v1/get_customer_shipping_addresses', bearer())
      .then(({ data }) => {
        const list = data?.addresses || data?.data || [];
        setAddresses(list);
        setSelected((s) => s || list.find((a) => a.is_default)?.id || list[0]?.id || null);
      })
      .catch(() => {});

  useEffect(() => { if (loggedIn) loadAddresses(); }, [loggedIn]);

  const selectedAddress = useMemo(() => addresses.find((a) => a.id === selected), [addresses, selected]);
  const discount = applied?.discount || 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = deliveryCharge(selectedAddress?.state, afterDiscount);
  const total = afterDiscount + shipping;

  if (!loggedIn) {
    return (
      <>
        <Seo title="Checkout" />
        <div className="wrap py-28 text-center">
          <FiLock className="mx-auto text-ink-muted" size={28} />
          <h1 className="display-md mt-5 font-display">Sign in to check out</h1>
          <p className="mt-3 text-[15px] text-ink-soft">Your bag is saved. Sign in or create an account to complete your order.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="btn-ink">Sign in</Link>
            <Link to="/register" className="btn-outline">Create account</Link>
          </div>
        </div>
      </>
    );
  }

  if (!cartLoading && !cart.length) {
    return (
      <div className="wrap py-28 text-center">
        <h1 className="display-md font-display">Your bag is empty</h1>
        <Link to="/shop" className="btn-ink mt-6">Shop the collection</Link>
      </div>
    );
  }

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/v1/add_customer_shipping_addresses', addr, bearer());
      if (data?.status) {
        toast.success('Address added');
        setAdding(false);
        setAddr(EMPTY_ADDR);
        const newId = data?.address?.id || data?.data?.id;
        await loadAddresses();
        if (newId) setSelected(newId);
      } else toast.error(data?.message || data?.error_message || 'Could not save address');
    } catch { toast.error('Could not save address'); }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const { data } = await api.post('/api/v1/validate_coupon', { coupon_code: coupon.trim(), order_amount: subtotal, order_value: subtotal }, bearer());
      const d = toNumber(data?.discount_amount ?? data?.discount ?? data?.data?.discount_amount);
      if (data?.status && d > 0) { setApplied({ code: coupon.trim(), discount: d }); toast.success(`Coupon applied — ${inr(d)} off`); }
      else if (data?.status) { setApplied({ code: coupon.trim(), discount: 0 }); toast.info('Coupon applied.'); }
      else toast.error(data?.message || data?.error_message || 'Invalid coupon');
    } catch { toast.error('Could not apply coupon'); }
  };

  const placeOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address.');
    setPlacing(true);
    const order_items = cart.map((item) => ({
      product_id: item.product_id ?? lineProduct(item).id,
      prod_variation_id: item.prod_variation_id ?? lineVariation(item)?.id ?? null,
      sku: lineVariation(item)?.sku ?? null,
      product_name: lineName(item),
      quantity: toNumber(item.quantity) || 1,
      price: lineUnitPrice(item),
      regular_price: lineRegularPrice(item),
    }));

    const payload = {
      order_items,
      shipping_address: selectedAddress.id,
      bill_amt: subtotal,
      discount_amt: discount,
      net_amt: afterDiscount,
      shipping_total: shipping,
      r_off: 0,
      pay_amt: total,
      pay_method_id: 1, // Cash on Delivery
      coupon_code: applied?.code || null,
    };

    try {
      const { data } = await api.post('/api/v1/create_order', payload, bearer());
      if (data?.status) {
        const orderId = data.order_id || data.order?.id || data.data?.id || data.order_details?.id;
        await fetchCart();
        navigate('/thank-you', { state: { orderId } });
      } else {
        toast.error(data?.error_message || data?.message || 'Could not place your order.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.error_message || 'Could not place your order.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Seo title="Checkout" />
      <div className="wrap py-10">
        <h1 className="display-lg font-display">Checkout</h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* Left — address + payment */}
          <div>
            {/* Address */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-medium uppercase tracking-label">Delivery address</h2>
                {!adding && <button onClick={() => setAdding(true)} className="btn-outline btn-sm"><FiPlus size={14} /> New address</button>}
              </div>

              {adding ? (
                <form onSubmit={saveAddress} className="mt-5 border border-line bg-paper-2 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="field-label">Label</label><input className="field" value={addr.address_label} onChange={(e) => setAddr({ ...addr, address_label: e.target.value })} required /></div>
                    <div><label className="field-label">Full name</label><input className="field" value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} required /></div>
                    <div><label className="field-label">Email</label><input type="email" className="field" value={addr.email} onChange={(e) => setAddr({ ...addr, email: e.target.value })} required /></div>
                    <div><label className="field-label">Mobile</label><input className="field" value={addr.mobile_number} onChange={(e) => setAddr({ ...addr, mobile_number: e.target.value })} required /></div>
                    <div className="sm:col-span-2"><label className="field-label">Address line 1</label><input className="field" value={addr.address_line_1} onChange={(e) => setAddr({ ...addr, address_line_1: e.target.value })} required /></div>
                    <div className="sm:col-span-2"><label className="field-label">Address line 2</label><input className="field" value={addr.address_line_2} onChange={(e) => setAddr({ ...addr, address_line_2: e.target.value })} /></div>
                    <div><label className="field-label">City</label><input className="field" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} required /></div>
                    <div><label className="field-label">State</label><input className="field" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} required /></div>
                    <div><label className="field-label">PIN code</label><input className="field" value={addr.zip_code} onChange={(e) => setAddr({ ...addr, zip_code: e.target.value })} required /></div>
                    <div><label className="field-label">Country</label><input className="field" value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })} /></div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button className="btn-ink btn-sm">Save & use</button>
                    {addresses.length > 0 && <button type="button" onClick={() => setAdding(false)} className="btn-ghost btn-sm">Cancel</button>}
                  </div>
                </form>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <button key={a.id} onClick={() => setSelected(a.id)} className={`border p-5 text-left transition-colors ${selected === a.id ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-ink'}`}>
                      <div className="flex items-center justify-between">
                        <span className="badge-soft">{a.address_label}</span>
                        {selected === a.id && <FiCheck className="text-ink" />}
                      </div>
                      <p className="mt-3 text-[14px] font-medium">{a.full_name}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{[a.address_line_1, a.city, a.state, a.zip_code].filter(Boolean).join(', ')}</p>
                      <p className="mt-1 text-[12.5px] text-ink-muted">{a.mobile_number}</p>
                    </button>
                  ))}
                  {!addresses.length && <p className="text-[15px] text-ink-soft">Add a delivery address to continue.</p>}
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="mt-12">
              <h2 className="text-[13px] font-medium uppercase tracking-label">Payment</h2>
              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 border border-ink p-5">
                  <input type="radio" checked readOnly className="h-4 w-4 accent-ink" />
                  <span>
                    <span className="block text-[15px] font-medium">Cash on Delivery</span>
                    <span className="block text-[13px] text-ink-muted">Pay when your order arrives.</span>
                  </span>
                </label>
                <div className="flex items-center gap-3 border border-line p-5 opacity-50">
                  <input type="radio" disabled className="h-4 w-4" />
                  <span className="text-[15px]">Online payment (cards, UPI) — coming soon</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right — summary */}
          <aside className="h-fit border border-line bg-paper-2 lg:sticky lg:top-24">
            <div className="max-h-72 overflow-y-auto border-b border-line p-6">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 py-2">
                  <img src={mediaUrl(lineImage(item))} alt="" className="h-16 w-12 flex-shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px]">{lineName(item)}</p>
                    <p className="text-[12px] text-ink-muted">{[lineColor(item), lineSize(item)].filter(Boolean).join(' · ')} × {item.quantity}</p>
                  </div>
                  <span className="text-[13px] tabular-nums">{inr(lineTotal(item))}</span>
                </div>
              ))}
            </div>

            <div className="border-b border-line p-6">
              <label className="field-label">Coupon code</label>
              <div className="flex gap-2">
                <input className="field" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="WELCOME10" />
                <button onClick={applyCoupon} className="btn-outline btn-sm whitespace-nowrap">Apply</button>
              </div>
              {applied && <p className="mt-2 text-[12.5px] text-success">Coupon {applied.code} applied.</p>}
            </div>

            <div className="p-6">
              <dl className="space-y-2.5 text-[14px]">
                <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{inr(subtotal)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd className="tabular-nums">− {inr(discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="tabular-nums">{shipping ? inr(shipping) : 'Free'}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[16px] font-medium">Total</span>
                <span className="text-[18px] font-medium tabular-nums">{inr(total)}</span>
              </div>
              <button onClick={placeOrder} disabled={placing || !selectedAddress} className="btn-ink btn-block mt-5">
                {placing ? 'Placing order…' : `Place order · ${inr(total)}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-muted"><FiLock size={12} /> Secure checkout · GST included</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
