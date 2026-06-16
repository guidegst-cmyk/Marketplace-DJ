import { createClient } from '@/lib/supabase/server';
import { getActiveCategories, getVendors } from '@/lib/data';
import VendorFilters from '@/components/VendorFilters';
import VendorCard from '@/components/VendorCard';

export const metadata = {
  title: 'Vendors — XYZ Marketplace',
  description: 'Browse our network of 50 electronics & audio equipment vendors.',
};

type SearchParams = {
  category?: string;
  q?: string;
};

export default async function VendorsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient();

  const [categories, vendors] = await Promise.all([
    getActiveCategories(supabase),
    getVendors(supabase, { categorySlug: searchParams.category, search: searchParams.q }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <span className="ch-tag">Directory</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
          Vendors
        </h1>
      </div>

      <div className="mb-6">
        <VendorFilters categories={categories} current={{ q: searchParams.q, category: searchParams.category }} />
      </div>

      {vendors.length === 0 ? (
        <div className="border border-line rounded bg-white p-10 text-center">
          <p className="font-display font-bold text-ink mb-1">No vendors found</p>
          <p className="text-sm text-muted">
            Try clearing filters or searching with a different term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      )}
    </div>
  );
}
