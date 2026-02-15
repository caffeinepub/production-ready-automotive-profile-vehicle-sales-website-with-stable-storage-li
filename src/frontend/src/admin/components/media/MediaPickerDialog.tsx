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
  currentUrl?: string;
}

export default function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  currentUrl,
}: MediaPickerDialogProps) {
  const { data: mediaAssets = [], isLoading, isError, error, refetch } = useGetMediaAssets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentUrl || null);

  const filteredAssets = mediaAssets.filter((asset) =>
    asset.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">Loading media library...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    const errorMessage = error?.message || 'Unknown error';
    const isSessionError = errorMessage.includes('session') || errorMessage.includes('Unauthorized');
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            {isSessionError ? 'Session expired. Please refresh the page.' : `Error: ${errorMessage}`}
          </div>
          <DialogFooter>
            <Button onClick={() => refetch()}>Retry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 px-6">
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

        <div className="flex-1 overflow-y-auto px-6">
          {filteredAssets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No media found matching your search.' : 'No media yet.'}
            </div>
          )}

          {filteredAssets.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 py-4">
              {filteredAssets.map((asset) => {
                const isImage = asset.typ.startsWith('image/');
                const isSelected = selectedUrl === asset.url;

                return (
                  <div
                    key={asset.id.toString()}
                    onClick={() => setSelectedUrl(asset.url)}
                    className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      isSelected
                        ? 'border-[#C90010] ring-2 ring-[#C90010] ring-opacity-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {isImage ? (
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
                          {asset.typ || 'File'}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#C90010] bg-opacity-20 flex items-center justify-center">
                        <div className="bg-[#C90010] text-white rounded-full w-8 h-8 flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedUrl}
            className="admin-btn-primary"
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
