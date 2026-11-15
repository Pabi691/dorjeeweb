import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import AuthShell from './AuthShell';

function persistSession(user) {
  localStorage.setItem('role', user.role || 'customer');
  localStorage.setItem('username', user.name || '');
  localStorage.setItem('useremail', user.email || '');
  localStorage.setItem('uservarified', user.email_verified_at ? '1' : '0');
}

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const msg = localStorage.getItem('loginMessage');
    if (msg) { toast.info(msg); localStorage.removeItem('loginMessage'); }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/webuser/login', form);
      if (data?.status && data.user_token) {
        persistSession(data.user_data || {});
        setToken(data.user_token);
        toast.success('Welcome back');
        navigate('/account');
      } else {
        toast.error(data?.error_message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not sign you in.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Sign in" />
      <AuthShell eyebrow="Account" title="Welcome back" intro="Sign in to track orders, save pieces and check out faster.">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="field-label">Email or mobile</label>
            <input className="field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="field-label">Password</label>
              <Link to="/contact" className="mb-1.5 text-[11px] text-ink-muted underline">Forgot?</Link>
            </div>
            <input type="password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required />
          </div>
          <button disabled={loading} className="btn-ink btn-block">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-[14px] text-ink-soft">
          New to Dorjee? <Link to="/register" className="font-medium text-ink link-underline">Create an account</Link>
        </p>
        <p className="mt-4 text-[13px] text-ink-muted">
          Trade buyer? <Link to="/wholesale" className="underline">Apply for a wholesale account</Link>.
        </p>
      </AuthShell>
    </>
  );
}
