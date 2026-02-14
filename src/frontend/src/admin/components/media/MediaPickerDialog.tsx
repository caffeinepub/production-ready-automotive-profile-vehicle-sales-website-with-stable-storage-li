import { useState } from 'react';
import { useGetMediaAssets } from '../../hooks/useAdminCmsQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { MediaAsset } from '../../../backend';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export default function MediaPickerDialog({ open, onOpenChange, onSelect, currentUrl }: MediaPickerDialogProps) {
  const { data: assets = [], isLoading, error } = useGetMediaAssets();
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  const filteredAssets = assets.filter((asset) =>
    asset.url.toLowerCase().includes(search.toLowerCase()) ||
    asset.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset.url);
      onOpenChange(false);
      setSelectedAsset(null);
      setSearch('');
    }
  };

  const isAuthError = error instanceof Error && 
    (error.message.includes('Session expired') || 
     error.message.includes('unauthorized') ||
     error.message.includes('session required'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">Loading media...</div>
          ) : error ? (
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
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {assets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">No media yet.</p>
                  <p className="text-sm mt-2">Upload media assets from the Media Manager to use them here.</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No media found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id.toString()}
                      onClick={() => setSelectedAsset(asset)}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedAsset?.id === asset.id
                          ? 'border-[#C90010] ring-2 ring-[#C90010] ring-opacity-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {asset.typ.startsWith('image/') ? (
                          <img 
                            src={asset.url} 
                            alt="Media asset" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">{asset.typ}</div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-500 truncate">{asset.folder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedAsset}
            className="bg-[#C90010] hover:bg-[#a00010]"
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
