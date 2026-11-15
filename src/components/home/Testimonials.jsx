import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Stars from '../ui/Stars';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_gmb_reviews')
      .then(({ data }) => {
        const list = data?.reviews || data?.data || [];
        if (alive && Array.isArray(list)) setReviews(list.slice(0, 3));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="wrap">
      <div className="mb-10 text-center">
        <p className="eyebrow">Kind words</p>
        <h2 className="display-md mt-2 font-display">Loved by the people who wear it</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <figure key={i} className="flex flex-col border border-line bg-paper-2 p-8">
            <Stars value={r.rating || 5} />
            <blockquote className="mt-4 flex-1 font-display text-[19px] leading-relaxed text-ink">“{r.review_text}”</blockquote>
            <figcaption className="mt-5 text-[13px] font-medium uppercase tracking-label text-ink-muted">
              {r.reviewer_name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
