import Link from 'next/link';
import type { Vendor } from '@/lib/types';

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="border border-line rounded bg-white p-4 flex flex-col gap-1 hover:border-teal transition-colors group"
    >
      <h3 className="font-display font-bold text-base text-ink group-hover:text-teal transition-colors">
        {vendor.name}
      </h3>
      {vendor.area && (
        <p className="text-xs font-mono text-muted uppercase tracking-wide">
          {vendor.area}
        </p>
      )}
      {vendor.description && (
        <p className="text-sm text-ink/70 line-clamp-2 mt-1">{vendor.description}</p>
      )}
      <span className="text-xs text-teal mt-2 font-medium">View products &rarr;</span>
    </Link>
  );
}
