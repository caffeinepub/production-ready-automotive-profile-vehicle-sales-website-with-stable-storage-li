import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAdminSession } from './hooks/useAdminSession';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Car, FileText, MessageSquare, Star, LayoutDashboard, Image, BarChart, User, LogOut, Truck, Bug } from 'lucide-react';
import './styles/adminTheme.css';

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
    { label: 'Admin User Profile', path: '/admin/profile', icon: User },
    { label: 'Auth Debug Test', path: '/admin/auth-debug', icon: Bug }
  ];

  const isNavItemActive = (itemPath: string): boolean => {
    const [itemPathname, itemSearch] = itemPath.split('?');
    const currentPathname = location.pathname;
    const currentSearch = location.search;

    // For /admin/vehicles, check both pathname and category param
    if (itemPathname === '/admin/vehicles') {
      if (currentPathname !== '/admin/vehicles') return false;
      
      const itemParams = new URLSearchParams(itemSearch);
      const currentParams = new URLSearchParams(currentSearch);
      const itemCategory = itemParams.get('category');
      const currentCategory = currentParams.get('category');
      
      return itemCategory === currentCategory;
    }

    // For other routes, match pathname only
    return itemPathname === currentPathname;
  };

  return (
    <div className="admin-scope min-h-screen admin-main-bg">
      <div className="flex">
        <aside className="w-64 admin-sidebar text-white min-h-screen flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold tracking-tight">Admin CMS</h2>
            <p className="text-sm text-white/70 mt-1">Content Management</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item flex items-center gap-3 px-4 py-3 text-sm ${
                    isActive ? 'active text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Icon className="admin-nav-icon h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
