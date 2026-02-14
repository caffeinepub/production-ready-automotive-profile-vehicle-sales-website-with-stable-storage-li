import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAdminSession } from './hooks/useAdminSession';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Car, FileText, MessageSquare, Star, LayoutDashboard, Image, BarChart, User, LogOut, Truck } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAdminSession();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate({ to: '/admin/login' });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Passenger Vehicles', path: '/admin/vehicles?category=passenger', icon: Car },
    { label: 'Commercial Vehicles', path: '/admin/vehicles?category=commercial', icon: Truck },
    { label: 'Promo', path: '/admin/promotions', icon: FileText },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'Blog', path: '/admin/blog', icon: MessageSquare },
    { label: 'Leads / Contact', path: '/admin/leads', icon: MessageSquare },
    { label: 'Visitor Statistics', path: '/admin/stats', icon: BarChart },
    { label: 'Media', path: '/admin/media', icon: Image },
    { label: 'Admin User Profile', path: '/admin/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-[#262729] text-white min-h-screen p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Admin CMS</h2>
          </div>
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path.split('?')[0] === location.pathname;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
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
            <Button onClick={handleLogout} variant="outline" className="w-full text-white border-white hover:bg-gray-700">
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
