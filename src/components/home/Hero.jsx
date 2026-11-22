import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { mediaUrl } from '../../lib/media';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// `pos` = object-position for each photo so the model stays framed (the image
// panel is tall/portrait, so the full height always shows — this only picks the
// horizontal slice, keeping heads in view at every size).
const SLIDES = [
  {
    img: '/img/banner-1.jpg',
    pos: '70% 40%',
    eyebrow: 'New Season',
    title: 'The Linen Edit',
    body: 'Breathable, fluid pieces cut from pure European linen — for long days and warm evenings.',
    primary: { label: 'Shop the edit', to: '/shop?tag=The%20Linen%20Edit' },
    secondary: { label: 'Shop all', to: '/shop' },
  },
  {
    img: '/img/banner-2.jpg',
    pos: '58% 35%',
    eyebrow: 'Considered essentials',
    title: 'Made to be worn for years',
    body: 'Natural fibres, quiet design and honest prices. The clothes you reach for first.',
    primary: { label: 'Shop Women', to: '/shop/women' },
    secondary: { label: 'Shop Men', to: '/shop/men' },
  },
  {
    img: '/img/banner-3.jpg',
    pos: '60% 35%',
    eyebrow: 'Retail & Trade',
    title: 'Now open to wholesale',
    body: 'Stock Dorjee in your store with trade pricing, low minimums and fast dispatch.',
    primary: { label: 'Open a trade account', to: '/wholesale' },
    secondary: { label: 'Learn more', to: '/wholesale' },
  },
];

export default function Hero() {
  return (
    <section className="relative border-b border-line">
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
            <div className="grid lg:h-[84vh] lg:min-h-[560px] lg:grid-cols-[1fr_1.08fr]">
              {/* Image panel */}
              <div className="relative order-1 h-[54vh] min-h-[330px] sm:h-[60vh] lg:order-2 lg:h-auto">
                <img
                  src={mediaUrl(s.img)}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: s.pos }}
                />
                {/* soften the seam into the text panel */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent lg:hidden" />
                <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-paper/80 to-transparent lg:block" />
              </div>
              {/* Copy panel */}
              <div className="order-2 flex items-center bg-paper lg:order-1">
                <div className="hero-copy animate-fade-up">
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
        .hero-copy{ width:100%; max-width:36rem; margin-inline:auto; padding:2.5rem 1.5rem 3.25rem; }
        @media (min-width:1024px){
          .hero-copy{ margin-right:0; padding:4rem 3rem 4rem max(1.5rem, calc((100vw - 1440px)/2 + 3rem)); }
        }
        .hero-swiper .swiper-pagination{ bottom:12px !important; text-align:center; }
        @media (min-width:1024px){
          .hero-swiper .swiper-pagination{ text-align:left; bottom:26px !important;
            padding-left: max(1.5rem, calc((100vw - 1440px)/2 + 3rem)); }
        }
        .hero-swiper .swiper-pagination-bullet{ width:28px; height:2px; border-radius:0; background:#1C1B19; opacity:.25; transition:opacity .3s; }
        .hero-swiper .swiper-pagination-bullet-active{ opacity:1; }
      `}</style>
    </section>
  );
}
