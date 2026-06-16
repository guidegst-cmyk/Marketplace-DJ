import Link from 'next/link';
import { createVendor } from '@/lib/actions';

export default function NewVendorPage() {
  return (
    <div className="max-w-xl">
      <Link href="/admin/vendors" className="text-sm text-teal hover:underline">
        &larr; Back to vendors
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-6">Add vendor</h1>

      <form action={createVendor} className="border border-line rounded bg-white p-6 flex flex-col gap-4">
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
          <label htmlFor="area" className="text-xs font-mono uppercase tracking-wide text-muted">
            Area / location
          </label>
          <input
            id="area"
            name="area"
            type="text"
            placeholder="e.g. Lajpat Rai Market, Delhi"
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
          Save vendor
        </button>
      </form>
    </div>
  );
}
