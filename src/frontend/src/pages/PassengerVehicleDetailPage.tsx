import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetVehicle, useGetProductInteraction, useLikeProduct, useShareProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share2, Download } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading vehicle...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Vehicle not found</div>
      </div>
    );
  }

  const handleLike = () => {
    likeProduct.mutate(BigInt(id));
    toast.success('Added to favorites!');
  };

  const handleShare = (platform: string) => {
    shareProduct.mutate({ itemId: BigInt(id), platform });
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=Check out this vehicle: ${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const currentVariant = vehicle.variants[selectedVariant];
  const totalPrice = Number(vehicle.price) + (currentVariant ? Number(currentVariant.priceAdjustment) : 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div>
          <img
            src={vehicle.imageUrl || '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png'}
            alt={vehicle.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{vehicle.name}</h1>
          <p className="text-gray-600 mb-6">{vehicle.description}</p>
          <p className="text-3xl font-bold text-[#C90010] mb-6">Rp {totalPrice.toLocaleString('id-ID')}</p>

          {vehicle.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">Select Variant:</h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={selectedVariant === index ? 'default' : 'outline'}
                    onClick={() => setSelectedVariant(index)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <Button onClick={handleLike} variant="outline" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Like ({interaction ? Number(interaction.likes) : 0})
            </Button>
            <Button onClick={() => handleShare('copy')} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => window.open(`https://wa.me/6285212340778?text=Hi, I'm interested in ${vehicle.name}`, '_blank')} className="flex-1 bg-[#398E3D] hover:bg-[#2d7030]">
              Contact Sales
            </Button>
            {vehicle.brochure && (
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Brochure
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-xl mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Engine:</p>
                <p className="text-gray-600">{vehicle.specs.engine}</p>
              </div>
              <div>
                <p className="font-semibold">Transmission:</p>
                <p className="text-gray-600">{vehicle.specs.transmission}</p>
              </div>
              <div>
                <p className="font-semibold">Dimensions:</p>
                <p className="text-gray-600">{vehicle.specs.dimensions}</p>
              </div>
              <div>
                <p className="font-semibold">Weight:</p>
                <p className="text-gray-600">{vehicle.specs.weight}</p>
              </div>
              <div>
                <p className="font-semibold">Fuel Capacity:</p>
                <p className="text-gray-600">{vehicle.specs.fuelCapacity}</p>
              </div>
              <div>
                <p className="font-semibold">Suspension:</p>
                <p className="text-gray-600">{vehicle.specs.suspension}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="features" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-xl mb-4">Key Features</h3>
            <ul className="list-disc list-inside space-y-2">
              {currentVariant?.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
              {vehicle.specs.additionalFeatures.map((feature, index) => (
                <li key={`add-${index}`} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
