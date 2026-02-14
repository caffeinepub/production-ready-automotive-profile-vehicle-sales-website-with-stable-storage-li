import { useState } from 'react';
import { useGetMediaAssets, useDeleteMediaAsset } from '../../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import type { MediaAsset } from '../../../backend';
import { toast } from 'sonner';

export default function MediaManagerPanel() {
  const { data: assets = [], isLoading } = useGetMediaAssets();
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
      toast.error('Failed to delete media');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading media...</div>;
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id.toString()} className="bg-white rounded-lg shadow-md overflow-hidden">
              {asset.typ.startsWith('image/') ? (
                <img src={asset.url} alt="" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-500">{asset.typ}</span>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate">{asset.folder}</p>
                <p className="text-xs text-gray-400">{(Number(asset.size) / 1024).toFixed(1)} KB</p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setDeleteItem(asset)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-gray-500">No media found</div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        description="Are you sure you want to delete this media file? This action cannot be undone."
        isDeleting={deleteMediaAsset.isPending}
      />
    </>
  );
}
