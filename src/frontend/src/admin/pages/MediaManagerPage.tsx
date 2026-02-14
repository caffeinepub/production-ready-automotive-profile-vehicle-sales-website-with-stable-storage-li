import { useState } from 'react';
import { useGetMediaAssets } from '../hooks/useAdminCmsQueries';
import MediaManagerPanel from '../components/media/MediaManagerPanel';
import MediaUploadButton from '../components/media/MediaUploadButton';

export default function MediaManagerPage() {
  const { error } = useGetMediaAssets();

  const isAuthError = error instanceof Error && 
    (error.message.includes('Unauthorized') || 
     error.message.includes('Invalid or expired') ||
     error.message.includes('session'));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Manager</h1>
        <MediaUploadButton />
      </div>

      {isAuthError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Session Expired</p>
          <p className="text-sm">Your admin session has expired. Please log in again to manage media.</p>
        </div>
      )}

      <MediaManagerPanel />
    </div>
  );
}
