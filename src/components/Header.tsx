import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { buildGeneralEnquiryLink } from '@/lib/whatsapp';

export default function Header({ settings }: { settings: Settings | null }) {
  const siteName = settings?.site_name || 'XYZ';
  const chatLink = settings
    ? buildGeneralEnquiryLink(
        settings,
        `Hi, I'd like some help finding a product on ${siteName}.`
      )
    : '#';

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="eq-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {siteName}
            <span className="text-copper">.</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 font-sans text-sm text-ink">
          <Link href="/products" className="hover:text-teal transition-colors">
            Products
          </Link>
          <Link href="/vendors" className="hover:text-teal transition-colors">
            Vendors
          </Link>
        </nav>

        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-teal text-paper text-sm font-sans font-medium px-4 py-2 rounded hover:bg-teal-dark transition-colors"
        >
          <span aria-hidden="true">&#8226;</span>
          Chat on WhatsApp
        </a>
      </div>

      <nav className="sm:hidden flex items-center gap-5 px-4 pb-3 font-sans text-sm text-ink">
        <Link href="/products" className="hover:text-teal transition-colors">
          Products
        </Link>
        <Link href="/vendors" className="hover:text-teal transition-colors">
          Vendors
        </Link>
      </nav>
    </header>
  );
}
