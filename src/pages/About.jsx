import { Link } from 'react-router-dom';
import { mediaUrl } from '../lib/media';
import Seo from '../components/Seo';

const VALUES = [
  { t: 'Natural fibres', d: 'Linen, cotton, merino and lambswool — materials that breathe, age gracefully and feel good against the skin.' },
  { t: 'Small-batch making', d: 'We produce in limited runs with partners we know by name, so quality is checked by people, not spreadsheets.' },
  { t: 'Designed to last', d: 'Quiet silhouettes and honest construction — clothes you keep and re-wear, not replace each season.' },
];

export default function About() {
  return (
    <>
      <Seo title="Our story" />
      <section className="relative">
        <div className="card-media h-[46vh] min-h-[320px]">
          <img src={mediaUrl('/banners/hero-2.svg')} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
        </div>
        <div className="wrap relative -mt-24 pb-4">
          <div className="max-w-2xl bg-paper p-8 md:p-12">
            <p className="eyebrow">Our story</p>
            <h1 className="display-lg mt-3 font-display text-balance">Quiet, useful clothes — made to be kept.</h1>
          </div>
        </div>
      </section>

      <section className="wrap max-w-2xl py-6">
        <p className="text-[17px] leading-relaxed text-ink-soft">
          Dorjee Fashion Factory began with a simple frustration: too many clothes that looked good on a rail and fell apart in a
          season. We set out to make the opposite — a tight wardrobe of considered pieces in natural fibres, cut
          cleanly, priced honestly, and built to be worn for years.
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          Designed in Kolkata and made in India, every style is produced in small batches with makers we work with
          directly. We sell to you, and to the boutiques and stores that share the same belief in fewer, better things.
        </p>
      </section>

      <section className="wrap grid gap-6 py-10 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.t} className="border-t border-ink pt-5">
            <h3 className="font-display text-xl">{v.t}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="wrap py-12">
        <div className="bg-ink px-8 py-14 text-center text-paper md:py-20">
          <h2 className="display-md font-display text-paper">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-paper/75">Shop the collection, or open a wholesale account to stock Dorjee.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/shop" className="btn bg-paper text-ink hover:bg-paper-2">Shop now</Link>
            <Link to="/wholesale" className="btn border border-paper/40 text-paper hover:bg-paper hover:text-ink">Wholesale</Link>
          </div>
        </div>
      </section>
    </>
  );
}
