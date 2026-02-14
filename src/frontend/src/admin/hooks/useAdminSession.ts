import { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { getAdminSession, setAdminSession, clearAdminSession, AdminSessionData } from '../auth/adminSession';
import { EMERGENCY_BYPASS_ENABLED, BYPASS_CONFIG } from '../auth/emergencyBypass';

export function useAdminSession() {
  const { actor } = useActor();
  const [session, setSession] = useState<AdminSessionData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Validate existing session on mount
  useEffect(() => {
    const validateSession = async () => {
      // ⚠️ TEMPORARY DEBUG-ONLY: Auto-create bypass session
      if (EMERGENCY_BYPASS_ENABLED) {
        const storedSession = getAdminSession();
        
        if (storedSession) {
          // Session already exists, use it
          setSession(storedSession);
          setIsValidating(false);
          return;
        }

        // No session exists, create one via backend bypass
        if (!actor) {
          // Actor not ready yet, keep validating
          return;
        }

        try {
          console.log('🚨 EMERGENCY BYPASS: Creating admin session...');
          
          // Call backend emergency bypass login
          const result = await actor.adminLogin(BYPASS_CONFIG.email, '66669999');
          
          if (!result || !result.token || !result.role) {
            console.error('Emergency bypass failed: Invalid response from backend');
            setIsValidating(false);
            return;
          }

          const bypassSession: AdminSessionData = {
            token: result.token,
            role: result.role
          };

          setAdminSession(bypassSession);
          setSession(bypassSession);
          console.log('✅ EMERGENCY BYPASS: Session created successfully');
        } catch (error) {
          console.error('Emergency bypass error:', error);
        } finally {
          setIsValidating(false);
        }
        return;
      }

      // Normal mode: validate existing session
      const storedSession = getAdminSession();
      
      if (!storedSession) {
        setIsValidating(false);
        setSession(null);
        return;
      }

      if (!actor) {
        // Actor not ready yet, keep validating state
        return;
      }

      try {
        // Validate token by attempting to fetch visitor stats (admin-only endpoint)
        const result = await actor.getVisitorStats(storedSession.token);
        
        // If result is null, session is invalid/expired
        if (result === null) {
          console.log('Session validation failed: null result from getVisitorStats');
          clearAdminSession();
          setSession(null);
        } else {
          setSession(storedSession);
        }
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
      
      if (!result || !result.token || !result.role) {
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
