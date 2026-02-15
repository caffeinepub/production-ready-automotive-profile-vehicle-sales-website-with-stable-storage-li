import { useState } from 'react';
import { useGetMediaAssets, useDeleteMediaAsset } from '../../hooks/useAdminCmsQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaManagerPanel() {
  const { data: mediaAssets = [], isLoading, isError, error } = useGetMediaAssets();
  const deleteMediaAsset = useDeleteMediaAsset();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = mediaAssets.filter((asset) =>
    asset.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;

    try {
      await deleteMediaAsset.mutateAsync(id);
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete media');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading media library...</div>;
  }

  if (isError) {
    const errorMessage = error?.message || 'Unknown error';
    if (errorMessage.includes('session') || errorMessage.includes('Unauthorized')) {
      return (
        <div className="text-center py-8 text-gray-500">
          Session expired. Please refresh the page.
        </div>
      );
    }
    return (
      <div className="text-center py-8 text-red-500">
        Error loading media: {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? 'No media found matching your search.' : 'No media uploaded yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id.toString()} className="relative group border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {asset.typ.startsWith('image/') ? (
                  <img
                    src={asset.url}
                    alt="Media asset"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center p-4">
                    {asset.typ}
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(asset.id)}
                  disabled={deleteMediaAsset.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-2 bg-white border-t">
                <p className="text-xs text-gray-500 truncate">{asset.folder || 'General'}</p>
                <p className="text-xs text-gray-400">{(Number(asset.size) / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
