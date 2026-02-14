import { useState } from 'react';
import { useGetMediaAssets, useDeleteMediaAsset } from '../../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import type { MediaAsset } from '../../../backend';
import { toast } from 'sonner';

export default function MediaManagerPanel() {
  const { data: assets = [], isLoading, error } = useGetMediaAssets();
  const deleteMediaAsset = useDeleteMediaAsset();
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState<MediaAsset | null>(null);

  const filteredAssets = assets.filter((asset) =>
    asset.url.toLowerCase().includes(search.toLowerCase()) ||
    asset.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await deleteMediaAsset.mutateAsync(deleteItem.id);
      toast.success('Media deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Session expired') || errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to delete media');
      }
    }
  };

  const isAuthError = error instanceof Error && 
    (error.message.includes('Session expired') || 
     error.message.includes('unauthorized') ||
     error.message.includes('session required'));

  if (isLoading) {
    return <div className="text-center py-8">Loading media...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {isAuthError ? (
          <>
            <p className="font-semibold mb-2">Session Expired</p>
            <p className="text-sm">Your admin session has expired. Please log in again to access media.</p>
          </>
        ) : (
          <>Error loading media: {error instanceof Error ? error.message : 'Unknown error'}</>
        )}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No media yet.</p>
        <p className="text-sm mt-2">Upload your first media asset to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No media found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id.toString()} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {asset.typ.startsWith('image/') ? (
                    <img 
                      src={asset.url} 
                      alt="Media asset" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">{asset.typ}</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 truncate mb-2">{asset.folder}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {(Number(asset.size) / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteItem(asset)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        description="Are you sure you want to delete this media asset? This action cannot be undone."
        isDeleting={deleteMediaAsset.isPending}
      />
    </>
  );
}
