import { useState, useMemo } from 'react';
import { useGetVehicles } from '../../hooks/useQueries';
import { useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CrudTable from '../components/CrudTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import VehicleFormDialog from '../components/VehicleFormDialog';
import AdminPageHeader from '../components/AdminPageHeader';
import type { Vehicle } from '../../backend';
import { toast } from 'sonner';
import { useSearch } from '@tanstack/react-router';

export default function VehiclesAdminPage() {
  const { data: vehicles = [], isLoading } = useGetVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  
  const searchParams = useSearch({ from: '/admin/vehicles' }) as { category?: string };
  const category = searchParams.category || 'passenger';
  
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<Vehicle | null>(null);
  const [deleteItem, setDeleteItem] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesCategory = category === 'passenger' ? !v.isCommercial : v.isCommercial;
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [vehicles, category, search]);

  const handleEdit = (vehicle: Vehicle) => {
    setEditItem(vehicle);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await deleteVehicle.mutateAsync(deleteItem.id);
      toast.success('Vehicle deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Session expired') || errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const handleSave = async (vehicle: Vehicle) => {
    try {
      if (editItem) {
        await updateVehicle.mutateAsync(vehicle);
        toast.success('Vehicle updated successfully');
      } else {
        await createVehicle.mutateAsync(vehicle);
        toast.success('Vehicle created successfully');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Session expired') || errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to save vehicle');
      }
      // Don't close the dialog on error so user can retry after re-login
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'price', 
      label: 'Price',
      render: (v: Vehicle) => `Rp ${Number(v.price).toLocaleString()}`
    },
    { 
      key: 'variants', 
      label: 'Variants',
      render: (v: Vehicle) => v.variants.length
    }
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div>
        <AdminPageHeader
          title={category === 'passenger' ? 'Passenger Vehicles' : 'Commercial Vehicles'}
          subtitle={`Manage ${category} vehicles`}
          action={
            <Button 
              className="admin-btn-primary"
              onClick={() => {
                setEditItem(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          }
        />

        <CrudTable
          data={filteredVehicles}
          columns={columns}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search vehicles..."
          getItemKey={(v) => v.id.toString()}
          showPublished
        />
      </div>

      <VehicleFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditItem(null);
        }}
        vehicle={editItem}
        onSave={handleSave}
        isSaving={createVehicle.isPending || updateVehicle.isPending}
        isCommercial={category === 'commercial'}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
        isDeleting={deleteVehicle.isPending}
      />
    </>
  );
}
