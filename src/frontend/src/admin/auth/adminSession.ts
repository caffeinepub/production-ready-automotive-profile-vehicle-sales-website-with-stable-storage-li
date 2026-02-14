// Admin session token storage utilities
const ADMIN_TOKEN_KEY = 'admin_session_token';
const ADMIN_ROLE_KEY = 'admin_session_role';

export interface AdminSessionData {
  token: string;
  role: string;
}

export function getAdminSession(): AdminSessionData | null {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const role = localStorage.getItem(ADMIN_ROLE_KEY);
    
    if (!token || !role) {
      return null;
    }
    
    return { token, role };
  } catch (error) {
    console.error('Error reading admin session:', error);
    return null;
  }
}

export function setAdminSession(data: AdminSessionData): void {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_ROLE_KEY, data.role);
    
    // Also set in cookie for persistence
    document.cookie = `${ADMIN_TOKEN_KEY}=${data.token}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
    document.cookie = `${ADMIN_ROLE_KEY}=${data.role}; path=/; max-age=${24 * 60 * 60}`;
  } catch (error) {
    console.error('Error storing admin session:', error);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_ROLE_KEY);
    
    // Clear cookies
    document.cookie = `${ADMIN_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${ADMIN_ROLE_KEY}=; path=/; max-age=0`;
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
}

export function getAdminToken(): string | null {
  const session = getAdminSession();
  return session?.token || null;
}
