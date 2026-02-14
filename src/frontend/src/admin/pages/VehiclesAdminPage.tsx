import { useGetVehicles } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function VehiclesAdminPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vehicles Management</h1>
        <Button className="bg-[#C90010] hover:bg-[#a00010]">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Total Vehicles: {vehicles.length}</p>
        <p className="text-sm text-gray-500 mt-2">Full CRUD interface would be implemented here</p>
      </div>
    </div>
  );
}
