import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createProduct } from '@/lib/actions';

export default async function NewProductPage() {
  const supabase = createClient();
  const [categoriesRes, vendorsRes] = await Promise.all([
    supabase.from('categories').select('id, name').order('sort_order'),
    supabase.from('vendors').select('id, name').order('name'),
  ]);
  const categories = categoriesRes.data || [];
  const vendors = vendorsRes.data || [];

  return (
    <div className="max-w-xl">
      <Link href="/admin/products" className="text-sm text-teal hover:underline">
        &larr; Back to products
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-6">Add product</h1>

      <form action={createProduct} className="border border-line rounded bg-white p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wide text-muted">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="brand" className="text-xs font-mono uppercase tracking-wide text-muted">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="category_id" className="text-xs font-mono uppercase tracking-wide text-muted">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal"
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="vendor_id" className="text-xs font-mono uppercase tracking-wide text-muted">
              Vendor *
            </label>
            <select
              id="vendor_id"
              name="vendor_id"
              required
              className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal"
            >
              <option value="">Select...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="specs" className="text-xs font-mono uppercase tracking-wide text-muted">
            Specs
          </label>
          <textarea
            id="specs"
            name="specs"
            rows={3}
            placeholder={'e.g. 1000W RMS, 4 ohm, dual 15" woofers'}
            className="border border-line rounded px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-xs font-mono uppercase tracking-wide text-muted">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="accent-teal" />
          Active (visible on the site)
        </label>

        <button
          type="submit"
          className="self-start rocker"
          data-active="true"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
        >
          Save product
        </button>
      </form>
    </div>
  );
}
