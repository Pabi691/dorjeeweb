import { useGlobal } from '../context/GlobalContext';
import Seo from '../components/Seo';
import Hero from '../components/home/Hero';
import Promises from '../components/home/Promises';
import SectionHeader from '../components/home/SectionHeader';
import CategorySplit from '../components/home/CategorySplit';
import EditorialBanner from '../components/home/EditorialBanner';
import WholesaleStrip from '../components/home/WholesaleStrip';
import Testimonials from '../components/home/Testimonials';
import ProductGrid from '../components/product/ProductGrid';

function byTag(products, tag) {
  return products.filter((p) => (p.product_tag || '').toLowerCase() === tag.toLowerCase());
}

export default function Home() {
  const { products, productsLoading } = useGlobal();

  const newIn = (byTag(products, 'New In').length ? byTag(products, 'New In') : products).slice(0, 4);
  const linen = byTag(products, 'The Linen Edit').slice(0, 4);

  return (
    <>
      <Seo />
      <Hero />
      <Promises />

      <section className="wrap mt-20">
        <SectionHeader eyebrow="Just landed" title="New In" to="/shop?tag=New%20In" />
        <ProductGrid products={newIn} loading={productsLoading} skeletonCount={4} eagerCount={4} />
      </section>

      <div className="mt-20">
        <CategorySplit />
      </div>

      {(productsLoading || linen.length > 0) && (
        <section className="wrap mt-20">
          <SectionHeader eyebrow="Natural fibres" title="The Linen Edit" to="/shop?tag=The%20Linen%20Edit" />
          <ProductGrid products={linen} loading={productsLoading && !linen.length} skeletonCount={4} />
        </section>
      )}

      <div className="mt-20">
        <EditorialBanner />
      </div>

      <div className="mt-20">
        <WholesaleStrip />
      </div>

      <div className="mt-24">
        <Testimonials />
      </div>
    </>
  );
}
