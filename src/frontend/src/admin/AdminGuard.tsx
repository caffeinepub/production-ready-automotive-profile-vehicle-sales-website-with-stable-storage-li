import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from './hooks/useAdminSession';
import AccessDeniedView from './components/AccessDeniedView';
import { EMERGENCY_BYPASS_ENABLED } from './auth/emergencyBypass';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { session, isValidating, isAuthenticated } = useAdminSession();
  const navigate = useNavigate();

  // ⚠️ TEMPORARY DEBUG-ONLY: Skip authentication when bypass is enabled
  useEffect(() => {
    if (EMERGENCY_BYPASS_ENABLED) {
      // Bypass mode: allow access without redirect
      return;
    }

    // Normal mode: redirect unauthenticated users to login
    if (!isValidating && !isAuthenticated) {
      navigate({ to: '/admin/login', replace: true });
    }
  }, [isValidating, isAuthenticated, navigate]);

  // ⚠️ TEMPORARY DEBUG-ONLY: Skip validation when bypass is enabled
  if (EMERGENCY_BYPASS_ENABLED) {
    // Show loading only while bootstrap is happening
    if (isValidating) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C90010] mx-auto mb-4"></div>
            <p>Initializing emergency bypass...</p>
          </div>
        </div>
      );
    }
    // Allow access regardless of authentication state
    return <>{children}</>;
  }

  // Normal mode: standard authentication flow
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
    // Return null while redirect is happening
    return null;
  }

  // Optional: Check for specific role requirements
  // For now, any authenticated admin can access
  if (session && !session.role) {
    return <AccessDeniedView />;
  }

  return <>{children}</>;
}
