import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import Seo from '../components/Seo';

// Sensible defaults so policy pages are never blank before the CRM fills them.
const DEFAULTS = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: 'We collect only what we need to process your orders and improve your experience — your name, contact details, addresses and order history. We never sell your data. You can request a copy or deletion of your data at any time by contacting us.',
  },
  'return-policy': {
    title: 'Returns & Exchanges',
    body: 'Unworn pieces with tags attached can be returned or exchanged within 15 days of delivery. Start a return from your account or message us, and we’ll arrange a pickup. Refunds are issued to your original payment method or bank account within 5–7 business days of the item passing inspection.',
  },
  'shipping-policy': {
    title: 'Shipping',
    body: 'Orders are dispatched within 1–2 business days. Complimentary shipping on orders over ₹2,500; a flat ₹40 applies to smaller interstate orders. You’ll receive tracking by email and WhatsApp as soon as your order ships.',
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    body: 'By using this site you agree to our terms of sale. Prices are in INR and inclusive of GST. We reserve the right to cancel orders in case of pricing errors or stock issues, with a full refund. Images are representative; natural fibres may vary slightly in tone.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    body: 'How do I choose a size? See the size guide on each product page.\n\nDo you ship pan-India? Yes, across India.\n\nCan I change my order? Contact us within 24 hours of placing it.\n\nDo you offer wholesale? Yes — apply for a trade account from the Wholesale page.',
  },
  'size-guide': {
    title: 'Size Guide',
    body: 'Womenswear (inches) — Bust / Waist / Hip: XS 32/25/35 · S 34/27/37 · M 36/29/39 · L 38/31/41 · XL 40/33/43.\n\nMenswear (inches) — Chest / Waist: S 38/32 · M 40/34 · L 42/36 · XL 44/38 · XXL 46/40.\n\nOur fits run slightly relaxed — size down for a sharper silhouette.',
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/api/v1/get_slug_data/${slug}`)
      .then(({ data }) => { if (alive && data?.pageData) setPage(data.pageData); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  const fallback = DEFAULTS[slug];
  const title = page?.title || fallback?.title || slug?.replace(/-/g, ' ');
  const content = (page?.content && page.content.trim()) || fallback?.body || 'This page is being updated. Please check back soon.';

  if (loading && !fallback) return <div className="wrap py-24"><div className="skeleton h-80" /></div>;

  return (
    <>
      <Seo title={title} />
      <div className="border-b border-line bg-paper-2">
        <div className="wrap py-14">
          <p className="eyebrow">Dorjee Fashion Factory</p>
          <h1 className="display-lg mt-3 font-display capitalize">{title}</h1>
        </div>
      </div>
      <article className="wrap max-w-2xl py-14">
        {content.includes('<') ? (
          <div className="prose-vestra space-y-4 text-[16px] leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 whitespace-pre-line text-[16px] leading-relaxed text-ink-soft">{para}</p>
          ))
        )}
      </article>
    </>
  );
}
