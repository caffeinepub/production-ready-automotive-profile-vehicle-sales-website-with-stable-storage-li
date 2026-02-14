import { useGetPromotions } from '../hooks/useQueries';
import SectionTitle from '../components/public/SectionTitle';
import { Tag, FileText } from 'lucide-react';

export default function PromoPage() {
  const { data: promotions = [], isLoading } = useGetPromotions();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Memuat promo...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionTitle icon={Tag} className="mb-8">
        Promo Terkini
      </SectionTitle>
      <div className="space-y-8">
        {promotions.map((promo) => (
          <div key={Number(promo.id)} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={promo.imageUrl || '/assets/generated/home-cta-banner.dim_1920x400.png'}
              alt={promo.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{promo.title}</h2>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              <p className="text-sm text-gray-500 mb-4">Berlaku hingga: {promo.validUntil}</p>
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-[#C90010]" />
                  <h3 className="font-bold">Syarat & Ketentuan:</h3>
                </div>
                <p className="text-sm text-gray-600">{promo.terms}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {promotions.length === 0 && (
        <div className="text-center py-12 text-gray-500">Tidak ada promo aktif saat ini.</div>
      )}
    </div>
  );
}
