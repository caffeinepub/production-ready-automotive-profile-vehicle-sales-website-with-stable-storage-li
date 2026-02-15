import { useState } from 'react';
import { useGetMediaAssets } from '../../hooks/useAdminCmsQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  folder?: string;
}

export default function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  folder,
}: MediaPickerDialogProps) {
  const { data: mediaAssets = [], isLoading, isError, error, refetch } = useGetMediaAssets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const filteredAssets = mediaAssets
    .filter((asset) => !folder || asset.folder === folder)
    .filter((asset) => asset.url.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
      setSelectedUrl(null);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (isError) {
    const errorMessage = error?.message || 'Unknown error';
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error loading media: {errorMessage}</p>
            <Button onClick={handleRetry} variant="outline">
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading media...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No media found matching your search.' : 'No media available.'}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id.toString()}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedUrl === asset.url
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUrl(asset.url)}
                >
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
                      <div className="text-gray-400 text-xs text-center p-2">
                        {asset.typ}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
