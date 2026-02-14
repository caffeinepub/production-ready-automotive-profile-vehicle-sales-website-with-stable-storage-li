import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car } from 'lucide-react';
import type { Vehicle } from '../../backend';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const handleConsult = () => {
    window.open(`https://wa.me/6285212340778?text=Halo, saya tertarik dengan ${vehicle.name}`, '_blank');
  };

  const detailPath = vehicle.isCommercial ? '/mobil-niaga/$id' : '/mobil-keluarga/$id';
  const placeholder = vehicle.isCommercial
    ? '/assets/generated/vehicle-commercial-placeholder.dim_1200x800.png'
    : '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png';

  const imageUrl = vehicle.imageUrl || placeholder;

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Link to={detailPath} params={{ id: vehicle.id.toString() }} className="block">
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
          <img 
            src={imageUrl} 
            alt={vehicle.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== placeholder) {
                target.src = placeholder;
              }
            }}
          />
          {vehicle.variants.some(v => v.isPremium) && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white border-0">Premium</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={detailPath} params={{ id: vehicle.id.toString() }}>
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#C90010] transition-colors line-clamp-1">
            {vehicle.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {vehicle.description}
        </p>
        
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
          <p className="text-2xl font-bold text-[#C90010]">
            Rp {Number(vehicle.price).toLocaleString('id-ID')}
          </p>
        </div>

        {vehicle.commercialFeatures && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vehicle.commercialFeatures.economical && <Badge variant="outline" className="text-xs">Ekonomis</Badge>}
            {vehicle.commercialFeatures.power && <Badge variant="outline" className="text-xs">Bertenaga</Badge>}
            {vehicle.commercialFeatures.speed && <Badge variant="outline" className="text-xs">Cepat</Badge>}
            {vehicle.commercialFeatures.capacity && <Badge variant="outline" className="text-xs">Kapasitas</Badge>}
          </div>
        )}

        <div className="flex gap-2">
          <Link to={detailPath} params={{ id: vehicle.id.toString() }} className="flex-1">
            <Button variant="outline" className="w-full border-[#C90010] text-[#C90010] hover:bg-[#C90010] hover:text-white transition-colors">
              <Car className="mr-2 h-4 w-4" />
              Detail
            </Button>
          </Link>
          <Button 
            onClick={handleConsult} 
            className="flex-1 bg-[#398E3D] hover:bg-[#2d7030] text-white transition-colors"
          >
            Konsultasi
          </Button>
        </div>
      </div>
    </div>
  );
}
