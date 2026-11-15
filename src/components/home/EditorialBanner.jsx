import { Link } from 'react-router-dom';
import { mediaUrl } from '../../lib/media';

export default function EditorialBanner() {
  return (
    <section className="wrap">
      <div className="grid items-stretch overflow-hidden border border-line md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-paper-2 p-10 md:order-1 md:p-16">
          <p className="eyebrow">Our making</p>
          <h2 className="display-lg mt-4 font-display text-balance">Fewer, better things.</h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
            We design in small batches with partners we know by name, choosing natural fibres that age well
            and patterns that stay out of the way. The result is a wardrobe of quiet, useful clothes — made to
            be kept, not replaced.
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-outline">Read our story</Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="card-media h-72 md:h-full">
            <img src={mediaUrl('/category-images/coats.svg')} alt="Dorjee making" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
