import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8">
        <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have the required permissions to access this admin area.
        </p>
        <Button
          onClick={() => navigate({ to: '/admin/login' })}
          className="bg-[#C90010] hover:bg-[#a00010]"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
}
