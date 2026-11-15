import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { mediaUrl } from '../../lib/media';
import { categoryPath } from '../../lib/links';

export default function MegaMenu({ node, onNavigate }) {
  if (!node) return null;
  const children = node.children || [];
  const feature = children.find((c) => c.cat_img) || node;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full border-y border-line bg-paper shadow-[0_24px_40px_-30px_rgba(0,0,0,0.35)]"
    >
      <div className="wrap grid grid-cols-[1fr_1fr_1.1fr] gap-10 py-10">
        <div>
          <p className="eyebrow mb-4">Shop {node.category_name}</p>
          <ul className="space-y-2.5">
            <li>
              <Link to={categoryPath(node.slug)} onClick={onNavigate} className="text-[15px] font-medium text-ink link-underline">
                View all {node.category_name}
              </Link>
            </li>
            {children.map((c) => (
              <li key={c.id}>
                <Link to={categoryPath(c.slug)} onClick={onNavigate} className="text-[15px] text-ink-soft transition-colors hover:text-ink">
                  {c.category_name}
                  {c.product_count > 0 && <span className="ml-1 text-[12px] text-ink-muted">({c.product_count})</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Featured</p>
          <ul className="space-y-2.5">
            <li><Link to="/shop?tag=New%20In" onClick={onNavigate} className="text-[15px] text-ink-soft hover:text-ink">New In</Link></li>
            <li><Link to="/shop?tag=The%20Linen%20Edit" onClick={onNavigate} className="text-[15px] text-ink-soft hover:text-ink">The Linen Edit</Link></li>
            <li><Link to="/shop?sort=price-asc" onClick={onNavigate} className="text-[15px] text-ink-soft hover:text-ink">Under ₹2,500</Link></li>
            <li><Link to="/wholesale" onClick={onNavigate} className="text-[15px] text-ink-soft hover:text-ink">Wholesale / Trade</Link></li>
          </ul>
        </div>

        <Link to={categoryPath(node.slug)} onClick={onNavigate} className="group relative block">
          <div className="card-media aspect-[16/10]">
            <img src={mediaUrl(feature.cat_img)} alt={node.category_name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-label">
            Explore {node.category_name} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
