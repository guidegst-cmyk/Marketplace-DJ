import type { Settings } from '@/lib/types';

export default function Footer({ settings }: { settings: Settings | null }) {
  const siteName = settings?.site_name || 'XYZ';
  const number = settings?.whatsapp_number;

  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted font-sans">
        <p>
          &copy; {new Date().getFullYear()} {siteName}. Vendor directory for
          electronics &amp; audio equipment.
        </p>
        {number ? (
          <p className="font-mono text-xs">
            Enquiries: <span className="text-ink">{number}</span> (WhatsApp only)
          </p>
        ) : null}
      </div>
    </footer>
  );
}
