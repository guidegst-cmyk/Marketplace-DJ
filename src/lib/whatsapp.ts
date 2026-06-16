import type { Product, Settings } from './types';

/**
 * Builds a wa.me deep link that opens WhatsApp with a prefilled enquiry
 * message for a given product, using the central number + template
 * configured in admin settings.
 *
 * Template placeholders: {product}, {brand}, {vendor}, {category}, {link}
 */
export function buildEnquiryLink(
  settings: Pick<Settings, 'whatsapp_number' | 'enquiry_message_template'>,
  product: Pick<Product, 'name' | 'brand'> & {
    vendorName?: string | null;
    categoryName?: string | null;
  },
  pageUrl?: string
) {
  const digitsOnly = (settings.whatsapp_number || '').replace(/\D/g, '');

  const template =
    settings.enquiry_message_template ||
    'Hi, I am interested in {product} ({brand}) listed by {vendor}. Please share price and availability.';

  const message = template
    .replaceAll('{product}', product.name)
    .replaceAll('{brand}', product.brand || 'N/A')
    .replaceAll('{vendor}', product.vendorName || 'N/A')
    .replaceAll('{category}', product.categoryName || 'N/A')
    .replaceAll('{link}', pageUrl || '');

  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digitsOnly}?${params.toString()}`;
}

/**
 * General enquiry link (no specific product) — used on the home page
 * and vendor pages.
 */
export function buildGeneralEnquiryLink(
  settings: Pick<Settings, 'whatsapp_number'>,
  message: string
) {
  const digitsOnly = (settings.whatsapp_number || '').replace(/\D/g, '');
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digitsOnly}?${params.toString()}`;
}
