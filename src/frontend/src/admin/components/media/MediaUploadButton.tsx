import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useCreateMediaAsset } from '../../hooks/useAdminCmsQueries';
import { toast } from 'sonner';

interface MediaUploadButtonProps {
  folder?: string;
  onUploadComplete?: () => void;
}

export default function MediaUploadButton({ folder = 'general', onUploadComplete }: MediaUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMediaAsset = useCreateMediaAsset();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Create a data URL for the file
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await createMediaAsset.mutateAsync({
        id: BigInt(Date.now()),
        url: dataUrl,
        typ: file.type,
        size: BigInt(file.size),
        folder
      });

      toast.success('Media uploaded successfully');
      onUploadComplete?.();
      
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
        className="bg-[#C90010] hover:bg-[#a00010]"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </>
        )}
      </Button>
    </>
  );
}
