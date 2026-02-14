import { useParams } from '@tanstack/react-router';
import { useGetVehicle, useGetProductInteraction, useLikeProduct, useShareProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share2, Download, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CommercialVehicleDetailPage() {
  const { id } = useParams({ from: '/mobil-niaga/$id' });
  const { data: vehicle, isLoading } = useGetVehicle(BigInt(id));
  const { data: interaction } = useGetProductInteraction(BigInt(id));
  const likeProduct = useLikeProduct();
  const shareProduct = useShareProduct();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading vehicle...</div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Vehicle not found</div>
        </div>
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

  const placeholder = '/assets/generated/vehicle-commercial-placeholder.dim_1200x800.png';
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{vehicle.name}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{vehicle.description}</p>

                {vehicle.commercialFeatures && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {vehicle.commercialFeatures.economical && <Badge variant="outline">Economical</Badge>}
                    {vehicle.commercialFeatures.power && <Badge variant="outline">Power</Badge>}
                    {vehicle.commercialFeatures.speed && <Badge variant="outline">Speed</Badge>}
                    {vehicle.commercialFeatures.capacity && <Badge variant="outline">Capacity</Badge>}
                    {vehicle.commercialFeatures.bus && <Badge variant="outline">Bus</Badge>}
                    {vehicle.commercialFeatures.fourByTwo && <Badge variant="outline">4x2</Badge>}
                    {vehicle.commercialFeatures.sixByTwo && <Badge variant="outline">6x2</Badge>}
                    {vehicle.commercialFeatures.sixByFour && <Badge variant="outline">6x4</Badge>}
                  </div>
                )}

                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Chassis Price</p>
                  <p className="text-4xl font-bold text-[#C90010] mb-2">
                    Rp {Number(vehicle.price).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">*Price excludes bodywork/karoseri</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button onClick={handleLike} variant="outline" className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    Like ({interaction ? Number(interaction.likes) : 0})
                  </Button>
                  <Button onClick={() => handleShare('copy')} variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.open(`https://wa.me/6285212340778?text=Hi, I'm interested in ${vehicle.name}`, '_blank')} 
                    className="flex-1 bg-[#398E3D] hover:bg-[#2d7030] text-white h-12"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Sales
                  </Button>
                  {vehicle.brochure && (
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12"
                      onClick={() => window.open(vehicle.brochure, '_blank')}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Brochure
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
              <TabsTrigger value="specs">Technical Specifications</TabsTrigger>
              <TabsTrigger value="features">Key Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="space-y-4">
              <h3 className="font-bold text-2xl mb-6 text-gray-900">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Engine</p>
                  <p className="text-gray-600">{vehicle.specs.engine || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Transmission</p>
                  <p className="text-gray-600">{vehicle.specs.transmission || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Dimensions</p>
                  <p className="text-gray-600">{vehicle.specs.dimensions || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Weight</p>
                  <p className="text-gray-600">{vehicle.specs.weight || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Fuel Capacity</p>
                  <p className="text-gray-600">{vehicle.specs.fuelCapacity || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-1">Suspension</p>
                  <p className="text-gray-600">{vehicle.specs.suspension || '—'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="font-bold text-2xl mb-6 text-gray-900">Key Features</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  {vehicle.specs.additionalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#C90010] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {vehicle.specs.additionalFeatures.length === 0 && (
                    <li className="text-gray-500 italic">No features listed</li>
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
