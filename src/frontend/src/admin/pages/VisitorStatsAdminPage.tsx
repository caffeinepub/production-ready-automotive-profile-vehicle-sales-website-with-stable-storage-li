import { useGetVisitorStats } from '../../hooks/useQueries';

export default function VisitorStatsAdminPage() {
  const { data: stats, isLoading } = useGetVisitorStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Visitor Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold">{stats ? Number(stats.totalVisitors) : 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Active Users</h3>
          <p className="text-3xl font-bold">{stats ? Number(stats.activeUsers) : 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Page Views</h3>
          <p className="text-3xl font-bold">{stats ? Number(stats.pageViews) : 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Today's Traffic</h3>
          <p className="text-3xl font-bold">{stats ? Number(stats.todayTraffic) : 0}</p>
        </div>
      </div>
    </div>
  );
}
