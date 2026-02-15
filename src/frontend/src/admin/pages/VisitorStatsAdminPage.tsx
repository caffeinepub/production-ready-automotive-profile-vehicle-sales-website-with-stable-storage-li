import { useGetExtendedVisitorStats } from '../hooks/useAdminCmsQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Eye, TrendingUp, Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader';

export default function VisitorStatsAdminPage() {
  const { data: stats, isLoading, error } = useGetExtendedVisitorStats();

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
      icon: Users,
      description: 'All-time visitors'
    },
    {
      title: 'Page Views',
      value: stats?.pageViews || 0n,
      icon: Eye,
      description: 'Total pages viewed'
    },
    {
      title: 'Today Traffic',
      value: stats?.todayTraffic || 0n,
      icon: TrendingUp,
      description: 'Visitors today'
    },
    {
      title: 'Yesterday Traffic',
      value: stats?.yesterdayTraffic || 0n,
      icon: Calendar,
      description: 'Visitors yesterday'
    },
    {
      title: 'Weekly Traffic',
      value: stats?.weeklyTraffic || 0n,
      icon: CalendarDays,
      description: 'Last 7 days'
    },
    {
      title: 'Monthly Traffic',
      value: stats?.monthlyTraffic || 0n,
      icon: CalendarRange,
      description: 'Last 30 days'
    },
    {
      title: 'Yearly Traffic',
      value: stats?.yearlyTraffic || 0n,
      icon: CalendarClock,
      description: 'Last 365 days'
    },
    {
      title: 'Online Visitors',
      value: stats?.onlineVisitors || 0n,
      icon: Activity,
      description: 'Currently active'
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Visitor Statistics"
        subtitle="Real-time monitoring of website visitor statistics (auto-refreshes every 10 seconds)"
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
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="admin-stat-card">
        <CardHeader>
          <CardTitle>About Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Total Visitors:</strong> Cumulative count of all unique visitors since launch</p>
          <p>• <strong>Page Views:</strong> Total number of pages viewed across the site</p>
          <p>• <strong>Today Traffic:</strong> Visitors who accessed the site today (resets at midnight WIB)</p>
          <p>• <strong>Yesterday Traffic:</strong> Visitors from the previous day</p>
          <p>• <strong>Weekly Traffic:</strong> Visitors in the last 7 days</p>
          <p>• <strong>Monthly Traffic:</strong> Visitors in the last 30 days</p>
          <p>• <strong>Yearly Traffic:</strong> Visitors in the last 365 days</p>
          <p>• <strong>Online Visitors:</strong> Users currently active on the site (last 15 minutes)</p>
          <p className="mt-4 text-xs text-gray-500">Statistics automatically refresh every 10 seconds. Daily counters reset at midnight WIB (UTC+7).</p>
        </CardContent>
      </Card>
    </div>
  );
}
