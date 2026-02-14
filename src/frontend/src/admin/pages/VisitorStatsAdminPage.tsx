import { useState, useEffect } from 'react';
import { useGetVisitorStats, useUpdateVisitorStats } from '../hooks/useAdminCmsQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { VisitorStats } from '../../backend';

export default function VisitorStatsAdminPage() {
  const { data: stats, isLoading, error } = useGetVisitorStats();
  const updateStats = useUpdateVisitorStats();
  
  const [formData, setFormData] = useState<VisitorStats>({
    totalVisitors: 0n,
    activeUsers: 0n,
    pageViews: 0n,
    todayTraffic: 0n
  });

  useEffect(() => {
    if (stats) {
      setFormData(stats);
    }
  }, [stats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateStats.mutateAsync(formData);
      toast.success('Visitor statistics updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update visitor statistics');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading visitor statistics. Please check your authentication.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Visitor Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats?.totalVisitors || 0n).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats?.activeUsers || 0n).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats?.pageViews || 0n).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Today's Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(stats?.todayTraffic || 0n).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjust Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalVisitors">Total Visitors</Label>
                <Input
                  id="totalVisitors"
                  type="number"
                  value={Number(formData.totalVisitors)}
                  onChange={(e) => setFormData({ ...formData, totalVisitors: BigInt(e.target.value || 0) })}
                />
              </div>

              <div>
                <Label htmlFor="activeUsers">Active Users</Label>
                <Input
                  id="activeUsers"
                  type="number"
                  value={Number(formData.activeUsers)}
                  onChange={(e) => setFormData({ ...formData, activeUsers: BigInt(e.target.value || 0) })}
                />
              </div>

              <div>
                <Label htmlFor="pageViews">Page Views</Label>
                <Input
                  id="pageViews"
                  type="number"
                  value={Number(formData.pageViews)}
                  onChange={(e) => setFormData({ ...formData, pageViews: BigInt(e.target.value || 0) })}
                />
              </div>

              <div>
                <Label htmlFor="todayTraffic">Today's Traffic</Label>
                <Input
                  id="todayTraffic"
                  type="number"
                  value={Number(formData.todayTraffic)}
                  onChange={(e) => setFormData({ ...formData, todayTraffic: BigInt(e.target.value || 0) })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={updateStats.isPending}
              className="bg-[#C90010] hover:bg-[#a00010]"
            >
              {updateStats.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
