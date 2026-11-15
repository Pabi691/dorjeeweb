import { useState } from 'react';
import { FiCheck, FiPackage, FiTrendingUp, FiFileText, FiTruck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../lib/api';
import Seo from '../components/Seo';
import { mediaUrl } from '../lib/media';

const BENEFITS = [
  { icon: FiTrendingUp, t: 'Trade pricing', d: 'Up to 20% below retail, applied automatically once your account is approved.' },
  { icon: FiPackage, t: 'Pack-based ordering', d: 'Order by the pack with low minimums — mix sizes within each style.' },
  { icon: FiFileText, t: 'GST invoicing & credit', d: 'Proper GST invoices and credit terms for established partners.' },
  { icon: FiTruck, t: 'Fast dispatch', d: 'Priority fulfilment and tracking on every wholesale order.' },
];

const STEPS = [
  ['01', 'Apply', 'Tell us about your store and what you’d like to stock.'],
  ['02', 'Get approved', 'We verify your business — usually within two working days.'],
  ['03', 'Order at trade prices', 'Log in and wholesale pricing shows across the whole catalogue.'],
];

export default function Wholesale() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city: '', gst: '', message: '', website: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      topic: 'Wholesale account application',
      website: form.website,
      message: `Business: ${form.company}\nCity: ${form.city}\nGST: ${form.gst || '—'}\n\n${form.message}`,
    };
    try {
      const { data } = await api.post('/api/v1/contact_enquiry', payload);
      if (data?.status) {
        toast.success('Application received — we’ll be in touch within two working days.');
        setForm({ name: '', email: '', phone: '', company: '', city: '', gst: '', message: '', website: '' });
      } else toast.error(data?.message || 'Please check the form and try again.');
    } catch {
      toast.error('Could not submit. Please email us instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Wholesale & Trade" description="Stock Dorjee Fashion Factory in your store. Trade pricing, pack ordering and GST invoicing for approved partners." />

      {/* Hero */}
      <section className="relative">
        <div className="card-media h-[44vh] min-h-[320px]">
          <img src={mediaUrl('/banners/hero-3.svg')} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper/70 to-transparent" />
        </div>
        <div className="wrap relative -mt-28 pb-2">
          <div className="max-w-xl bg-paper p-8 md:p-12">
            <p className="eyebrow">For stores & stockists</p>
            <h1 className="display-lg mt-3 font-display text-balance">Stock Dorjee in your store.</h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Partner with us to carry a quiet, well-made collection your customers will return for. Trade pricing,
              low minimums and a dedicated account.
            </p>
            <a href="#apply" className="btn-ink mt-6">Apply for trade access</a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="wrap grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.t} className="border-t border-ink pt-5">
            <b.icon size={22} className="text-brand-600" />
            <h3 className="mt-3 font-display text-lg">{b.t}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{b.d}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-2">
        <div className="wrap grid gap-8 py-16 md:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <div key={n}>
              <span className="font-display text-4xl text-brand-500">{n}</span>
              <h3 className="mt-3 font-display text-xl">{t}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="wrap grid gap-12 py-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">Apply</p>
          <h2 className="display-md mt-3 font-display">Open a wholesale account</h2>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Tell us a little about your business. Approved partners receive login details and a line sheet with trade
            pricing.
          </p>
          <ul className="mt-6 space-y-2">
            {['No membership fees', 'Mix sizes within a pack', 'Reorder in a few clicks'].map((p) => (
              <li key={p} className="flex items-center gap-2 text-[14px] text-ink-soft"><FiCheck className="text-brand-600" /> {p}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="border border-line bg-paper-2 p-7">
          <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden />
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Your name</label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="field-label">Business name</label><input className="field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required /></div>
            <div><label className="field-label">Email</label><input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="field-label">Phone</label><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div><label className="field-label">City</label><input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
            <div><label className="field-label">GST number (optional)</label><input className="field" value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} /></div>
          </div>
          <div className="mt-4">
            <label className="field-label">Tell us about your store</label>
            <textarea rows={4} className="field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Where you sell, what you stock, expected volumes…" required />
          </div>
          <button disabled={loading} className="btn-ink btn-block mt-5">{loading ? 'Submitting…' : 'Submit application'}</button>
        </form>
      </section>
    </>
  );
}
