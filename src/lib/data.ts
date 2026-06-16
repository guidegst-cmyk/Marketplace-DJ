import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category, Product, Settings, Vendor } from './types';
import { PAGE_SIZE } from './types';

export async function getSettings(supabase: SupabaseClient): Promise<Settings | null> {
  const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  return data as Settings | null;
}

export async function getActiveCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  return (data as Category[]) || [];
}

type ProductFilters = {
  categorySlug?: string;
  vendorId?: string;
  search?: string;
  page?: number;
};

export async function getProducts(supabase: SupabaseClient, filters: ProductFilters = {}) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('products')
    .select(
      'id, name, brand, specs, description, active, vendor_id, category_id, created_at, vendors(id, name, area), categories(id, name, slug)',
      { count: 'exact' }
    )
    .eq('active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.categorySlug) {
    query = query.eq('categories.slug', filters.categorySlug);
  }
  if (filters.vendorId) {
    query = query.eq('vendor_id', filters.vendorId);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
  }

  const { data, count } = await query;

  // When filtering by category slug via a join, PostgREST returns rows even
  // if the joined category doesn't match (it nulls the relation instead of
  // filtering). Filter defensively on the client side as a safety net.
  let rows = (data as unknown as Product[]) || [];
  if (filters.categorySlug) {
    rows = rows.filter((p) => p.categories?.slug === filters.categorySlug);
  }

  return { products: rows, total: count || 0, page, pageSize: PAGE_SIZE };
}

export async function getProductById(supabase: SupabaseClient, id: string) {
  const { data } = await supabase
    .from('products')
    .select(
      'id, name, brand, specs, description, active, vendor_id, category_id, created_at, vendors(id, name, area), categories(id, name, slug)'
    )
    .eq('id', id)
    .maybeSingle();
  return data as unknown as Product | null;
}

type VendorFilters = {
  categorySlug?: string;
  search?: string;
};

export async function getVendors(supabase: SupabaseClient, filters: VendorFilters = {}) {
  let query = supabase
    .from('vendors')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true });

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data } = await query;
  let vendors = (data as Vendor[]) || [];

  if (filters.categorySlug) {
    // Only show vendors that have at least one active product in this category.
    const { data: matches } = await supabase
      .from('products')
      .select('vendor_id, categories!inner(slug)')
      .eq('active', true)
      .eq('categories.slug', filters.categorySlug);

    const idsWithCategory = new Set((matches || []).map((m: any) => m.vendor_id));
    vendors = vendors.filter((v) => idsWithCategory.has(v.id));
  }

  return vendors;
}

export async function getVendorById(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from('vendors').select('*').eq('id', id).maybeSingle();
  return data as Vendor | null;
}
