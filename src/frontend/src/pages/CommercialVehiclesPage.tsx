import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function CommercialVehiclesPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  const commercialVehicles = vehicles.filter((v) => v.isCommercial && v.published);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 space-y-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Commercial Vehicles</h1>
          <p className="text-lg text-gray-600">Professional vehicles built for your business needs</p>
        </div>

        {lightDuty.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Light Duty</h2>
              <p className="text-gray-600">Efficient and versatile light commercial vehicles</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lightDuty.map((vehicle) => (
                <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
              ))}
            </div>
          </section>
        )}

        {mediumDuty.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Medium Duty</h2>
              <p className="text-gray-600">Powerful medium-duty trucks for demanding tasks</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediumDuty.map((vehicle) => (
                <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
              ))}
            </div>
          </section>
        )}

        {tractorHead.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tractor Head</h2>
              <p className="text-gray-600">Heavy-duty tractor heads for long-haul operations</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tractorHead.map((vehicle) => (
                <VehicleCard key={Number(vehicle.id)} vehicle={vehicle} />
              ))}
            </div>
          </section>
        )}

        {commercialVehicles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No commercial vehicles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
