import { useGetVehicles } from '../hooks/useQueries';
import VehicleCard from '../components/vehicles/VehicleCard';
import SectionTitle from '../components/public/SectionTitle';
import { Truck } from 'lucide-react';

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
          <div className="text-center">Memuat kendaraan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 space-y-16">
        <div className="mb-10">
          <SectionTitle icon={Truck} className="mb-4">
            Mobil Niaga
          </SectionTitle>
          <p className="text-base md:text-lg text-gray-600">Kendaraan profesional yang dibangun untuk kebutuhan bisnis Anda</p>
        </div>

        {lightDuty.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ringan</h2>
              <p className="text-gray-600">Kendaraan niaga ringan yang efisien dan serbaguna</p>
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sedang</h2>
              <p className="text-gray-600">Truk tugas sedang yang tangguh untuk pekerjaan berat</p>
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kepala Traktor</h2>
              <p className="text-gray-600">Kepala traktor tugas berat untuk operasi jarak jauh</p>
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
            <p className="text-gray-500 text-lg">Tidak ada mobil niaga tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
