import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <div className="wrap flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-display text-7xl text-brand-500">404</p>
        <h1 className="display-md mt-4 font-display">This page has wandered off</h1>
        <p className="mt-3 text-[15px] text-ink-soft">The page you're after doesn't exist or has moved.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="btn-ink">Back home</Link>
          <Link to="/shop" className="btn-outline">Shop the collection</Link>
        </div>
      </div>
    </>
  );
}
