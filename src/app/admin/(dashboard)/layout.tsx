import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/AdminNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/admin/login');
  }

  return (
    <div>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
