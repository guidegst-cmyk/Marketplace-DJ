import Link from 'next/link';
import { withParams } from '@/lib/url';

type Props = {
  page: number;
  total: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
  basePath: string;
};

export default function Pagination({ page, total, pageSize, searchParams, basePath }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="flex items-center justify-between gap-4 mt-8" aria-label="Pagination">
      {prevDisabled ? (
        <span className="rocker opacity-40 cursor-not-allowed" data-active="false">
          &larr; Previous
        </span>
      ) : (
        <Link className="rocker" data-active="false" href={`${basePath}${withParams(searchParams, { page: page - 1 })}`}>
          &larr; Previous
        </Link>
      )}

      <p className="text-sm font-mono text-muted">
        Page {page} of {totalPages} &middot; {total} results
      </p>

      {nextDisabled ? (
        <span className="rocker opacity-40 cursor-not-allowed" data-active="false">
          Next &rarr;
        </span>
      ) : (
        <Link className="rocker" data-active="false" href={`${basePath}${withParams(searchParams, { page: page + 1 })}`}>
          Next &rarr;
        </Link>
      )}
    </nav>
  );
}
