import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetVehicle, useGetProductInteraction, useLikeProduct, useShareProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share2, Download, Phone, Settings, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PassengerVehicleDetailPage() {
  const { id } = useParams({ from: '/mobil-keluarga/$id' });
  const { data: vehicle, isLoading } = useGetVehicle(BigInt(id));
  const { data: interaction } = useGetProductInteraction(BigInt(id));
  const likeProduct = useLikeProduct();
  const shareProduct = useShareProduct();
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Memuat kendaraan...</div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Kendaraan tidak ditemukan</div>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    likeProduct.mutate(BigInt(id));
    toast.success('Ditambahkan ke favorit!');
  };

  const handleShare = (platform: string) => {
    shareProduct.mutate({ itemId: BigInt(id), platform });
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=Lihat kendaraan ini: ${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Tautan disalin ke clipboard!');
    }
  };

  const currentVariant = vehicle.variants[selectedVariant];
  const totalPrice = Number(vehicle.price) + (currentVariant ? Number(currentVariant.priceAdjustment) : 0);
  const placeholder = '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png';
  const imageUrl = vehicle.imageUrl || placeholder;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gray-100 aspect-[4/3] lg:aspect-auto">
              <img
                src={imageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== placeholder) {
                    target.src = placeholder;
                  }
                }}
              />
            </div>

            {/* Info */}
            <div className="p-8 lg:p-10 flex flex-col">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{vehicle.name}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{vehicle.description}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                  <p className="text-3xl md:text-4xl font-bold text-[#C90010]">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </p>
                </div>

                {vehicle.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-900">Pilih Varian</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.variants.map((variant, index) => (
                        <Button
                          key={index}
                          variant={selectedVariant === index ? 'default' : 'outline'}
                          onClick={() => setSelectedVariant(index)}
                          className={selectedVariant === index ? 'bg-[#C90010] hover:bg-[#a00010]' : ''}
                        >
                          {variant.name}
                          {variant.isPremium && (
                            <Badge className="ml-2 bg-yellow-500 text-white border-0 text-xs">Premium</Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button onClick={handleLike} variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    Suka ({interaction ? Number(interaction.likes) : 0})
                  </Button>
                  <Button onClick={() => handleShare('copy')} variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Bagikan
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.open(`https://wa.me/6285212340778?text=Halo, saya tertarik dengan ${vehicle.name}`, '_blank')} 
                    className="flex-1 bg-[#398E3D] hover:bg-[#2d7030] text-white h-12"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Hubungi Sales
                  </Button>
                  {vehicle.brochure && (
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12"
                      onClick={() => window.open(vehicle.brochure, '_blank')}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Brosur
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
              <TabsTrigger value="features">Fitur</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-7 w-7 text-[#C90010]" />
                <h3 className="font-bold text-xl md:text-2xl text-gray-900">Spesifikasi Teknis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Mesin</p>
                  <p className="text-gray-600">{vehicle.specs.engine || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Transmisi</p>
                  <p className="text-gray-600">{vehicle.specs.transmission || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Dimensi</p>
                  <p className="text-gray-600">{vehicle.specs.dimensions || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Berat</p>
                  <p className="text-gray-600">{vehicle.specs.weight || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Kapasitas Bahan Bakar</p>
                  <p className="text-gray-600">{vehicle.specs.fuelCapacity || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Suspensi</p>
                  <p className="text-gray-600">{vehicle.specs.suspension || '—'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-7 w-7 text-[#C90010]" />
                <h3 className="font-bold text-xl md:text-2xl text-gray-900">Fitur Utama</h3>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  {currentVariant?.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#C90010] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {vehicle.specs.additionalFeatures.map((feature, index) => (
                    <li key={`add-${index}`} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#C90010] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {(!currentVariant || currentVariant.features.length === 0) && 
                   vehicle.specs.additionalFeatures.length === 0 && (
                    <li className="text-gray-500 italic">Tidak ada fitur yang tercantum</li>
                  )}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
