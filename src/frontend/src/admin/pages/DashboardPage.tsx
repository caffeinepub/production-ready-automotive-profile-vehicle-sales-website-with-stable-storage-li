import { useGetVehicles, useGetPromotions, useGetTestimonials, useGetBlogPosts } from '../../hooks/useQueries';
import { useGetContacts, useGetCreditSimulations } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Gift, MessageSquare, FileText, Mail, Calculator } from 'lucide-react';

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
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Promotions',
      value: promotions.length,
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Contact Forms',
      value: contacts.length,
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Credit Simulations',
      value: simulations.length,
      icon: Calculator,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your content management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
