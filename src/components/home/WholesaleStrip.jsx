import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const POINTS = ['Trade pricing & volume packs', 'Low minimums, fast dispatch', 'GST invoicing & credit terms'];

export default function WholesaleStrip() {
  return (
    <section className="wrap">
      <div className="relative overflow-hidden bg-ink px-8 py-14 text-paper md:px-16 md:py-20">
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <p className="eyebrow text-paper/60">For stores & stockists</p>
            <h2 className="display-lg mt-4 font-display text-paper">Open a wholesale account.</h2>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-paper/75">
              Stock Dorjee in your boutique or online store. Trade partners get wholesale pricing, pack-based
              ordering and a dedicated account — applied automatically at checkout once approved.
            </p>
            <ul className="mt-6 space-y-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[14px] text-paper/85">
                  <FiCheck className="text-brand-400" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:justify-self-end">
            <Link to="/wholesale" className="btn bg-paper text-ink hover:bg-paper-2">
              Apply for trade access <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
