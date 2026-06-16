import Link from 'next/link';
import type { Product, Settings } from '@/lib/types';
import { buildEnquiryLink } from '@/lib/whatsapp';
import EnquireButton from './EnquireButton';

export default function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: Settings | null;
}) {
  const enquireHref = settings
    ? buildEnquiryLink(settings, {
        name: product.name,
        brand: product.brand,
        vendorName: product.vendors?.name,
        categoryName: product.categories?.name,
      })
    : '#';

  return (
    <div className="border border-line rounded bg-white flex flex-col">
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          {product.categories ? (
            <span className="ch-tag">{product.categories.name}</span>
          ) : (
            <span />
          )}
        </div>

        <Link href={`/products/${product.id}`} className="group">
          <h3 className="font-display font-bold text-base text-ink leading-snug group-hover:text-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs font-mono text-muted uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        {product.specs && (
          <p className="text-xs font-mono text-ink/70 line-clamp-2">{product.specs}</p>
        )}

        {product.vendors && (
          <p className="text-xs text-muted mt-auto pt-2">
            Sold by{' '}
            <Link
              href={`/vendors/${product.vendors.id}`}
              className="text-ink hover:text-teal underline-offset-2 hover:underline"
            >
              {product.vendors.name}
            </Link>
          </p>
        )}
      </div>

      <div className="border-t border-line p-3 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-copper-dark font-medium">
          Enquire for price
        </span>
        <EnquireButton href={enquireHref} label="WhatsApp" size="sm" />
      </div>
    </div>
  );
}
