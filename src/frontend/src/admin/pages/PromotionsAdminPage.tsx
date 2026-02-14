import { useState } from 'react';
import { useGetPromotions } from '../../hooks/useQueries';
import { useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CrudTable from '../components/CrudTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import PromotionFormDialog from '../components/PromotionFormDialog';
import type { Promotion } from '../../backend';
import { toast } from 'sonner';

export default function PromotionsAdminPage() {
  const { data: promotions = [], isLoading } = useGetPromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();
  
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<Promotion | null>(null);
  const [deleteItem, setDeleteItem] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredPromotions = promotions.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (promotion: Promotion) => {
    setEditItem(promotion);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await deletePromotion.mutateAsync(deleteItem.id);
      toast.success('Promotion deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete promotion');
    }
  };

  const handleSave = async (promotion: Promotion) => {
    try {
      if (editItem) {
        await updatePromotion.mutateAsync(promotion);
        toast.success('Promotion updated successfully');
      } else {
        await createPromotion.mutateAsync(promotion);
        toast.success('Promotion created successfully');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save promotion');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'validUntil', label: 'Valid Until' },
    { 
      key: 'description', 
      label: 'Description',
      render: (p: Promotion) => p.description.substring(0, 50) + '...'
    }
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Promotions Management</h1>
          <Button 
            className="bg-[#C90010] hover:bg-[#a00010]"
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
        </div>

        <CrudTable
          data={filteredPromotions}
          columns={columns}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search promotions..."
          getItemKey={(p) => p.id.toString()}
          showPublished
        />
      </div>

      <PromotionFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditItem(null);
        }}
        promotion={editItem}
        onSave={handleSave}
        isSaving={createPromotion.isPending || updatePromotion.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Promotion"
        description="Are you sure you want to delete this promotion? This action cannot be undone."
        isDeleting={deletePromotion.isPending}
      />
    </>
  );
}
