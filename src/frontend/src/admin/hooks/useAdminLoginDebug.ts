import { useMutation } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { getAdminToken } from '../auth/adminSession';
import type { AdminLoginDebugReport } from '../../backend';

interface DebugLoginParams {
  email: string;
  password: string;
}

export function useDebugAdminLogin() {
  const { actor } = useActor();

  return useMutation<AdminLoginDebugReport, Error, DebugLoginParams>({
    mutationFn: async ({ email, password }) => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      const token = getAdminToken();
      
      try {
        const report = await actor.debugAdminLogin(email, password, token);
        return report;
      } catch (error: any) {
        if (error.message?.includes('Access denied')) {
          throw new Error('Access denied. You must be logged in as an admin or be the owner to use this debug tool.');
        }
        throw new Error(error.message || 'Failed to run debug login test');
      }
    }
  });
}
