import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetMediaAssets } from '../../hooks/useAdminCmsQueries';
import { Search, Check } from 'lucide-react';
import type { MediaAsset } from '../../../backend';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export default function MediaPickerDialog({ open, onOpenChange, onSelect, currentUrl }: MediaPickerDialogProps) {
  const { data: assets = [], isLoading } = useGetMediaAssets();
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || '');

  const filteredAssets = assets.filter((asset) =>
    asset.url.toLowerCase().includes(search.toLowerCase()) ||
    asset.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        
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

          {isLoading ? (
            <div className="text-center py-8">Loading media...</div>
          ) : (
            <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id.toString()}
                  onClick={() => setSelectedUrl(asset.url)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedUrl === asset.url ? 'border-[#C90010]' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {asset.typ.startsWith('image/') ? (
                    <img src={asset.url} alt="" className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{asset.typ}</span>
                    </div>
                  )}
                  {selectedUrl === asset.url && (
                    <div className="absolute top-2 right-2 bg-[#C90010] text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredAssets.length === 0 && (
            <div className="text-center py-8 text-gray-500">No media found</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl} className="bg-[#C90010] hover:bg-[#a00010]">
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
