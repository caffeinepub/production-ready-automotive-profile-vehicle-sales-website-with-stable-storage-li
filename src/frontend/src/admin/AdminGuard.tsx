import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from './hooks/useAdminSession';
import AccessDeniedView from './components/AccessDeniedView';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { session, isValidating, isAuthenticated } = useAdminSession();
  const navigate = useNavigate();

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C90010] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate({ to: '/admin/login' });
    return null;
  }

  // Optional: Check for specific role requirements
  // For now, any authenticated admin can access
  if (session && !session.role) {
    return <AccessDeniedView />;
  }

  return <>{children}</>;
}
