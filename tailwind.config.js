/** @type {import('tailwindcss').Config} */
const brand = (shade) => `rgb(var(--brand-${shade}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm editorial neutrals — the premium-contemporary ground.
        paper: { DEFAULT: '#F4F1EA', 2: '#EDE8DD', 3: '#E4DED0' },
        ink: { DEFAULT: '#1C1B19', soft: '#4A463F', muted: '#8C8577' },
        line: { DEFAULT: '#E3DCCD', strong: '#D2C9B6' },
        sale: '#C62828',
        success: '#2F6B4F',
        // Dynamic brand accent, derived from one hex in the CRM (lib/theme.js).
        brand: {
          50: brand(50), 100: brand(100), 200: brand(200), 300: brand(300), 400: brand(400),
          500: brand(500), 600: brand(600), 700: brand(700), 800: brand(800), 900: brand(900),
          950: brand(950), DEFAULT: brand(500), on: 'rgb(var(--brand-on) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.18em',
        wide2: '0.28em',
      },
      maxWidth: {
        site: '1440px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
