import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProductById, getSettings } from '@/lib/data';
import { buildEnquiryLink } from '@/lib/whatsapp';
import EnquireButton from '@/components/EnquireButton';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const product = await getProductById(supabase, params.id);

  if (!product) return { title: 'Product not found — XYZ Marketplace' };

  const title = `${product.name}${product.brand ? ` — ${product.brand}` : ''} | XYZ Marketplace`;
  const description = [
    product.categories?.name ? `${product.categories.name}.` : null,
    product.vendors?.name ? `Sold by ${product.vendors.name}.` : null,
    product.specs ?? null,
    'Enquire on WhatsApp for price and availability.',
  ].filter(Boolean).join(' ');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [settings, product] = await Promise.all([
    getSettings(supabase),
    getProductById(supabase, params.id),
  ]);

  if (!product || !product.active) notFound();

  const enquireHref = settings
    ? buildEnquiryLink(settings, {
        name: product.name,
        brand: product.brand,
        vendorName: product.vendors?.name,
        categoryName: product.categories?.name,
      })
    : '#';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs font-mono text-muted mb-6 flex gap-2 items-center">
        <Link href="/products" className="hover:text-teal">Products</Link>
        <span>/</span>
        {product.categories && (
          <>
            <Link href={`/products?category=${product.categories.slug}`} className="hover:text-teal">
              {product.categories.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="border border-line rounded bg-white overflow-hidden">
        {/* Product image */}
        <div className="w-full aspect-[16/9] bg-paper border-b border-line flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <span className="font-mono text-xs text-muted uppercase tracking-wide">
              No photo available
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {product.categories && (
            <span className="ch-tag">{product.categories.name}</span>
          )}

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight mt-3">
            {product.name}
          </h1>

          {product.brand && (
            <p className="mt-2 text-sm font-mono text-muted uppercase tracking-wide">
              Brand: {product.brand}
            </p>
          )}

          {product.specs && (
            <div className="mt-4 border border-line rounded p-4 bg-paper">
              <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Specifications</p>
              <p className="text-sm font-mono text-ink whitespace-pre-line">{product.specs}</p>
            </div>
          )}

          {product.description && (
            <p className="mt-4 text-sm text-ink/80 leading-relaxed">{product.description}</p>
          )}

          {product.vendors && (
            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-xs font-mono uppercase tracking-wide text-muted">Sold by</p>
              <Link
                href={`/vendors/${product.vendors.id}`}
                className="font-display font-bold text-ink hover:text-teal transition-colors"
              >
                {product.vendors.name}
              </Link>
              {product.vendors.area && (
                <p className="text-sm text-muted">{product.vendors.area}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 flex-wrap border-t border-line pt-6">
            <span className="font-mono text-copper-dark font-medium text-sm">
              Enquire for price
            </span>
            <EnquireButton href={enquireHref} />
          </div>
        </div>
      </div>
    </div>
  );
}
