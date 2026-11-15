import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import AuthShell from './AuthShell';

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', mobile_no: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Use at least 6 characters for your password.');
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/webuser/sign_up', form);
      if (data?.status && data.user_token) {
        const u = data.user_data || {};
        localStorage.setItem('role', u.role || 'customer');
        localStorage.setItem('username', u.name || form.name);
        localStorage.setItem('useremail', u.email || form.username);
        localStorage.setItem('uservarified', u.email_verified_at ? '1' : '0');
        setToken(data.user_token);
        toast.success('Account created — welcome to Dorjee Fashion Factory');
        navigate('/account');
      } else {
        toast.error(data?.message || 'Could not create your account.');
      }
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not create your account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Create account" />
      <AuthShell eyebrow="Account" title="Create your account" intro="One account for orders, returns, wishlist and faster checkout." image="/category-images/men.svg">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="field-label">Full name</label>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="email" required />
          </div>
          <div>
            <label className="field-label">Mobile (optional)</label>
            <input className="field" value={form.mobile_no} onChange={(e) => setForm({ ...form, mobile_no: e.target.value })} autoComplete="tel" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" required />
          </div>
          <button disabled={loading} className="btn-ink btn-block">{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-[14px] text-ink-soft">
          Already have an account? <Link to="/login" className="font-medium text-ink link-underline">Sign in</Link>
        </p>
      </AuthShell>
    </>
  );
}
