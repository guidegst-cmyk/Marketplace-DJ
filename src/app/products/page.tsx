import { createClient } from '@/lib/supabase/server';
import { getActiveCategories, getProducts, getSettings } from '@/lib/data';
import ProductFilters from '@/components/ProductFilters';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

export const metadata = {
  title: 'Products — XYZ Marketplace',
  description: 'Browse amplifiers, speakers and audio equipment. Filter by category or vendor.',
};

type SearchParams = {
  category?: string;
  vendor?: string;
  q?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [settings, categories, vendorsRes, { products, total, pageSize }] = await Promise.all([
    getSettings(supabase),
    getActiveCategories(supabase),
    supabase.from('vendors').select('id, name').eq('active', true).order('name'),
    getProducts(supabase, {
      categorySlug: searchParams.category,
      vendorId: searchParams.vendor,
      search: searchParams.q,
      page,
    }),
  ]);

  const vendors = vendorsRes.data || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <span className="ch-tag">Catalog</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
          Products
        </h1>
      </div>

      <div className="mb-6">
        <ProductFilters
          categories={categories}
          vendors={vendors}
          current={{ q: searchParams.q, category: searchParams.category, vendor: searchParams.vendor }}
        />
      </div>

      {products.length === 0 ? (
        <div className="border border-line rounded bg-white p-10 text-center">
          <p className="font-display font-bold text-ink mb-1">No products found</p>
          <p className="text-sm text-muted">
            Try clearing filters or searching with a different term.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            searchParams={searchParams}
            basePath="/products"
          />
        </>
      )}
    </div>
  );
}
