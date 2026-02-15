import { useState } from 'react';
import { useGetMediaAssets, useDeleteMediaAsset, useGetSiteBanner, useUpdateSiteBanner, useGetMainBannerImageUrls, useUpdateMainBannerImageUrls } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminPageHeader from '../components/AdminPageHeader';
import MediaUploadButton from '../components/media/MediaUploadButton';
import MediaManagerPanel from '../components/media/MediaManagerPanel';
import MediaPickerDialog from '../components/media/MediaPickerDialog';
import HomeMainBannerManager from '../components/media/HomeMainBannerManager';
import { toast } from 'sonner';

export default function MediaManagerPage() {
  const { data: mainBannerUrls = [] } = useGetMainBannerImageUrls();
  const { data: ctaBanner } = useGetSiteBanner('home-cta-banner');
  const updateMainBannerUrls = useUpdateMainBannerImageUrls();
  const updateBanner = useUpdateSiteBanner();

  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);

  const handleMainBannerUpdate = async (urls: string[]) => {
    await updateMainBannerUrls.mutateAsync(urls);
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
        <CardContent className="space-y-8">
          {/* Main Banner Slider */}
          <HomeMainBannerManager
            imageUrls={mainBannerUrls}
            onUpdate={handleMainBannerUpdate}
            isUpdating={updateMainBannerUrls.isPending}
          />

          {/* CTA Banner */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Home CTA Banner</h3>
                <p className="text-sm text-gray-500">
                  Call-to-action banner displayed in the middle of the homepage (full-bleed on mobile)
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
                  className="w-full h-48 object-cover"
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

      <MediaPickerDialog
        open={ctaBannerPickerOpen}
        onOpenChange={setCtaBannerPickerOpen}
        onSelect={(url) => {
          handleCtaBannerSelect(url);
          setCtaBannerPickerOpen(false);
        }}
      />
    </div>
  );
}
