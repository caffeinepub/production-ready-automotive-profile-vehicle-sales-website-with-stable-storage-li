import { useState } from 'react';
import { useGetMediaAssets, useDeleteMediaAsset, useGetSiteBanner, useUpdateSiteBanner } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminPageHeader from '../components/AdminPageHeader';
import MediaUploadButton from '../components/media/MediaUploadButton';
import MediaManagerPanel from '../components/media/MediaManagerPanel';
import MediaPickerDialog from '../components/media/MediaPickerDialog';
import { toast } from 'sonner';

export default function MediaManagerPage() {
  const { data: mainBanner } = useGetSiteBanner('home-main-banner');
  const { data: ctaBanner } = useGetSiteBanner('home-cta-banner');
  const updateBanner = useUpdateSiteBanner();

  const [mainBannerPickerOpen, setMainBannerPickerOpen] = useState(false);
  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);

  const handleMainBannerSelect = async (url: string) => {
    try {
      await updateBanner.mutateAsync({ id: 'home-main-banner', imageUrl: url });
      toast.success('Home Main Banner updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update Home Main Banner');
    }
  };

  const handleCtaBannerSelect = async (url: string) => {
    try {
      await updateBanner.mutateAsync({ id: 'home-cta-banner', imageUrl: url });
      toast.success('Home CTA Banner updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update Home CTA Banner');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Manager"
        subtitle="Upload and manage media assets"
        action={<MediaUploadButton />}
      />

      {/* Banner Configuration Section */}
      <Card className="admin-stat-card">
        <CardHeader>
          <CardTitle>Homepage Banner Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Banner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Home Main Banner</h3>
                <p className="text-sm text-gray-500">
                  Large banner displayed below the navbar on the homepage (replaces hero section)
                </p>
              </div>
              <Button
                onClick={() => setMainBannerPickerOpen(true)}
                className="admin-btn-primary"
                disabled={updateBanner.isPending}
              >
                {updateBanner.isPending ? 'Updating...' : 'Select Image'}
              </Button>
            </div>
            {mainBanner?.imageUrl && (
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={mainBanner.imageUrl}
                  alt="Home Main Banner Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            {!mainBanner?.imageUrl && (
              <div className="border border-dashed rounded-lg p-8 text-center text-gray-400">
                No banner configured. Click "Select Image" to choose one.
              </div>
            )}
          </div>

          {/* CTA Banner */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Home CTA Banner</h3>
                <p className="text-sm text-gray-500">
                  Call-to-action banner displayed in the middle of the homepage
                </p>
              </div>
              <Button
                onClick={() => setCtaBannerPickerOpen(true)}
                className="admin-btn-primary"
                disabled={updateBanner.isPending}
              >
                {updateBanner.isPending ? 'Updating...' : 'Select Image'}
              </Button>
            </div>
            {ctaBanner?.imageUrl && (
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={ctaBanner.imageUrl}
                  alt="Home CTA Banner Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            {!ctaBanner?.imageUrl && (
              <div className="border border-dashed rounded-lg p-8 text-center text-gray-400">
                No banner configured. Click "Select Image" to choose one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card className="admin-stat-card">
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaManagerPanel />
        </CardContent>
      </Card>

      {/* Banner Picker Dialogs */}
      <MediaPickerDialog
        open={mainBannerPickerOpen}
        onOpenChange={setMainBannerPickerOpen}
        onSelect={handleMainBannerSelect}
        currentUrl={mainBanner?.imageUrl}
      />

      <MediaPickerDialog
        open={ctaBannerPickerOpen}
        onOpenChange={setCtaBannerPickerOpen}
        onSelect={handleCtaBannerSelect}
        currentUrl={ctaBanner?.imageUrl}
      />
    </div>
  );
}
