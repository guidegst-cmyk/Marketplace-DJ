import Link from 'next/link';
import SignOutButton from './SignOutButton';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/vendors', label: 'Vendors' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminNav() {
  return (
    <div className="border-b border-line bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="ch-tag">Admin</span>
          <nav className="flex items-center gap-4 text-sm font-sans">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-ink hover:text-teal transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted hover:text-teal transition-colors">
            View site &rarr;
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
