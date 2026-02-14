// Admin session token storage utilities
const SESSION_KEY = 'caffeineAdminSession';
const LEGACY_TOKEN_KEY = 'admin_session_token';
const LEGACY_ROLE_KEY = 'admin_session_role';

export interface AdminSessionData {
  token: string;
  role: string;
}

export function getAdminSession(): AdminSessionData | null {
  try {
    // Try new unified key first
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      const session = JSON.parse(sessionStr) as AdminSessionData;
      if (session.token && session.role) {
        return session;
      }
    }

    // Fallback to legacy keys and migrate
    const token = localStorage.getItem(LEGACY_TOKEN_KEY);
    const role = localStorage.getItem(LEGACY_ROLE_KEY);
    
    if (token && role) {
      const session: AdminSessionData = { token, role };
      // Migrate to new format
      setAdminSession(session);
      // Clean up legacy keys
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      localStorage.removeItem(LEGACY_ROLE_KEY);
      return session;
    }

    // Try cookie fallback
    const cookieSession = getCookieSession();
    if (cookieSession) {
      setAdminSession(cookieSession);
      return cookieSession;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading admin session:', error);
    return null;
  }
}

function getCookieSession(): AdminSessionData | null {
  try {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith(`${SESSION_KEY}=`));
    if (sessionCookie) {
      const value = sessionCookie.split('=')[1];
      if (value) {
        return JSON.parse(decodeURIComponent(value));
      }
    }
  } catch (error) {
    console.error('Error reading session cookie:', error);
  }
  return null;
}

export function setAdminSession(data: AdminSessionData): void {
  try {
    const sessionStr = JSON.stringify(data);
    
    // Store in localStorage with unified key
    localStorage.setItem(SESSION_KEY, sessionStr);
    
    // Also set in cookie for persistence
    const maxAge = 24 * 60 * 60; // 24 hours
    document.cookie = `${SESSION_KEY}=${encodeURIComponent(sessionStr)}; path=/; max-age=${maxAge}; SameSite=Strict`;
    
    // Clean up any legacy keys
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ROLE_KEY);
    document.cookie = `${LEGACY_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${LEGACY_ROLE_KEY}=; path=/; max-age=0`;
  } catch (error) {
    console.error('Error storing admin session:', error);
  }
}

export function clearAdminSession(): void {
  try {
    // Clear unified key
    localStorage.removeItem(SESSION_KEY);
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0`;
    
    // Clear legacy keys
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ROLE_KEY);
    document.cookie = `${LEGACY_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${LEGACY_ROLE_KEY}=; path=/; max-age=0`;
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
}

export function getAdminToken(): string | null {
  const session = getAdminSession();
  return session?.token || null;
}

/**
 * ⚠️ TEMPORARY DEBUG-ONLY: Helper for emergency bypass flow
 * Creates and persists a bypass session with the given token and role
 */
export function createBypassSession(token: string, role: string): void {
  const bypassSession: AdminSessionData = { token, role };
  setAdminSession(bypassSession);
}
