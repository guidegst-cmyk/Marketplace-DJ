import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProducts, getSettings, getVendorById } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const vendor = await getVendorById(supabase, params.id);

  if (!vendor) return { title: 'Vendor not found — XYZ Marketplace' };

  return {
    title: `${vendor.name} | XYZ Marketplace`,
    description: vendor.description || `Products from ${vendor.name} on XYZ Marketplace.`,
  };
}

export default async function VendorDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const supabase = createClient();
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [settings, vendor, { products, total, pageSize }] = await Promise.all([
    getSettings(supabase),
    getVendorById(supabase, params.id),
    getProducts(supabase, { vendorId: params.id, page }),
  ]);

  if (!vendor || !vendor.active) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs font-mono text-muted mb-6 flex gap-2 items-center">
        <Link href="/vendors" className="hover:text-teal">Vendors</Link>
        <span>/</span>
        <span className="text-ink">{vendor.name}</span>
      </nav>

      <div className="border border-line rounded bg-white p-6 sm:p-8 mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">{vendor.name}</h1>
        {vendor.area && (
          <p className="text-sm font-mono text-muted uppercase tracking-wide mt-1">{vendor.area}</p>
        )}
        {vendor.description && <p className="text-sm text-ink/80 mt-3 leading-relaxed">{vendor.description}</p>}
      </div>

      <h2 className="font-display text-lg font-bold text-ink mb-4">
        Products from {vendor.name}
      </h2>

      {products.length === 0 ? (
        <div className="border border-line rounded bg-white p-10 text-center">
          <p className="text-sm text-muted">This vendor doesn&apos;t have any listed products yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            searchParams={searchParams}
            basePath={`/vendors/${vendor.id}`}
          />
        </>
      )}
    </div>
  );
}
