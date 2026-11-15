import { SITE } from '../../config/site';

export default function Promises() {
  return (
    <section className="border-y border-line bg-paper-2">
      <div className="wrap grid grid-cols-2 divide-x divide-line md:grid-cols-4">
        {SITE.promises.map((p, i) => (
          <div key={i} className={`px-4 py-8 text-center ${i >= 2 ? 'border-t border-line md:border-t-0' : ''}`}>
            <p className="font-display text-lg text-ink">{p.title}</p>
            <p className="mx-auto mt-1 max-w-[220px] text-[12.5px] leading-relaxed text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
