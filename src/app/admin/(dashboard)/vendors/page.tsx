import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteVendor } from '@/lib/actions';
import type { Vendor } from '@/lib/types';

export default async function AdminVendorsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('vendors').select('*').order('name');
  const vendors = (data as Vendor[]) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold text-ink">Vendors</h1>
        <Link
          href="/admin/vendors/new"
          className="rocker"
          data-active="true"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
        >
          + Add vendor
        </Link>
      </div>

      <div className="border border-line rounded bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-mono uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {vendors.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium text-ink">{v.name}</td>
                <td className="px-4 py-3 text-muted">{v.area || '—'}</td>
                <td className="px-4 py-3">
                  {v.active ? (
                    <span className="text-teal text-xs font-mono">Active</span>
                  ) : (
                    <span className="text-muted text-xs font-mono">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/vendors/${v.id}`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <form action={deleteVendor.bind(null, v.id)}>
                      <button type="submit" className="text-copper-dark hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  No vendors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
