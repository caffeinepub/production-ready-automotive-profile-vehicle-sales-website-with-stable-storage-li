import { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { getAdminSession, setAdminSession, clearAdminSession, AdminSessionData } from '../auth/adminSession';

export function useAdminSession() {
  const { actor } = useActor();
  const [session, setSession] = useState<AdminSessionData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Validate existing session on mount
  useEffect(() => {
    const validateSession = async () => {
      const storedSession = getAdminSession();
      
      if (!storedSession || !actor) {
        setIsValidating(false);
        return;
      }

      try {
        // Validate token by attempting to fetch visitor stats (admin-only endpoint)
        await actor.getVisitorStats(storedSession.token);
        setSession(storedSession);
      } catch (error) {
        console.error('Session validation failed:', error);
        clearAdminSession();
        setSession(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [actor]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!actor) {
      setLoginError('System not ready. Please try again.');
      return false;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await actor.adminLogin(email, password);
      
      if (!result) {
        setLoginError('Invalid email or password');
        return false;
      }

      const sessionData: AdminSessionData = {
        token: result.token,
        role: result.role
      };

      setAdminSession(sessionData);
      setSession(sessionData);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (!actor || !session) {
      clearAdminSession();
      setSession(null);
      return;
    }

    try {
      await actor.adminLogout(session.token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAdminSession();
      setSession(null);
    }
  };

  return {
    session,
    isValidating,
    isLoggingIn,
    loginError,
    login,
    logout,
    isAuthenticated: !!session
  };
}
