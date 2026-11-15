import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiUser, FiHeart } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';
import { categoryPath } from '../../lib/links';
import { SITE } from '../../config/site';
import Drawer from '../ui/Drawer';

export default function MobileMenu({ open, onClose }) {
  const { categoryTree } = useGlobal();
  const [expanded, setExpanded] = useState(null);

  const link = 'block py-3 text-[17px] text-ink';

  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu" width="max-w-[360px]">
      <nav className="px-6 py-2">
        <Link to="/shop?tag=New%20In" onClick={onClose} className={link}>New In</Link>

        {categoryTree.map((node) => (
          <div key={node.id} className="border-t border-line">
            <button
              onClick={() => setExpanded(expanded === node.id ? null : node.id)}
              className="flex w-full items-center justify-between py-3 text-[17px] text-ink"
            >
              {node.category_name}
              <FiChevronDown className={`transition-transform ${expanded === node.id ? 'rotate-180' : ''}`} />
            </button>
            {expanded === node.id && (
              <div className="pb-2">
                <Link to={categoryPath(node.slug)} onClick={onClose} className="block py-2 text-[15px] font-medium text-ink">
                  View all {node.category_name}
                </Link>
                {(node.children || []).map((c) => (
                  <Link key={c.id} to={categoryPath(c.slug)} onClick={onClose} className="block py-2 text-[15px] text-ink-soft">
                    {c.category_name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-line">
          <Link to="/shop?tag=The%20Linen%20Edit" onClick={onClose} className={link}>The Linen Edit</Link>
        </div>
        <div className="border-t border-line">
          <Link to="/wholesale" onClick={onClose} className={link}>Wholesale</Link>
        </div>
        <div className="border-t border-line">
          <Link to="/about" onClick={onClose} className={link}>About</Link>
        </div>

        <div className="mt-6 flex gap-3 border-t border-line pt-6">
          <Link to="/account" onClick={onClose} className="btn-outline btn-sm flex-1"><FiUser size={15} /> Account</Link>
          <Link to="/wishlist" onClick={onClose} className="btn-outline btn-sm flex-1"><FiHeart size={15} /> Wishlist</Link>
        </div>
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="mt-4 block text-[13px] text-ink-muted">
          Need help? Message us
        </a>
      </nav>
    </Drawer>
  );
}
