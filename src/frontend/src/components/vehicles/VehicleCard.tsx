import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Vehicle } from '../../backend';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const handleConsult = () => {
    window.open(`https://wa.me/6285212340778?text=Hi, I'm interested in ${vehicle.name}`, '_blank');
  };

  const detailPath = vehicle.isCommercial ? '/mobil-niaga/$id' : '/mobil-keluarga/$id';
  const placeholder = vehicle.isCommercial
    ? '/assets/generated/vehicle-commercial-placeholder.dim_1200x800.png'
    : '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={vehicle.imageUrl || placeholder} alt={vehicle.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{vehicle.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vehicle.description}</p>
        <p className="text-xl font-bold text-[#C90010] mb-4">
          Starting from Rp {Number(vehicle.price).toLocaleString('id-ID')}
        </p>
        {vehicle.commercialFeatures && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.commercialFeatures.economical && <Badge variant="secondary">Economical</Badge>}
            {vehicle.commercialFeatures.power && <Badge variant="secondary">Power</Badge>}
            {vehicle.commercialFeatures.speed && <Badge variant="secondary">Speed</Badge>}
            {vehicle.commercialFeatures.capacity && <Badge variant="secondary">Capacity</Badge>}
            {vehicle.commercialFeatures.bus && <Badge variant="secondary">Bus</Badge>}
            {vehicle.commercialFeatures.fourByTwo && <Badge variant="secondary">4x2</Badge>}
            {vehicle.commercialFeatures.sixByTwo && <Badge variant="secondary">6x2</Badge>}
            {vehicle.commercialFeatures.sixByFour && <Badge variant="secondary">6x4</Badge>}
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={handleConsult} variant="outline" className="flex-1">
            Consult
          </Button>
          <Link to={detailPath} params={{ id: vehicle.id.toString() }} className="flex-1">
            <Button className="w-full bg-[#C90010] hover:bg-[#a00010]">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
