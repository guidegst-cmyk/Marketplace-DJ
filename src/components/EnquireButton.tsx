type Props = {
  href: string;
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
  className?: string;
};

export default function EnquireButton({
  href,
  label = 'Enquire on WhatsApp',
  size = 'md',
  variant = 'solid',
  className = '',
}: Props) {
  const sizeClasses = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5';
  const variantClasses =
    variant === 'solid'
      ? 'bg-teal text-paper hover:bg-teal-dark border border-teal'
      : 'bg-transparent text-teal hover:bg-teal-light border border-teal';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-sans font-medium rounded transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.96 8.96 0 0 0-7.77 13.4L3 21l3.7-1.25a8.93 8.93 0 0 0 4.36 1.15h.01A8.96 8.96 0 0 0 20 11.94a8.86 8.86 0 0 0-2.4-5.62Zm-5.55 13.6h-.01a7.42 7.42 0 0 1-3.78-1.04l-.27-.16-2.81.95.94-2.74-.18-.28a7.45 7.45 0 0 1 11.6-9.2 7.36 7.36 0 0 1 2.18 5.27 7.46 7.46 0 0 1-7.67 7.2Zm4.1-5.55c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.16-.48.05-1.3-.65-2.16-1.16-3.02-2.64-.23-.39.23-.36.66-1.2.07-.15.04-.27-.03-.39-.07-.11-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.6.28-.2.22-.78.76-.78 1.85s.8 2.15.91 2.3c.11.15 1.55 2.37 3.76 3.23 1.86.74 2.24.6 2.65.56.4-.04 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.09-.2-.15-.42-.26Z" />
      </svg>
      {label}
    </a>
  );
}
