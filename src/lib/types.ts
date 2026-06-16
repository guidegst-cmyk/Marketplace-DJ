export type Category = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
};

export type Vendor = {
  id: string;
  name: string;
  area: string | null;
  description: string | null;
  active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string | null;
  specs: string | null;
  description: string | null;
  image_url: string | null;
  active: boolean;
  vendor_id: string;
  category_id: string;
  created_at: string;
  // Joined fields (when selected with relations)
  vendors?: Pick<Vendor, 'id' | 'name' | 'area'> | null;
  categories?: Pick<Category, 'id' | 'name' | 'slug'> | null;
};

export type Settings = {
  id: string;
  whatsapp_number: string;
  enquiry_message_template: string;
  site_name: string;
};

export const PAGE_SIZE = 24;
