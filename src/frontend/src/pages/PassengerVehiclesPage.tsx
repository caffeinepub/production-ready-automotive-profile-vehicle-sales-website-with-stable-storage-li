import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function PassengerVehiclesPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  const passengerVehicles = vehicles.filter((v) => !v.isCommercial && v.published);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Passenger Vehicles</h1>
          <p className="text-lg text-gray-600">Discover our range of comfortable and reliable passenger vehicles</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {passengerVehicles.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
        
        {passengerVehicles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No passenger vehicles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
