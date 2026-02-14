import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './admin/AdminLayout';
import AdminGuard from './admin/AdminGuard';
import HomePage from './pages/HomePage';
import PassengerVehiclesPage from './pages/PassengerVehiclesPage';
import CommercialVehiclesPage from './pages/CommercialVehiclesPage';
import PromoPage from './pages/PromoPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import PassengerVehicleDetailPage from './pages/PassengerVehicleDetailPage';
import CommercialVehicleDetailPage from './pages/CommercialVehicleDetailPage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import VehiclesAdminPage from './admin/pages/VehiclesAdminPage';
import PromotionsAdminPage from './admin/pages/PromotionsAdminPage';
import TestimonialsAdminPage from './admin/pages/TestimonialsAdminPage';
import BlogAdminPage from './admin/pages/BlogAdminPage';
import LeadsAdminPage from './admin/pages/LeadsAdminPage';
import VisitorStatsAdminPage from './admin/pages/VisitorStatsAdminPage';
import AdminProfilePage from './admin/pages/AdminProfilePage';
import MediaManagerPage from './admin/pages/MediaManagerPage';

const rootRoute = createRootRoute({
  component: () => <RouterProvider router={router} />
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  )
});

const passengerVehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-keluarga',
  component: () => (
    <PublicLayout>
      <PassengerVehiclesPage />
    </PublicLayout>
  )
});

const passengerVehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-keluarga/$id',
  component: () => (
    <PublicLayout>
      <PassengerVehicleDetailPage />
    </PublicLayout>
  )
});

const commercialVehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-niaga',
  component: () => (
    <PublicLayout>
      <CommercialVehiclesPage />
    </PublicLayout>
  )
});

const commercialVehicleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-niaga/$id',
  component: () => (
    <PublicLayout>
      <CommercialVehicleDetailPage />
    </PublicLayout>
  )
});

const promoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/promo',
  component: () => (
    <PublicLayout>
      <PromoPage />
    </PublicLayout>
  )
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimoni',
  component: () => (
    <PublicLayout>
      <TestimonialsPage />
    </PublicLayout>
  )
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => (
    <PublicLayout>
      <BlogListPage />
    </PublicLayout>
  )
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$id',
  component: () => (
    <PublicLayout>
      <BlogDetailPage />
    </PublicLayout>
  )
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kontak',
  component: () => (
    <PublicLayout>
      <ContactPage />
    </PublicLayout>
  )
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <DashboardPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminVehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/vehicles',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <VehiclesAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminPromotionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/promotions',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <PromotionsAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/testimonials',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <TestimonialsAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/blog',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <BlogAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/leads',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <LeadsAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminStatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/stats',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <VisitorStatsAdminPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/profile',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <AdminProfilePage />
      </AdminLayout>
    </AdminGuard>
  )
});

const adminMediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/media',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <MediaManagerPage />
      </AdminLayout>
    </AdminGuard>
  )
});

const routeTree = rootRoute.addChildren([
  publicRoute,
  passengerVehiclesRoute,
  passengerVehicleDetailRoute,
  commercialVehiclesRoute,
  commercialVehicleDetailRoute,
  promoRoute,
  testimonialsRoute,
  blogRoute,
  blogDetailRoute,
  contactRoute,
  adminLoginRoute,
  adminRoute,
  adminVehiclesRoute,
  adminPromotionsRoute,
  adminTestimonialsRoute,
  adminBlogRoute,
  adminLeadsRoute,
  adminStatsRoute,
  adminProfileRoute,
  adminMediaRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
