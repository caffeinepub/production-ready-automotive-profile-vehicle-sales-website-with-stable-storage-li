import { useGetVehicles, useGetBlogPosts, useGetPublicSiteBanners } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import SectionTitle from '../components/public/SectionTitle';

export default function HomePage() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehicles();
  const { data: blogPosts = [], isLoading: blogLoading } = useGetBlogPosts();
  const { data: banners } = useGetPublicSiteBanners();

  const publishedVehicles = vehicles.filter((v) => v.published);
  const featuredVehicles = publishedVehicles.slice(0, 6);

  const publishedBlogPosts = blogPosts.filter((p) => p.published);
  const latestBlogPosts = publishedBlogPosts.slice(0, 3);

  // Use configured main banner or fallback to default
  const mainBannerUrl = banners?.mainBanner || '/assets/generated/home-banner-1.dim_1920x720.png';
  
  // Use configured CTA banner or fallback to default
  const ctaBannerUrl = banners?.ctaBanner || '/assets/generated/home-cta-banner.dim_1920x400.png';

  return (
    <div className="w-full">
      {/* Main Banner - replaces hero section on home page */}
      <section className="w-full">
        <img
          src={mainBannerUrl}
          alt="Mitsubishi Motors Banner"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Featured Vehicles Section */}
      <section className="container mx-auto px-4 py-16">
        <SectionTitle icon={Search}>Kendaraan Unggulan</SectionTitle>

        {vehiclesLoading ? (
          <div className="text-center py-8">Memuat kendaraan...</div>
        ) : featuredVehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada kendaraan tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id.toString()} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner Section - full bleed */}
      <section className="w-full">
        <img
          src={ctaBannerUrl}
          alt="Mitsubishi CTA Banner"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <SectionTitle icon={MessageSquare}>Tentang Kami</SectionTitle>

        <Card className="max-w-4xl mx-auto mt-8">
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Selamat datang di dealer resmi Mitsubishi Motors. Kami berkomitmen untuk memberikan
              layanan terbaik dan kendaraan berkualitas tinggi untuk memenuhi kebutuhan mobilitas Anda.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dengan berbagai pilihan kendaraan keluarga dan niaga, kami siap membantu Anda menemukan
              kendaraan yang sempurna untuk gaya hidup dan bisnis Anda.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <SectionTitle icon={MessageSquare}>Artikel Terbaru</SectionTitle>

        {blogLoading ? (
          <div className="text-center py-8">Memuat artikel...</div>
        ) : latestBlogPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada artikel tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {latestBlogPosts.map((post) => (
              <Link
                key={post.id.toString()}
                to="/blog/$id"
                params={{ id: post.id.toString() }}
                className="block group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C90010] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{post.publishDate}</p>
                    <p className="text-gray-600 line-clamp-3">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {latestBlogPosts.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-[#C90010] text-white rounded-lg hover:bg-[#a00010] transition-colors"
            >
              Lihat Semua Artikel
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
