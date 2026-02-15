import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetVehicles, useGetBlogPosts } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';
import SectionTitle from '../components/public/SectionTitle';
import { Star, Info, Search, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { data: vehicles = [] } = useGetVehicles();
  const { data: blogPosts = [] } = useGetBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredVehicles = vehicles.slice(0, 4);
  const latestPosts = blogPosts.slice(0, 5);

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-0">
      <section className="container mx-auto px-4 pt-8 pb-12">
        <SectionTitle icon={Star} className="mb-6">
          Kendaraan Unggulan
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="bg-[#262729] py-0">
        <div className="w-full">
          <img 
            src="/assets/CTA Banner.png" 
            alt="CTA Banner" 
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <section className="bg-[#F1C40F] py-12">
        <div className="container mx-auto px-4">
          <SectionTitle icon={Info} className="mb-4">
            Tentang Kami
          </SectionTitle>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-center">
            Kami adalah dealer otomotif terpercaya di Subang, menyediakan kendaraan berkualitas dan layanan terbaik selama lebih dari satu dekade. Komitmen kami adalah membantu Anda menemukan kendaraan yang sempurna sesuai kebutuhan Anda.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionTitle icon={Search} className="mb-6">
          Cari Kendaraan
        </SectionTitle>
        <div className="flex gap-4 mb-6 max-w-2xl mx-auto">
          <Input
            placeholder="Cari berdasarkan nama kendaraan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-12">
        <SectionTitle icon={BookOpen} className="mb-6">
          Blog Terbaru
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link key={Number(post.id)} to="/blog/$id" params={{ id: post.id.toString() }} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={post.imageUrl || '/assets/generated/blog-placeholder.dim_1200x630.png'} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#C90010] transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.publishDate}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
