import { useState } from 'react';
import { useGetBlogPosts } from '../../hooks/useQueries';
import { useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CrudTable from '../components/CrudTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import BlogFormDialog from '../components/BlogFormDialog';
import AdminPageHeader from '../components/AdminPageHeader';
import type { BlogPost } from '../../backend';
import { toast } from 'sonner';

export default function BlogAdminPage() {
  const { data: blogPosts = [], isLoading } = useGetBlogPosts();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<BlogPost | null>(null);
  const [deleteItem, setDeleteItem] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredBlogPosts = blogPosts.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (blogPost: BlogPost) => {
    setEditItem(blogPost);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await deleteBlogPost.mutateAsync(deleteItem.id);
      toast.success('Blog post deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Session expired') || errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleSave = async (blogPost: BlogPost) => {
    try {
      if (editItem) {
        await updateBlogPost.mutateAsync(blogPost);
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost.mutateAsync(blogPost);
        toast.success('Blog post created successfully');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Session expired') || errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to save blog post');
      }
      // Don't close the dialog on error so user can retry after re-login
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'publishDate', label: 'Publish Date' },
    { 
      key: 'views', 
      label: 'Views',
      render: (b: BlogPost) => Number(b.views).toLocaleString()
    }
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div>
        <AdminPageHeader
          title="Blog Management"
          action={
            <Button 
              className="admin-btn-primary"
              onClick={() => {
                setEditItem(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Blog Post
            </Button>
          }
        />

        <CrudTable
          data={filteredBlogPosts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search blog posts..."
          getItemKey={(b) => b.id.toString()}
          showPublished
        />
      </div>

      <BlogFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditItem(null);
        }}
        blogPost={editItem}
        onSave={handleSave}
        isSaving={createBlogPost.isPending || updateBlogPost.isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isDeleting={deleteBlogPost.isPending}
      />
    </>
  );
}
