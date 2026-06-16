import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getActiveCategories } from '@/lib/data';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [vendorCount, productCount, categories, productCategoryRows] = await Promise.all([
    supabase.from('vendors').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    getActiveCategories(supabase),
    supabase.from('products').select('category_id'),
  ]);

  const countsByCategory = new Map<string, number>();
  for (const row of productCategoryRows.data || []) {
    const id = (row as { category_id: string }).category_id;
    countsByCategory.set(id, (countsByCategory.get(id) || 0) + 1);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="border border-line rounded bg-white p-5">
          <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Vendors</p>
          <p className="font-display text-3xl font-bold text-ink">{vendorCount.count ?? 0}</p>
          <Link href="/admin/vendors" className="text-sm text-teal hover:underline mt-2 inline-block">
            Manage vendors &rarr;
          </Link>
        </div>

        <div className="border border-line rounded bg-white p-5">
          <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Products</p>
          <p className="font-display text-3xl font-bold text-ink">{productCount.count ?? 0}</p>
          <Link href="/admin/products" className="text-sm text-teal hover:underline mt-2 inline-block">
            Manage products &rarr;
          </Link>
        </div>

        <div className="border border-line rounded bg-white p-5">
          <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Categories</p>
          <p className="font-display text-3xl font-bold text-ink">{categories.length}</p>
          <Link href="/admin/categories" className="text-sm text-teal hover:underline mt-2 inline-block">
            Manage categories &rarr;
          </Link>
        </div>
      </div>

      <h2 className="font-display text-lg font-bold text-ink mb-4">Products by category</h2>
      <div className="border border-line rounded bg-white divide-y divide-line">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-ink">{c.name}</span>
            <span className="font-mono text-sm text-copper-dark">
              {countsByCategory.get(c.id) || 0}
            </span>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-3 text-sm text-muted">
            No categories yet — add some in Categories.
          </p>
        )}
      </div>
    </div>
  );
}
