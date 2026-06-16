import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/data';
import { deleteProduct, updateProduct } from '@/lib/actions';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [product, categoriesRes, vendorsRes] = await Promise.all([
    getProductById(supabase, params.id),
    supabase.from('categories').select('id, name').order('sort_order'),
    supabase.from('vendors').select('id, name').order('name'),
  ]);

  if (!product) notFound();

  const categories = categoriesRes.data || [];
  const vendors = vendorsRes.data || [];

  const update = updateProduct.bind(null, product.id);
  const remove = deleteProduct.bind(null, product.id);

  return (
    <div className="max-w-xl">
      <Link href="/admin/products" className="text-sm text-teal hover:underline">
        &larr; Back to products
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-6">Edit product</h1>

      <form action={update} className="border border-line rounded bg-white p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wide text-muted">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product.name}
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
            defaultValue={product.brand || ''}
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
              defaultValue={product.category_id}
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
              defaultValue={product.vendor_id}
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
            defaultValue={product.specs || ''}
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
            defaultValue={product.description || ''}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product.active} className="accent-teal" />
          Active (visible on the site)
        </label>

        <button
          type="submit"
          className="self-start rocker"
          data-active="true"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
        >
          Save changes
        </button>
      </form>

      <form action={remove} className="mt-4">
        <button type="submit" className="text-sm text-copper-dark hover:underline">
          Delete this product
        </button>
      </form>
    </div>
  );
}
