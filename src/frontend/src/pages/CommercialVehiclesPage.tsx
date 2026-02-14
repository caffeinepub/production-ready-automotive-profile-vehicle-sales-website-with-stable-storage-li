import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function CommercialVehiclesPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  const commercialVehicles = vehicles.filter((v) => v.isCommercial);

  const lightDuty = commercialVehicles.filter((v) => 
    v.name.toLowerCase().includes('canter') || v.name.toLowerCase().includes('ecanter')
  );
  const mediumDuty = commercialVehicles.filter((v) => 
    v.name.toLowerCase().includes('fighter') && !v.name.toLowerCase().includes('th')
  );
  const tractorHead = commercialVehicles.filter((v) => 
    v.name.toLowerCase().includes('th')
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-bold">Commercial Vehicles</h1>

      <section>
        <h2 className="text-3xl font-bold mb-6">Light Duty</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lightDuty.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Medium Duty</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediumDuty.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Tractor Head</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tractorHead.map((vehicle) => (
            <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {commercialVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">No commercial vehicles available at the moment.</div>
      )}
    </div>
  );
}
