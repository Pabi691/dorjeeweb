import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiUser, FiGrid, FiLogOut, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { isLoggedIn } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { inr, formatDate } from '../../lib/format';
import { isDistributor } from '../../lib/userRole';
import Seo from '../../components/Seo';

const bearer = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } });

function SignedOut() {
  return (
    <div className="wrap py-28 text-center">
      <p className="eyebrow">Account</p>
      <h1 className="display-lg mt-3 font-display">Sign in to your account</h1>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/login" className="btn-ink">Sign in</Link>
        <Link to="/register" className="btn-outline">Create account</Link>
      </div>
    </div>
  );
}

const navItems = [
  { to: '/account', icon: FiGrid, label: 'Overview', end: true },
  { to: '/account/orders', icon: FiPackage, label: 'Orders' },
  { to: '/account/addresses', icon: FiMapPin, label: 'Addresses' },
  { to: '/account/profile', icon: FiUser, label: 'Profile' },
];

export default function Account() {
  const { logout } = useAuth();
  if (!isLoggedIn()) return (<><Seo title="Account" /><SignedOut /></>);

  const name = localStorage.getItem('username') || 'there';

  return (
    <>
      <Seo title="My account" />
      <div className="border-b border-line bg-paper-2">
        <div className="wrap py-10">
          <p className="eyebrow">My account</p>
          <h1 className="display-lg mt-2 font-display">Hello, {name.split(' ')[0]}</h1>
          {isDistributor() && <span className="badge-soft mt-3">Trade account</span>}
        </div>
      </div>

      <div className="wrap grid gap-10 py-12 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 whitespace-nowrap px-4 py-3 text-[14px] transition-colors ${isActive ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-ink/5'}`
                }
              >
                <n.icon size={16} /> {n.label}
              </NavLink>
            ))}
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-left text-[14px] text-ink-soft hover:bg-ink/5">
              <FiLogOut size={16} /> Sign out
            </button>
          </nav>
        </aside>

        <div className="min-w-0">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function Overview() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/api/v1/get_my_orders', bearer()).then(({ data }) => setOrders(data?.orders || data?.data || [])).catch(() => {}); }, []);
  const tiles = [
    { label: 'Orders', value: orders.length, to: '/account/orders' },
    { label: 'Addresses', value: '—', to: '/account/addresses' },
    { label: 'Wishlist', value: '♥', to: '/wishlist' },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl">Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="border border-line p-6 transition-colors hover:border-ink">
            <p className="font-display text-3xl">{t.value}</p>
            <p className="mt-1 text-[13px] uppercase tracking-label text-ink-muted">{t.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 border border-line bg-paper-2 p-7">
        <p className="text-[15px] text-ink-soft">Need a hand with an order or a return? <Link to="/contact" className="font-medium text-ink underline">Contact us</Link>.</p>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api.get('/api/v1/get_my_orders', bearer()).then(({ data }) => setOrders(data?.orders || data?.data || [])).catch(() => setOrders([])); }, []);

  if (orders === null) return <div className="skeleton h-40" />;
  if (!orders.length) return (
    <div className="border border-line py-20 text-center">
      <p className="font-display text-2xl">No orders yet</p>
      <Link to="/shop" className="btn-outline mt-6">Start shopping</Link>
    </div>
  );

  return (
    <div>
      <h2 className="font-display text-2xl">Orders</h2>
      <div className="mt-6 space-y-4">
        {orders.map((o) => {
          const id = o.id || o.order_id;
          const total = o.pay_amt ?? o.net_amt ?? o.bill_amt ?? o.total;
          const status = o.order_status_details?.status_description || o.status_description || o.order_status || 'Placed';
          const items = o.order_items || o.items || [];
          return (
            <div key={id} className="border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">Order #{o.order_no || id}</p>
                  <p className="text-[12.5px] text-ink-muted">{formatDate(o.created_at)}</p>
                </div>
                <span className="badge-soft">{status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[14px]">
                <span className="text-ink-muted">{items.length ? `${items.length} item${items.length > 1 ? 's' : ''}` : ''}</span>
                {total != null && <span className="font-medium tabular-nums">{inr(total)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const EMPTY_ADDR = { address_label: 'Home', full_name: '', email: '', mobile_number: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', country: 'India' };

function Addresses() {
  const [list, setList] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_ADDR);

  const load = () => api.get('/api/v1/get_customer_shipping_addresses', bearer()).then(({ data }) => setList(data?.addresses || data?.data || [])).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/v1/add_customer_shipping_addresses', form, bearer());
      if (data?.status) { toast.success('Address saved'); setForm(EMPTY_ADDR); setAdding(false); load(); }
      else toast.error(data?.message || data?.error_message || 'Could not save address');
    } catch { toast.error('Could not save address'); }
  };

  const remove = async (id) => {
    try { await api.get(`/api/v1/delete_customer_shipping_addresses/${id}`, bearer()); load(); } catch { /* */ }
  };

  if (list === null) return <div className="skeleton h-40" />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Addresses</h2>
        {!adding && <button onClick={() => setAdding(true)} className="btn-outline btn-sm"><FiPlus size={14} /> Add</button>}
      </div>

      {adding && (
        <form onSubmit={save} className="mt-6 border border-line bg-paper-2 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Label</label><input className="field" value={form.address_label} onChange={(e) => setForm({ ...form, address_label: e.target.value })} required /></div>
            <div><label className="field-label">Full name</label><input className="field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div><label className="field-label">Email</label><input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="field-label">Mobile</label><input className="field" value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} required /></div>
            <div className="sm:col-span-2"><label className="field-label">Address line 1</label><input className="field" value={form.address_line_1} onChange={(e) => setForm({ ...form, address_line_1: e.target.value })} required /></div>
            <div className="sm:col-span-2"><label className="field-label">Address line 2</label><input className="field" value={form.address_line_2} onChange={(e) => setForm({ ...form, address_line_2: e.target.value })} /></div>
            <div><label className="field-label">City</label><input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
            <div><label className="field-label">State</label><input className="field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required /></div>
            <div><label className="field-label">PIN code</label><input className="field" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} required /></div>
            <div><label className="field-label">Country</label><input className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          </div>
          <div className="mt-5 flex gap-3">
            <button className="btn-ink btn-sm">Save address</button>
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost btn-sm">Cancel</button>
          </div>
        </form>
      )}

      {!list.length && !adding ? (
        <p className="mt-6 text-[15px] text-ink-soft">No saved addresses yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <div key={a.id} className="border border-line p-5">
              <div className="flex items-center justify-between">
                <span className="badge-soft">{a.address_label}</span>
                <button onClick={() => remove(a.id)} className="text-ink-muted hover:text-sale"><FiTrash2 size={15} /></button>
              </div>
              <p className="mt-3 text-[15px] font-medium">{a.full_name}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                {[a.address_line_1, a.address_line_2, a.city, a.state, a.zip_code].filter(Boolean).join(', ')}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">{a.mobile_number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/v1/get_customer_details', bearer()).then(({ data }) => {
      const c = data?.customer || data?.data || data?.customer_details || {};
      setForm({ first_name: c.first_name || '', last_name: c.last_name || '', email: c.email || '', mobile_number: c.mobile_number || '', alt_mob_number: c.alt_mob_number || '', city: c.city || '', state: c.state || '', zip_code: c.zip_code || '', country: c.country || 'India' });
    }).catch(() => setForm({ first_name: localStorage.getItem('username') || '', email: localStorage.getItem('useremail') || '', mobile_number: '' }));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/api/v1/update_customer_profile', form, bearer());
      if (data?.status) { toast.success('Profile updated'); localStorage.setItem('username', form.first_name); }
      else toast.error(data?.message || data?.error_message || 'Could not update profile');
    } catch { toast.error('Could not update profile'); }
    finally { setSaving(false); }
  };

  if (!form) return <div className="skeleton h-40" />;

  return (
    <div>
      <h2 className="font-display text-2xl">Profile</h2>
      <form onSubmit={save} className="mt-6 max-w-lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="field-label">First name</label><input className="field" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required /></div>
          <div><label className="field-label">Last name</label><input className="field" value={form.last_name || ''} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
          <div><label className="field-label">Email</label><input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="field-label">Mobile</label><input className="field" value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} required /></div>
          <div><label className="field-label">City</label><input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div><label className="field-label">State</label><input className="field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
        </div>
        <button disabled={saving} className="btn-ink mt-6">{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
}
