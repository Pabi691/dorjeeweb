import { useSearchParams } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import { searchProducts } from '../lib/search';
import Seo from '../components/Seo';
import ProductGrid from '../components/product/ProductGrid';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { products, productsLoading } = useGlobal();
  const results = searchProducts(products, q);

  return (
    <>
      <Seo title={q ? `Search: ${q}` : 'Search'} />
      <div className="wrap py-10">
        <p className="eyebrow">Search results</p>
        <h1 className="display-lg mt-2 font-display">“{q}”</h1>
        <p className="mt-2 text-[14px] text-ink-muted">{results.length} {results.length === 1 ? 'piece' : 'pieces'} found</p>

        <div className="mt-10">
          {results.length === 0 && !productsLoading ? (
            <p className="py-16 text-center text-[15px] text-ink-soft">No pieces match your search. Try a different term.</p>
          ) : (
            <ProductGrid products={results} loading={productsLoading && !results.length} skeletonCount={8} />
          )}
        </div>
      </div>
    </>
  );
}
