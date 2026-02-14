import { useGetVehicles, useGetPromotions, useGetTestimonials, useGetBlogPosts } from '../../hooks/useQueries';
import { useGetContacts, useGetCreditSimulations } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, FileText, Star, MessageSquare, Users, Calculator } from 'lucide-react';

export default function DashboardPage() {
  const { data: vehicles = [] } = useGetVehicles();
  const { data: promotions = [] } = useGetPromotions();
  const { data: testimonials = [] } = useGetTestimonials();
  const { data: blogPosts = [] } = useGetBlogPosts();
  const { data: contacts = [] } = useGetContacts();
  const { data: simulations = [] } = useGetCreditSimulations();

  const stats = [
    { 
      label: 'Total Vehicles', 
      value: vehicles.length, 
      icon: Car,
      color: 'bg-blue-500' 
    },
    { 
      label: 'Active Promotions', 
      value: promotions.filter(p => p.published).length, 
      icon: FileText,
      color: 'bg-green-500' 
    },
    { 
      label: 'Testimonials', 
      value: testimonials.length, 
      icon: Star,
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Blog Posts', 
      value: blogPosts.length, 
      icon: MessageSquare,
      color: 'bg-purple-500' 
    },
    { 
      label: 'Contact Leads', 
      value: contacts.length, 
      icon: Users,
      color: 'bg-red-500' 
    },
    { 
      label: 'Credit Simulations', 
      value: simulations.length, 
      icon: Calculator,
      color: 'bg-orange-500' 
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
