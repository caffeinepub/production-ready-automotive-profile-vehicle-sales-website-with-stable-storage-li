import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MediaManagerPanel from '../components/media/MediaManagerPanel';
import MediaUploadButton from '../components/media/MediaUploadButton';
import AdminPageHeader from '../components/AdminPageHeader';
import { useGetMediaAssets } from '../hooks/useAdminCmsQueries';

export default function MediaManagerPage() {
  const { error } = useGetMediaAssets();

  const isAuthError = error instanceof Error && 
    (error.message.includes('Session expired') || 
     error.message.includes('unauthorized') ||
     error.message.includes('session required'));

  return (
    <div>
      <AdminPageHeader
        title="Media Manager"
        subtitle="Upload and manage media assets"
        action={<MediaUploadButton />}
      />

      {isAuthError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your admin session has expired. Please log in again to manage media.
          </AlertDescription>
        </Alert>
      )}

      <MediaManagerPanel />
    </div>
  );
}
