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

      {filteredAssets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No media found matching your search.' : 'No media yet.'}
        </div>
      )}

      {filteredAssets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isImage = asset.typ.startsWith('image/');
            const isVideo = asset.typ.startsWith('video/');

            return (
              <div
                key={asset.id.toString()}
                className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {isImage && (
                    <img
                      src={asset.url}
                      alt="Media asset"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/generated/vehicle-passenger-placeholder.dim_1200x800.png';
                      }}
                    />
                  )}
                  {isVideo && (
                    <video
                      src={asset.url}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  {!isImage && !isVideo && (
                    <div className="text-gray-400 text-sm text-center p-4">
                      {asset.typ || 'Unknown type'}
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(asset.id)}
                    disabled={deleteMediaAsset.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-500 truncate">{asset.folder}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
