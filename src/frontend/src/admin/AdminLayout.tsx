import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAdminSession } from './hooks/useAdminSession';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Car, FileText, MessageSquare, Star, LayoutDashboard, Image, BarChart, User, LogOut, Truck, Bug, Menu, X } from 'lucide-react';
import './styles/adminTheme.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAdminSession();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sidebar collapse state - default to collapsed on mobile
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Update collapse state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

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

    // For other routes, match pathname exactly
    return currentPathname === itemPathname;
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isCollapsed ? 'admin-sidebar-collapsed' : 'admin-sidebar-expanded'}`}>
        <div className="admin-sidebar-header">
          <h1 className={`admin-sidebar-title ${isCollapsed ? 'hidden' : ''}`}>Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="admin-sidebar-toggle"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
              >
                <Icon className="admin-nav-icon" />
                {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="admin-logout-button"
          >
            <LogOut className="admin-nav-icon" />
            {!isCollapsed && <span className="admin-nav-label">Logout</span>}
          </Button>
        </div>
      </aside>
      <main className={`admin-main ${isCollapsed ? 'admin-main-expanded' : ''}`}>
        {children}
      </main>
    </div>
  );
}
