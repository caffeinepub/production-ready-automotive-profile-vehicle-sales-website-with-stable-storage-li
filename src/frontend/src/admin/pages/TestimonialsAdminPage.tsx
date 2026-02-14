import { useState } from 'react';
import { useGetTestimonials } from '../../hooks/useQueries';
import { useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CrudTable from '../components/CrudTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import TestimonialFormDialog from '../components/TestimonialFormDialog';
import type { Testimonial } from '../../backend';
import { toast } from 'sonner';

export default function TestimonialsAdminPage() {
  const { data: testimonials = [], isLoading } = useGetTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredTestimonials = testimonials.filter((t) =>
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (testimonial: Testimonial) => {
    setEditItem(testimonial);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await deleteTestimonial.mutateAsync(deleteItem.id);
      toast.success('Testimonial deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleSave = async (testimonial: Testimonial) => {
    try {
      if (editItem) {
        await updateTestimonial.mutateAsync(testimonial);
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonial.mutateAsync(testimonial);
        toast.success('Testimonial created successfully');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'city', label: 'City' },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (t: Testimonial) => `${t.rating} ⭐`
    },
    { 
      key: 'review', 
      label: 'Review',
      render: (t: Testimonial) => t.review.substring(0, 50) + '...'
    }
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <Button 
            className="bg-[#C90010] hover:bg-[#a00010]"
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        <CrudTable
          data={filteredTestimonials}
          columns={columns}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search testimonials..."
          getItemKey={(t) => t.id.toString()}
          showPublished
        />
      </div>

      <TestimonialFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditItem(null);
        }}
        testimonial={editItem}
        onSave={handleSave}
        isSaving={createTestimonial.isPending || updateTestimonial.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        isDeleting={deleteTestimonial.isPending}
      />
    </>
  );
}
