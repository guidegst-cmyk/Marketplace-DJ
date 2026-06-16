import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getVendorById } from '@/lib/data';
import { deleteVendor, updateVendor } from '@/lib/actions';

export default async function EditVendorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const vendor = await getVendorById(supabase, params.id);

  if (!vendor) notFound();

  const update = updateVendor.bind(null, vendor.id);
  const remove = deleteVendor.bind(null, vendor.id);

  return (
    <div className="max-w-xl">
      <Link href="/admin/vendors" className="text-sm text-teal hover:underline">
        &larr; Back to vendors
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-6">Edit vendor</h1>

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
            defaultValue={vendor.name}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="area" className="text-xs font-mono uppercase tracking-wide text-muted">
            Area / location
          </label>
          <input
            id="area"
            name="area"
            type="text"
            defaultValue={vendor.area || ''}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
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
            defaultValue={vendor.description || ''}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={vendor.active} className="accent-teal" />
          Active (visible on the site)
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rocker"
            data-active="true"
            style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
          >
            Save changes
          </button>
        </div>
      </form>

      <form action={remove} className="mt-4">
        <button type="submit" className="text-sm text-copper-dark hover:underline">
          Delete this vendor
        </button>
      </form>
    </div>
  );
}
