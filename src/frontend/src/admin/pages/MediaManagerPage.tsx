import MediaManagerPanel from '../components/media/MediaManagerPanel';
import MediaUploadButton from '../components/media/MediaUploadButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useGetMediaAssets } from '../hooks/useAdminCmsQueries';

export default function MediaManagerPage() {
  const { error } = useGetMediaAssets();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media Manager</h1>
        <MediaUploadButton />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading media assets. Please check your authentication.
          </AlertDescription>
        </Alert>
      )}
      
      <MediaManagerPanel />
    </div>
  );
}
