import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';

export default function AdminLoginPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [identity, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign in with Internet Identity to access the admin panel
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full bg-[#C90010] hover:bg-[#a00010]"
        >
          {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
        </Button>
      </div>
    </div>
  );
}
