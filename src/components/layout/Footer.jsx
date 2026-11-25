import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { SITE, FOOTER_LINKS } from '../../config/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.error('Please enter a valid email.');
    toast.success('Thanks — you are on the list.');
    setEmail('');
  };

  return (
    <footer className="mt-24 border-t border-line bg-paper-2">
      {/* Newsletter */}
      <div className="border-b border-line">
        <div className="wrap grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">The Dorjee Letter</p>
            <h2 className="display-md mt-3 font-display">Early access to new edits.</h2>
            <p className="mt-2 max-w-md text-[15px] text-ink-soft">
              Collection drops, restocks and the occasional note from the studio. No noise.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex items-stretch border-b border-ink/30 md:ml-auto md:max-w-md md:w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent px-1 py-3 text-[15px] placeholder:text-ink-muted focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 px-2 text-[12px] font-medium uppercase tracking-label">
              Join <FiArrowRight />
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="inline-block" aria-label="Dorjee Fashion Factory — home">
            <img src="/brand/logo.png" alt="Dorjee Fashion Factory" className="h-16 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-soft">{SITE.footerNote}</p>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[13px] text-ink-soft link-underline"
          >
            <FiInstagram /> Instagram
          </a>
        </div>
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <nav key={heading}>
            <p className="eyebrow mb-4">{heading}</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[14px] text-ink-soft transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-6 text-[12px] text-ink-muted sm:flex-row">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>{SITE.address}</p>
        </div>
      </div>
    </footer>
  );
}
