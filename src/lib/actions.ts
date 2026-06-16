'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect('/admin/login');
  }
  return supabase;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------- Vendors ----------

export async function createVendor(formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  const area = String(formData.get('area') || '').trim() || null;
  const description = String(formData.get('description') || '').trim() || null;
  const active = formData.get('active') === 'on';

  if (!name) throw new Error('Vendor name is required');

  await supabase.from('vendors').insert({ name, area, description, active });

  revalidatePath('/admin/vendors');
  revalidatePath('/vendors');
  redirect('/admin/vendors');
}

export async function updateVendor(id: string, formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  const area = String(formData.get('area') || '').trim() || null;
  const description = String(formData.get('description') || '').trim() || null;
  const active = formData.get('active') === 'on';

  if (!name) throw new Error('Vendor name is required');

  await supabase.from('vendors').update({ name, area, description, active }).eq('id', id);

  revalidatePath('/admin/vendors');
  revalidatePath('/vendors');
  revalidatePath(`/vendors/${id}`);
  redirect('/admin/vendors');
}

export async function deleteVendor(id: string) {
  const supabase = await requireUser();
  await supabase.from('vendors').delete().eq('id', id);
  revalidatePath('/admin/vendors');
  revalidatePath('/vendors');
  redirect('/admin/vendors');
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Category name is required');
  const slug = slugify(String(formData.get('slug') || '') || name);
  const sort_order = parseInt(String(formData.get('sort_order') || '0'), 10) || 0;
  const active = formData.get('active') === 'on';

  await supabase.from('categories').insert({ name, slug, sort_order, active });

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Category name is required');
  const slug = slugify(String(formData.get('slug') || '') || name);
  const sort_order = parseInt(String(formData.get('sort_order') || '0'), 10) || 0;
  const active = formData.get('active') === 'on';

  await supabase.from('categories').update({ name, slug, sort_order, active }).eq('id', id);

  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
}

export async function deleteCategory(id: string) {
  const supabase = await requireUser();
  await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
}

// ---------- Products ----------

export async function createProduct(formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  const vendor_id = String(formData.get('vendor_id') || '');
  const category_id = String(formData.get('category_id') || '');
  const brand = String(formData.get('brand') || '').trim() || null;
  const specs = String(formData.get('specs') || '').trim() || null;
  const description = String(formData.get('description') || '').trim() || null;
  const active = formData.get('active') === 'on';

  if (!name) throw new Error('Product name is required');
  if (!vendor_id) throw new Error('Vendor is required');
  if (!category_id) throw new Error('Category is required');

  await supabase
    .from('products')
    .insert({ name, vendor_id, category_id, brand, specs, description, active });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await requireUser();

  const name = String(formData.get('name') || '').trim();
  const vendor_id = String(formData.get('vendor_id') || '');
  const category_id = String(formData.get('category_id') || '');
  const brand = String(formData.get('brand') || '').trim() || null;
  const specs = String(formData.get('specs') || '').trim() || null;
  const description = String(formData.get('description') || '').trim() || null;
  const active = formData.get('active') === 'on';

  if (!name) throw new Error('Product name is required');
  if (!vendor_id) throw new Error('Vendor is required');
  if (!category_id) throw new Error('Category is required');

  await supabase
    .from('products')
    .update({ name, vendor_id, category_id, brand, specs, description, active })
    .eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await requireUser();
  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

// ---------- Settings ----------

export async function updateSettings(formData: FormData) {
  const supabase = await requireUser();

  const id = String(formData.get('id') || '');
  const site_name = String(formData.get('site_name') || '').trim() || 'XYZ';
  const whatsapp_number = String(formData.get('whatsapp_number') || '').trim();
  const enquiry_message_template = String(formData.get('enquiry_message_template') || '').trim();

  await supabase
    .from('settings')
    .update({ site_name, whatsapp_number, enquiry_message_template })
    .eq('id', id);

  revalidatePath('/', 'layout');
}

// ---------- Auth ----------

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
