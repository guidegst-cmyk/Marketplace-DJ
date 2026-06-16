import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getActiveCategories, getSettings } from '@/lib/data';
import { buildGeneralEnquiryLink } from '@/lib/whatsapp';

export default async function HomePage() {
  const supabase = createClient();
  const [settings, categories] = await Promise.all([
    getSettings(supabase),
    getActiveCategories(supabase),
  ]);

  const siteName = settings?.site_name || 'XYZ';
  const chatLink = settings
    ? buildGeneralEnquiryLink(settings, `Hi, I'm looking for audio/electronics equipment on ${siteName}.`)
    : '#';

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1 mb-4">
            <span className="ch-tag">Directory</span>
            <span className="text-xs font-mono text-muted">50 vendors &middot; 500+ products</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink max-w-2xl leading-[1.1]">
            Amplifiers, speakers &amp; audio gear, sourced locally.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink/70 max-w-xl">
            Browse the catalog, find what you need, and enquire directly on
            WhatsApp. No accounts, no checkout — just a quick chat to confirm
            price and availability with our team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded bg-teal text-paper text-sm font-medium px-5 py-3 hover:bg-teal-dark transition-colors"
            >
              Browse products
            </Link>
            <Link
              href="/vendors"
              className="inline-flex items-center justify-center rounded border border-line text-ink text-sm font-medium px-5 py-3 hover:border-teal transition-colors"
            >
              Browse vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Shop by category
          </h2>
          <Link href="/products" className="text-sm text-teal hover:underline">
            View all products &rarr;
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-muted">
            Categories will appear here once they&apos;re added in the admin
            panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="border border-line rounded bg-white p-4 hover:border-teal transition-colors group"
              >
                <span className="text-xs font-mono text-copper-dark">CH.</span>
                <h3 className="font-display font-bold text-sm sm:text-base text-ink group-hover:text-teal transition-colors mt-1">
                  {c.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-8">
            How it works
          </h2>
          <ol className="grid sm:grid-cols-3 gap-6">
            <li className="flex flex-col gap-2">
              <span className="font-mono text-copper-dark text-sm">01</span>
              <h3 className="font-display font-bold text-ink">Browse the catalog</h3>
              <p className="text-sm text-ink/70">
                Filter by category or vendor to find amplifiers, speakers and
                accessories from across our network of 50 dealers.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-mono text-copper-dark text-sm">02</span>
              <h3 className="font-display font-bold text-ink">Enquire on WhatsApp</h3>
              <p className="text-sm text-ink/70">
                Tap &ldquo;Enquire on WhatsApp&rdquo; on any product. We&apos;ll
                share the current price, stock and the vendor&apos;s details.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-mono text-copper-dark text-sm">03</span>
              <h3 className="font-display font-bold text-ink">Confirm &amp; collect</h3>
              <p className="text-sm text-ink/70">
                Finalise the deal directly with the vendor — pricing and
                availability are confirmed over chat, not online.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-display text-lg sm:text-xl font-bold text-paper max-w-md">
            Not sure what you&apos;re looking for? Tell us what you need.
          </p>
          <a
            href={chatLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded bg-copper text-paper text-sm font-medium px-5 py-3 hover:bg-copper-dark transition-colors whitespace-nowrap"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
