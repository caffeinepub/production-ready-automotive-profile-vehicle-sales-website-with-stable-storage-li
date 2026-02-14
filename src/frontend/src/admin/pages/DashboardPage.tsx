import { useGetVehicles, useGetPromotions, useGetTestimonials, useGetBlogPosts } from '../../hooks/useQueries';
import { useGetContacts, useGetCreditSimulations } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Gift, MessageSquare, FileText, Mail, Calculator } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader';

export default function DashboardPage() {
  const { data: vehicles = [] } = useGetVehicles();
  const { data: promotions = [] } = useGetPromotions();
  const { data: testimonials = [] } = useGetTestimonials();
  const { data: blogPosts = [] } = useGetBlogPosts();
  const { data: contacts = [] } = useGetContacts();
  const { data: simulations = [] } = useGetCreditSimulations();

  const stats = [
    {
      title: 'Vehicles',
      value: vehicles.length,
      icon: Car
    },
    {
      title: 'Promotions',
      value: promotions.length,
      icon: Gift
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquare
    },
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      icon: FileText
    },
    {
      title: 'Contact Forms',
      value: contacts.length,
      icon: Mail
    },
    {
      title: 'Credit Simulations',
      value: simulations.length,
      icon: Calculator
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of your content management system"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="admin-stat-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="admin-stat-title">
                  {stat.title}
                </CardTitle>
                <div className="admin-stat-icon-wrapper">
                  <Icon className="admin-stat-icon h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="admin-stat-value">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
