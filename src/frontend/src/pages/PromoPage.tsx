import { useGetPromotions } from '../hooks/useQueries';

export default function PromoPage() {
  const { data: promotions = [], isLoading } = useGetPromotions();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Current Promotions</h1>
      <div className="space-y-8">
        {promotions.map((promo) => (
          <div key={Number(promo.id)} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={promo.imageUrl || '/assets/generated/home-cta-banner.dim_1920x400.png'}
              alt={promo.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{promo.title}</h2>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              <p className="text-sm text-gray-500 mb-4">Valid until: {promo.validUntil}</p>
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Terms & Conditions:</h3>
                <p className="text-sm text-gray-600">{promo.terms}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {promotions.length === 0 && (
        <div className="text-center py-12 text-gray-500">No active promotions at the moment.</div>
      )}
    </div>
  );
}
