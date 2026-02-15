import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, GripVertical } from 'lucide-react';
import MediaPickerDialog from './MediaPickerDialog';
import MediaUploadButton from './MediaUploadButton';
import { toast } from 'sonner';

interface HomeMainBannerManagerProps {
  imageUrls: string[];
  onUpdate: (urls: string[]) => Promise<void>;
  isUpdating: boolean;
}

export default function HomeMainBannerManager({
  imageUrls,
  onUpdate,
  isUpdating,
}: HomeMainBannerManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localUrls, setLocalUrls] = useState<string[]>(imageUrls);

  const handleAddImage = async (url: string) => {
    const newUrls = [...localUrls, url];
    setLocalUrls(newUrls);
    try {
      await onUpdate(newUrls);
      toast.success('Main banner image added');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to add banner image');
      setLocalUrls(localUrls); // Revert on error
    }
  };

  const handleRemoveImage = async (index: number) => {
    const newUrls = localUrls.filter((_, i) => i !== index);
    setLocalUrls(newUrls);
    try {
      await onUpdate(newUrls);
      toast.success('Main banner image removed');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to remove banner image');
      setLocalUrls(localUrls); // Revert on error
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newUrls = [...localUrls];
    [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
    setLocalUrls(newUrls);
    try {
      await onUpdate(newUrls);
      toast.success('Banner order updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update order');
      setLocalUrls(localUrls);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === localUrls.length - 1) return;
    const newUrls = [...localUrls];
    [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
    setLocalUrls(newUrls);
    try {
      await onUpdate(newUrls);
      toast.success('Banner order updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update order');
      setLocalUrls(localUrls);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Home Main Banner (Slider)</h3>
          <p className="text-sm text-gray-500">
            Add 2+ images for auto-rotating vertical slider. Images will slide up every 5 seconds.
          </p>
        </div>
        <div className="flex gap-2">
          <MediaUploadButton folder="banners" onUploadComplete={handleAddImage} />
          <Button
            onClick={() => setPickerOpen(true)}
            className="admin-btn-primary"
            disabled={isUpdating}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select from Library
          </Button>
        </div>
      </div>

      {localUrls.length === 0 && (
        <div className="border border-dashed rounded-lg p-8 text-center text-gray-400">
          No banner images configured. Upload or select images to create the slider.
        </div>
      )}

      {localUrls.length > 0 && (
        <div className="space-y-3">
          {localUrls.map((url, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || isUpdating}
                      className="h-6 w-6 p-0"
                    >
                      ▲
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === localUrls.length - 1 || isUpdating}
                      className="h-6 w-6 p-0"
                    >
                      ▼
                    </Button>
                  </div>
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <img
                      src={url}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          handleAddImage(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
