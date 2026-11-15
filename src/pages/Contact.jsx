import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../lib/api';
import Seo from '../components/Seo';
import { SITE } from '../config/site';

const TOPICS = ['Order & delivery', 'Returns & exchange', 'Product & sizing', 'Wholesale', 'Something else'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: TOPICS[0], message: '', website: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/contact_enquiry', form);
      if (data?.status) {
        toast.success(data.message || 'Thanks — we’ll be in touch.');
        setForm({ name: '', email: '', phone: '', topic: TOPICS[0], message: '', website: '' });
      } else {
        toast.error(data?.message || 'Please check the form and try again.');
      }
    } catch {
      toast.error('Could not send your message. Please WhatsApp us instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Contact" />
      <div className="border-b border-line bg-paper-2">
        <div className="wrap py-14">
          <p className="eyebrow">We’re here to help</p>
          <h1 className="display-lg mt-3 font-display">Get in touch</h1>
        </div>
      </div>

      <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="order-2 lg:order-1">
          <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Phone (optional)</label>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Topic</label>
              <select className="field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5">
            <label className="field-label">Message</label>
            <textarea rows={6} className="field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button disabled={loading} className="btn-ink mt-6">{loading ? 'Sending…' : 'Send message'}</button>
        </form>

        <aside className="order-1 space-y-6 lg:order-2">
          <div className="border border-line bg-paper-2 p-7">
            <h2 className="text-[13px] font-medium uppercase tracking-label">Studio</h2>
            <ul className="mt-5 space-y-4 text-[14.5px] text-ink-soft">
              <li className="flex items-start gap-3"><FiMail className="mt-0.5" /> <a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a></li>
              <li className="flex items-start gap-3"><FiPhone className="mt-0.5" /> {SITE.phone}</li>
              <li className="flex items-start gap-3"><FiMessageCircle className="mt-0.5" /> <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="link-underline">WhatsApp us</a></li>
              <li className="flex items-start gap-3"><FiMapPin className="mt-0.5" /> {SITE.address}</li>
            </ul>
          </div>
          <div className="border border-line p-7">
            <h2 className="text-[13px] font-medium uppercase tracking-label">Hours</h2>
            <p className="mt-4 text-[14.5px] text-ink-soft">Mon–Sat, 10am–7pm IST. We reply to most messages within one business day.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
