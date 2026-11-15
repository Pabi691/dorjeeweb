import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function SectionHeader({ eyebrow, title, to, linkLabel = 'View all', align = 'between' }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end gap-3 ${align === 'center' ? 'flex-col text-center' : 'justify-between'}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="display-md mt-2 font-display">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-label">
          {linkLabel} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
