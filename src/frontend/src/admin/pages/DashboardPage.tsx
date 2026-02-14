import { useGetVehicles, useGetPromotions, useGetTestimonials, useGetBlogPosts, useGetContacts, useGetCreditSimulations } from '../../hooks/useQueries';

export default function DashboardPage() {
  const { data: vehicles = [] } = useGetVehicles();
  const { data: promotions = [] } = useGetPromotions();
  const { data: testimonials = [] } = useGetTestimonials();
  const { data: blogPosts = [] } = useGetBlogPosts();
  const { data: contacts = [] } = useGetContacts();
  const { data: simulations = [] } = useGetCreditSimulations();

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length, color: 'bg-blue-500' },
    { label: 'Active Promotions', value: promotions.length, color: 'bg-green-500' },
    { label: 'Testimonials', value: testimonials.length, color: 'bg-yellow-500' },
    { label: 'Blog Posts', value: blogPosts.length, color: 'bg-purple-500' },
    { label: 'Contact Leads', value: contacts.length, color: 'bg-red-500' },
    { label: 'Credit Simulations', value: simulations.length, color: 'bg-orange-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md">
            <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4`}></div>
            <h3 className="text-gray-600 text-sm mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
