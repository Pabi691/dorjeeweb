import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { mediaUrl } from '../../lib/media';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const SLIDES = [
  {
    img: '/img/banner-1.jpg',
    eyebrow: 'New Season',
    title: 'The Linen Edit',
    body: 'Breathable, fluid pieces cut from pure European linen — for long days and warm evenings.',
    primary: { label: 'Shop the edit', to: '/shop?tag=The%20Linen%20Edit' },
    secondary: { label: 'Shop all', to: '/shop' },
  },
  {
    img: '/img/banner-2.jpg',
    eyebrow: 'Considered essentials',
    title: 'Made to be worn for years',
    body: 'Natural fibres, quiet design and honest prices. The clothes you reach for first.',
    primary: { label: 'Shop Women', to: '/shop/women' },
    secondary: { label: 'Shop Men', to: '/shop/men' },
  },
  {
    img: '/img/banner-3.jpg',
    eyebrow: 'Retail & Trade',
    title: 'Now open to wholesale',
    body: 'Stock Dorjee in your store with trade pricing, low minimums and fast dispatch.',
    primary: { label: 'Open a trade account', to: '/wholesale' },
    secondary: { label: 'Learn more', to: '/wholesale' },
  },
];

export default function Hero() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={900}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
              <img src={mediaUrl(s.img)} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/70 via-transparent to-transparent" />
              <div className="wrap relative flex h-full items-end pb-20">
                <div className="max-w-xl animate-fade-up">
                  <p className="eyebrow">{s.eyebrow}</p>
                  <h1 className="display-xl mt-4 font-display text-ink text-balance">{s.title}</h1>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">{s.body}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to={s.primary.to} className="btn-ink">{s.primary.label}</Link>
                    <Link to={s.secondary.to} className="btn-outline">{s.secondary.label}</Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-swiper .swiper-pagination { bottom: 22px !important; text-align: left; padding-left: max(1.25rem, calc((100vw - 1440px)/2 + 3rem)); }
        .hero-swiper .swiper-pagination-bullet { width: 28px; height: 2px; border-radius: 0; background: #1C1B19; opacity: 0.25; transition: opacity .3s; }
        .hero-swiper .swiper-pagination-bullet-active { opacity: 1; }
      `}</style>
    </section>
  );
}
