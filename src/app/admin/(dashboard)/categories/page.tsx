import { createClient } from '@/lib/supabase/server';
import { createCategory, deleteCategory, updateCategory } from '@/lib/actions';
import type { Category } from '@/lib/types';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('categories').select('*').order('sort_order');
  const categories = (data as Category[]) || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Categories</h1>

      <div className="border border-line rounded bg-white overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-mono uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 w-24">Order</th>
              <th className="px-4 py-3 w-24">Active</th>
              <th className="px-4 py-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((c) => {
              const update = updateCategory.bind(null, c.id);
              const remove = deleteCategory.bind(null, c.id);
              return (
                <tr key={c.id}>
                  <td colSpan={5} className="p-0">
                    <form action={update} className="grid grid-cols-5 gap-2 px-4 py-2 items-center">
                      <input
                        name="name"
                        defaultValue={c.name}
                        required
                        className="border border-line rounded px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-teal"
                      />
                      <input
                        name="slug"
                        defaultValue={c.slug}
                        className="border border-line rounded px-2 py-1.5 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal"
                      />
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={c.sort_order}
                        className="border border-line rounded px-2 py-1.5 text-sm w-20 focus-visible:outline-2 focus-visible:outline-teal"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="active" defaultChecked={c.active} className="accent-teal" />
                        Active
                      </label>
                      <div className="flex items-center gap-3 justify-end">
                        <button type="submit" className="text-teal hover:underline text-sm">
                          Save
                        </button>
                        <button
                          type="submit"
                          formAction={remove}
                          className="text-copper-dark hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No categories yet — add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-lg font-bold text-ink mb-4">Add category</h2>
      <form
        action={createCategory}
        className="border border-line rounded bg-white p-4 grid grid-cols-1 sm:grid-cols-5 gap-2 items-end max-w-3xl"
      >
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wide text-muted">
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Amplifiers"
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="slug" className="text-xs font-mono uppercase tracking-wide text-muted">
            Slug (optional)
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="auto-generated from name"
            className="border border-line rounded px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="sort_order" className="text-xs font-mono uppercase tracking-wide text-muted">
            Order
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={categories.length}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>
        <div className="sm:col-span-5 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked className="accent-teal" />
            Active
          </label>
          <button
            type="submit"
            className="rocker"
            data-active="true"
            style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
          >
            + Add category
          </button>
        </div>
      </form>
    </div>
  );
}
