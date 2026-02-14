import { useState, useEffect } from 'react';
import { useGetVisitorStats, useUpdateVisitorStats } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Activity, Eye, TrendingUp } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader';
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
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update visitor statistics');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading visitor statistics...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading visitor statistics: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors || 0n,
      icon: Users
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0n,
      icon: Activity
    },
    {
      title: 'Page Views',
      value: stats?.pageViews || 0n,
      icon: Eye
    },
    {
      title: 'Today Traffic',
      value: stats?.todayTraffic || 0n,
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Visitor Statistics"
        subtitle="Monitor and update website visitor statistics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="admin-stat-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="admin-stat-title">
                  {stat.title}
                </CardTitle>
                <div className="admin-stat-icon-wrapper">
                  <Icon className="admin-stat-icon h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="admin-stat-value text-2xl">{Number(stat.value).toLocaleString()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="admin-stat-card">
        <CardHeader>
          <CardTitle>Update Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalVisitors">Total Visitors</Label>
                <Input
                  id="totalVisitors"
                  type="number"
                  value={Number(formData.totalVisitors)}
                  onChange={(e) => setFormData({ ...formData, totalVisitors: BigInt(e.target.value || 0) })}
                  min="0"
                  className="admin-search-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeUsers">Active Users</Label>
                <Input
                  id="activeUsers"
                  type="number"
                  value={Number(formData.activeUsers)}
                  onChange={(e) => setFormData({ ...formData, activeUsers: BigInt(e.target.value || 0) })}
                  min="0"
                  className="admin-search-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageViews">Page Views</Label>
                <Input
                  id="pageViews"
                  type="number"
                  value={Number(formData.pageViews)}
                  onChange={(e) => setFormData({ ...formData, pageViews: BigInt(e.target.value || 0) })}
                  min="0"
                  className="admin-search-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="todayTraffic">Today Traffic</Label>
                <Input
                  id="todayTraffic"
                  type="number"
                  value={Number(formData.todayTraffic)}
                  onChange={(e) => setFormData({ ...formData, todayTraffic: BigInt(e.target.value || 0) })}
                  min="0"
                  className="admin-search-input"
                />
              </div>
            </div>

            <Button type="submit" disabled={updateStats.isPending} className="admin-btn-primary">
              {updateStats.isPending ? 'Updating...' : 'Update Statistics'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
