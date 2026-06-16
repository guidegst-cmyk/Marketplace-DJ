'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import { createClient } from '@/lib/supabase/client';

type SelectOption = { id: string; name: string };

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('categories').select('id, name').order('sort_order'),
      supabase.from('vendors').select('id, name').order('name'),
    ]).then(([prod, cats, vends]) => {
      if (prod.data) {
        setProduct(prod.data);
        setImageUrl(prod.data.image_url || '');
      }
      setCategories((cats.data as SelectOption[]) || []);
      setVendors((vends.data as SelectOption[]) || []);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const supabase = createClient();

    const { error: err } = await supabase.from('products').update({
      name: String(data.get('name') || '').trim(),
      brand: String(data.get('brand') || '').trim() || null,
      category_id: String(data.get('category_id') || ''),
      vendor_id: String(data.get('vendor_id') || ''),
      specs: String(data.get('specs') || '').trim() || null,
      description: String(data.get('description') || '').trim() || null,
      image_url: imageUrl || null,
      active: data.get('active') === 'on',
    }).eq('id', id);

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push('/admin/products');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    router.push('/admin/products');
    router.refresh();
  }

  if (loading) return <p className="text-sm text-muted">Loading...</p>;
  if (!product) return <p className="text-sm text-copper-dark">Product not found.</p>;

  return (
    <div className="max-w-xl">
      <Link href="/admin/products" className="text-sm text-teal hover:underline">
        &larr; Back to products
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-6">Edit product</h1>

      <form onSubmit={handleSubmit} className="border border-line rounded bg-white p-6 flex flex-col gap-4">
        {/* Photo upload */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-wide text-muted">Product photo</span>
          <ImageUpload
            currentUrl={product.image_url}
            onUploaded={(url) => setImageUrl(url)}
          />
          {imageUrl && (
            <button type="button" onClick={() => setImageUrl('')}
              className="text-xs text-copper-dark hover:underline self-start">
              Remove photo
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wide text-muted">Name *</label>
          <input id="name" name="name" type="text" required defaultValue={product.name}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="brand" className="text-xs font-mono uppercase tracking-wide text-muted">Brand</label>
          <input id="brand" name="brand" type="text" defaultValue={product.brand || ''}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="category_id" className="text-xs font-mono uppercase tracking-wide text-muted">Category *</label>
            <select id="category_id" name="category_id" required defaultValue={product.category_id}
              className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal">
              <option value="">Select...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="vendor_id" className="text-xs font-mono uppercase tracking-wide text-muted">Vendor *</label>
            <select id="vendor_id" name="vendor_id" required defaultValue={product.vendor_id}
              className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal">
              <option value="">Select...</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="specs" className="text-xs font-mono uppercase tracking-wide text-muted">Specs</label>
          <textarea id="specs" name="specs" rows={3} defaultValue={product.specs || ''}
            className="border border-line rounded px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-xs font-mono uppercase tracking-wide text-muted">Description</label>
          <textarea id="description" name="description" rows={3} defaultValue={product.description || ''}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product.active} className="accent-teal" />
          Active (visible on the site)
        </label>

        {error && <p className="text-sm text-copper-dark">{error}</p>}

        <button type="submit" disabled={saving}
          className="self-start rocker disabled:opacity-60"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <button onClick={handleDelete} disabled={deleting}
        className="mt-4 text-sm text-copper-dark hover:underline disabled:opacity-60">
        {deleting ? 'Deleting...' : 'Delete this product'}
      </button>
    </div>
  );
}
