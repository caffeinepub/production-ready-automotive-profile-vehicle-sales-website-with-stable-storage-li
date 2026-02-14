import { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Car, FileText, MessageSquare, Star, LayoutDashboard, Image, BarChart, User, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const location = useLocation();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { label: 'Promotions', path: '/admin/promotions', icon: FileText },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'Blog', path: '/admin/blog', icon: MessageSquare },
    { label: 'Leads', path: '/admin/leads', icon: MessageSquare },
    { label: 'Media', path: '/admin/media', icon: Image },
    { label: 'Statistics', path: '/admin/stats', icon: BarChart },
    { label: 'Profile', path: '/admin/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-[#262729] text-white min-h-screen p-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[#C90010] text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
