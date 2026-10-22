import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';
import { isAdmin } from '@/lib/admin-auth';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, admin } = await isAdmin();
  if (!user || !admin) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar email={user.email ?? ''} />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl p-5 pt-20 md:p-8 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}
