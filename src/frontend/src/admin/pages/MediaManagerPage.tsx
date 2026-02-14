import { useGetMediaAssets } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MediaManagerPage() {
  const { data: assets = [], isLoading } = useGetMediaAssets();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media Manager</h1>
        <Button className="bg-[#C90010] hover:bg-[#a00010]">
          <Plus className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Total Assets: {assets.length}</p>
        <p className="text-sm text-gray-500 mt-2">Media gallery and upload interface would be implemented here</p>
      </div>
    </div>
  );
}
