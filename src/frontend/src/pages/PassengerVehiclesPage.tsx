import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function PassengerVehiclesPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  const passengerVehicles = vehicles.filter((v) => !v.isCommercial);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Passenger Vehicles</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {passengerVehicles.map((vehicle) => (
          <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
        ))}
      </div>
      {passengerVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">No passenger vehicles available at the moment.</div>
      )}
    </div>
  );
}
