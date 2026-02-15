import { useParams, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetVehicle } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Calculator, Truck } from 'lucide-react';
import SectionTitle from '../components/public/SectionTitle';

export default function CommercialVehicleDetailPage() {
  const { id } = useParams({ from: '/mobil-niaga/$id' });
  const vehicleId = BigInt(id);
  const { data: vehicle, isLoading } = useGetVehicle(vehicleId);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Memuat detail kendaraan...</div>;
  }

  if (!vehicle) {
    return <div className="container mx-auto px-4 py-8 text-center">Kendaraan tidak ditemukan.</div>;
  }

  const currentVariant = vehicle.variants[selectedVariant];
  const finalPrice = Number(vehicle.price) + Number(currentVariant?.priceAdjustment || 0n);

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Halo, saya tertarik dengan ${vehicle.name} ${currentVariant?.name || ''}`);
    window.open(`https://wa.me/6285212340778?text=${message}`, '_blank');
  };

  const handleCallContact = () => {
    window.location.href = 'tel:+6285212340778';
  };

  const handleCreditSimulation = () => {
    window.location.href = '/kontak';
  };

  const commercialFeatures = vehicle.commercialFeatures;
  const activeFeatures = commercialFeatures ? [
    commercialFeatures.economical && 'Ekonomis',
    commercialFeatures.power && 'Bertenaga',
    commercialFeatures.speed && 'Cepat',
    commercialFeatures.capacity && 'Kapasitas Besar',
    commercialFeatures.bus && 'Bus',
    commercialFeatures.fourByTwo && '4x2',
    commercialFeatures.sixByTwo && '6x2',
    commercialFeatures.sixByFour && '6x4',
  ].filter(Boolean) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/mobil-niaga" className="inline-flex items-center gap-2 text-[#C90010] hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Mobil Niaga
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div>
          <SectionTitle icon={Truck}>{vehicle.name}</SectionTitle>
          <p className="text-gray-600 mt-4 mb-4">{vehicle.description}</p>

          {activeFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-[#C90010] text-white">
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Pilih Varian:</h3>
            <div className="grid grid-cols-1 gap-2">
              {vehicle.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(index)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedVariant === index
                      ? 'border-[#C90010] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{variant.name}</span>
                    {variant.isPremium && (
                      <Badge className="bg-[#C90010]">Premium</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Harga Mulai Dari</p>
            <p className="text-3xl font-bold text-[#C90010]">
              Rp {finalPrice.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={handleCallContact} className="bg-[#C90010] hover:bg-[#a00010]">
              <Phone className="mr-2 h-4 w-4" />
              Telepon
            </Button>
            <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button onClick={handleCreditSimulation} variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              Simulasi Kredit
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="specs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
              <TabsTrigger value="features">Fitur</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Mesin</h4>
                  <p className="text-gray-600">{vehicle.specs.engine}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transmisi</h4>
                  <p className="text-gray-600">{vehicle.specs.transmission}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dimensi</h4>
                  <p className="text-gray-600">{vehicle.specs.dimensions}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Berat</h4>
                  <p className="text-gray-600">{vehicle.specs.weight}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kapasitas Bahan Bakar</h4>
                  <p className="text-gray-600">{vehicle.specs.fuelCapacity}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Suspensi</h4>
                  <p className="text-gray-600">{vehicle.specs.suspension}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Fitur Varian {currentVariant?.name}</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentVariant?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-[#C90010]">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {vehicle.specs.additionalFeatures.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Fitur Tambahan</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vehicle.specs.additionalFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-[#C90010]">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
