import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useGetVehicles, useGetBlogPosts } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';
import { Search } from 'lucide-react';

export default function HomePage() {
  const { data: vehicles = [] } = useGetVehicles();
  const { data: blogPosts = [] } = useGetBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');

  const banners = [
    '/assets/generated/home-banner-1.dim_1920x720.png',
    '/assets/generated/home-banner-2.dim_1920x720.png',
    '/assets/generated/home-banner-3.dim_1920x720.png'
  ];

  const featuredVehicles = vehicles.slice(0, 4);
  const latestPosts = blogPosts.slice(0, 5);

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <section className="container mx-auto px-4 py-8">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-[300px] md:h-[500px] object-cover rounded-lg" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="bg-[#262729] py-12">
        <div className="container mx-auto px-4">
          <img src="/assets/generated/home-cta-banner.dim_1920x400.png" alt="CTA Banner" className="w-full h-[200px] md:h-[300px] object-cover rounded-lg" />
        </div>
      </section>

      <section className="bg-[#F1C40F] py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg max-w-3xl">
            We are your trusted automotive dealer in Subang, providing quality vehicles and excellent service for over a decade. Our commitment is to help you find the perfect vehicle for your needs.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Search Vehicles</h2>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by vehicle name..."
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

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Latest Blog Posts</h2>
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
