import type { Category, Vendor } from '@/lib/types';
import Link from 'next/link';

type Props = {
  categories: Category[];
  vendors: Pick<Vendor, 'id' | 'name'>[];
  current: { q?: string; category?: string; vendor?: string };
};

export default function ProductFilters({ categories, vendors, current }: Props) {
  const hasFilters = Boolean(current.q || current.category || current.vendor);

  return (
    <form
      method="GET"
      action="/products"
      className="border border-line rounded bg-white p-4 flex flex-col sm:flex-row sm:items-end gap-3"
    >
      <div className="flex-1 flex flex-col gap-1">
        <label htmlFor="q" className="text-xs font-mono uppercase tracking-wide text-muted">
          Search
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={current.q || ''}
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
          defaultValue={current.category || ''}
          className="border border-line rounded px-3 py-2 text-sm bg-white focus-visible:outline-2 focus-visible:outline-teal"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
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
          defaultValue={current.vendor || ''}
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
        {hasFilters && (
          <Link href="/products" className="rocker flex items-center" data-active="false">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
