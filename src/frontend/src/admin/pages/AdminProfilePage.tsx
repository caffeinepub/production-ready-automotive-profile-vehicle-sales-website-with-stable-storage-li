import { useState, useEffect } from 'react';
import { useGetAdminUserProfile, useSaveAdminUserProfile } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminPageHeader from '../components/AdminPageHeader';
import { toast } from 'sonner';
import type { UserProfile } from '../../backend';
import { getAdminSession } from '../auth/adminSession';

export default function AdminProfilePage() {
  const session = getAdminSession();
  
  // Extract userId from session token by parsing (temporary workaround)
  // In a real app, the backend would return userId in the login response
  const adminUserId = 1; // Default to 1 for now since we don't have userId in session
  
  const { data: profile, isLoading, isFetched } = useGetAdminUserProfile(adminUserId);
  const saveProfile = useSaveAdminUserProfile();
  
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveProfile.mutateAsync({ adminUserId, profile: formData });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <AdminPageHeader title="Admin User Profile" />

      <Card className="max-w-2xl admin-stat-card">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="admin-search-input"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="admin-search-input"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="admin-search-input"
              />
            </div>

            <Button 
              type="submit" 
              disabled={saveProfile.isPending}
              className="admin-btn-primary"
            >
              {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
