import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';
import SectionTitle from '../components/public/SectionTitle';
import { Car } from 'lucide-react';

export default function PassengerVehiclesPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  const passengerVehicles = vehicles.filter((v) => !v.isCommercial && v.published);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Memuat kendaraan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <SectionTitle icon={Car} className="mb-4">
            Mobil Keluarga
          </SectionTitle>
          <p className="text-base md:text-lg text-gray-600">Temukan berbagai pilihan kendaraan keluarga yang nyaman dan andal</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {passengerVehicles.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
        
        {passengerVehicles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Tidak ada mobil keluarga tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
