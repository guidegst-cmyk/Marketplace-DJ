import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteProduct } from '@/lib/actions';
import { withParams } from '@/lib/url';
import type { Product } from '@/lib/types';
import { PAGE_SIZE } from '@/lib/types';

type SearchParams = {
  q?: string;
  category?: string;
  vendor?: string;
  page?: string;
};

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient();
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [categoriesRes, vendorsRes] = await Promise.all([
    supabase.from('categories').select('id, name').order('sort_order'),
    supabase.from('vendors').select('id, name').order('name'),
  ]);
  const categories = categoriesRes.data || [];
  const vendors = vendorsRes.data || [];

  let query = supabase
    .from('products')
    .select('id, name, brand, active, vendor_id, category_id, vendors(id, name), categories(id, name)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (searchParams.category) query = query.eq('category_id', searchParams.category);
  if (searchParams.vendor) query = query.eq('vendor_id', searchParams.vendor);
  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,brand.ilike.%${searchParams.q}%`);
  }

  const { data, count } = await query;
  const products = (data as unknown as Product[]) || [];
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rocker"
          data-active="true"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
        >
          + Add product
        </Link>
      </div>

      <form
        method="GET"
        action="/admin/products"
        className="border border-line rounded bg-white p-4 flex flex-col sm:flex-row sm:items-end gap-3 mb-6"
      >
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-mono uppercase tracking-wide text-muted">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={searchParams.q || ''}
            placeholder="Product name or brand"
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>
        <div className="flex flex-col gap-1 sm:w-56">
          <label htmlFor="category" className="text-xs font-mono uppercase tracking-wide text-muted">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={searchParams.category || ''}
            className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:w-56">
          <label htmlFor="vendor" className="text-xs font-mono uppercase tracking-wide text-muted">
            Vendor
          </label>
          <select
            id="vendor"
            name="vendor"
            defaultValue={searchParams.vendor || ''}
            className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal"
          >
            <option value="">All vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rocker"
            data-active="true"
            style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
          >
            Apply
          </button>
          {(searchParams.q || searchParams.category || searchParams.vendor) && (
            <Link href="/admin/products" className="rocker flex items-center" data-active="false">
              Clear
            </Link>
          )}
        </div>
      </form>

      <div className="border border-line rounded bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-mono uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-muted font-mono text-xs">{p.brand || '—'}</td>
                <td className="px-4 py-3 text-muted">{p.categories?.name || '—'}</td>
                <td className="px-4 py-3 text-muted">{p.vendors?.name || '—'}</td>
                <td className="px-4 py-3">
                  {p.active ? (
                    <span className="text-teal text-xs font-mono">Active</span>
                  ) : (
                    <span className="text-muted text-xs font-mono">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button type="submit" className="text-copper-dark hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between gap-4 mt-6" aria-label="Pagination">
          {page <= 1 ? (
            <span className="rocker opacity-40 cursor-not-allowed" data-active="false">&larr; Previous</span>
          ) : (
            <Link className="rocker" data-active="false" href={`/admin/products${withParams(searchParams, { page: page - 1 })}`}>
              &larr; Previous
            </Link>
          )}
          <p className="text-sm font-mono text-muted">
            Page {page} of {totalPages} &middot; {total} results
          </p>
          {page >= totalPages ? (
            <span className="rocker opacity-40 cursor-not-allowed" data-active="false">Next &rarr;</span>
          ) : (
            <Link className="rocker" data-active="false" href={`/admin/products${withParams(searchParams, { page: page + 1 })}`}>
              Next &rarr;
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
