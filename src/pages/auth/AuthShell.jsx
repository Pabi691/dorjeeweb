import { Link } from 'react-router-dom';
import { mediaUrl } from '../../lib/media';

export default function AuthShell({ eyebrow, title, intro, children, image = '/category-images/women.svg' }) {
  return (
    <div className="grid min-h-[calc(100vh-6.25rem)] lg:grid-cols-2">
      <div className="hidden bg-paper-2 lg:block">
        <div className="relative h-full">
          <img src={mediaUrl(image)} alt="" className="h-full w-full object-cover" />
          <Link to="/" className="absolute left-10 top-10"><img src="/brand/logo.png" alt="Dorjee Fashion Factory" className="h-14 w-auto" /></Link>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 inline-block lg:hidden"><img src="/brand/logo.png" alt="Dorjee Fashion Factory" className="h-12 w-auto" /></Link>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-md mt-3 font-display">{title}</h1>
          {intro && <p className="mt-2 text-[15px] text-ink-soft">{intro}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
