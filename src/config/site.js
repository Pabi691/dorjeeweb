// All Dorjee Fashion Factory brand copy in one place. Swap freely — nothing else hardcodes it.
export const SITE = {
  name: 'Dorjee Fashion Factory',
  shortName: 'Dorjee',
  tagline: 'Well-made clothing, factory-direct.',
  description:
    'Dorjee Fashion Factory — considered, well-made essentials and seasonal edits in natural fibres, made in our own Kolkata factory. For retail and wholesale.',
  email: 'dorjeefashionfactory@gmail.com',
  phone: '+91 91638 06873',
  whatsapp: '919163806873',
  address: 'B-8/19 Diamond Park Joka, LP 218/4/9/1/2/12, Kolkata 700104',
  instagram: 'https://www.instagram.com/dorjee_fashion_factory',
  social: {
    instagram: 'https://www.instagram.com/dorjee_fashion_factory',
    pinterest: 'https://pinterest.com',
    facebook: 'https://facebook.com',
  },

  // Rotating announcement bar.
  announcements: [
    'Complimentary shipping on orders over ₹2,500',
    'Factory-direct prices — straight from our Kolkata workshop',
    'Wholesale & bulk orders welcome',
  ],

  // Promise strip under the hero.
  promises: [
    { title: 'Made in our factory', body: 'Cut and stitched in our own Kolkata workshop — no middlemen.' },
    { title: 'Natural fibres', body: 'Linen, cotton, merino & lambswool — chosen to wear for years.' },
    { title: 'Easy returns', body: '15-day returns and exchanges on unworn pieces.' },
    { title: 'Retail & wholesale', body: 'Shop a single piece, or open a wholesale account.' },
  ],

  footerNote:
    'Dorjee Fashion Factory is a Kolkata clothing house — quiet, useful clothes in natural fibres, made in our own factory for retail and wholesale.',
};

// Primary navigation. `to` opens a route; `mega: true` opens the category menu.
export const NAV = [
  { label: 'New In', to: '/shop?tag=New%20In' },
  { label: 'Women', slug: 'women', mega: true },
  { label: 'Men', slug: 'men', mega: true },
  { label: 'The Linen Edit', to: '/shop?tag=The%20Linen%20Edit' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'About', to: '/about' },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: 'New In', to: '/shop?tag=New%20In' },
    { label: 'Women', to: '/shop/women' },
    { label: 'Men', to: '/shop/men' },
    { label: 'The Linen Edit', to: '/shop?tag=The%20Linen%20Edit' },
    { label: 'All products', to: '/shop' },
  ],
  Help: [
    { label: 'Contact', to: '/contact' },
    { label: 'Shipping', to: '/shipping-policy' },
    { label: 'Returns & exchanges', to: '/return-policy' },
    { label: 'Size guide', to: '/size-guide' },
    { label: 'FAQ', to: '/faq' },
  ],
  Company: [
    { label: 'Our story', to: '/about' },
    { label: 'Wholesale', to: '/wholesale' },
    { label: 'Privacy policy', to: '/privacy-policy' },
    { label: 'Terms', to: '/terms-and-conditions' },
  ],
};
