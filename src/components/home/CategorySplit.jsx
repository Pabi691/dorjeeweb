import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';
import { mediaUrl } from '../../lib/media';
import { categoryPath } from '../../lib/links';

export default function CategorySplit() {
  const { categoryTree } = useGlobal();
  const tiles = categoryTree.filter((c) => ['women', 'men'].includes(c.slug)).slice(0, 2);
  if (tiles.length < 1) return null;

  return (
    <section className="wrap">
      <div className="grid gap-5 md:grid-cols-2">
        {tiles.map((c) => (
          <Link key={c.id} to={categoryPath(c.slug)} className="group relative block overflow-hidden">
            <div className="card-media aspect-[4/5] md:aspect-[5/6]">
              <img
                src={mediaUrl(c.cat_img)}
                alt={c.category_name}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-7 text-paper">
              <h3 className="display-md font-display">{c.category_name}</h3>
              <span className="mt-2 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-label">
                Shop now <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
