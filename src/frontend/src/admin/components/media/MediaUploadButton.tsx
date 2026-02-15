import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useCreateMediaAsset } from '../../hooks/useAdminCmsQueries';
import { toast } from 'sonner';

interface MediaUploadButtonProps {
  folder?: string;
  onUploadComplete?: (url: string) => void;
}

export default function MediaUploadButton({ folder = 'general', onUploadComplete }: MediaUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMediaAsset = useCreateMediaAsset();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Convert file to data URL for storage
      const reader = new FileReader();
      
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create media asset record in backend
      const newAsset = {
        id: BigInt(Date.now()),
        url: dataUrl,
        typ: file.type,
        size: BigInt(file.size),
        folder: folder,
      };

      await createMediaAsset.mutateAsync(newAsset);
      
      toast.success('Media uploaded successfully');
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(dataUrl);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="admin-btn-primary"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Media'}
      </Button>
    </>
  );
}
