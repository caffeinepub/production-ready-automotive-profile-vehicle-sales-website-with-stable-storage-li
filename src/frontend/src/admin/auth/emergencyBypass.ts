/**
 * ⚠️ TEMPORARY DEBUG-ONLY EMERGENCY BYPASS ⚠️
 * 
 * This file enables direct admin access without authentication for debugging purposes.
 * 
 * TO DISABLE: Set EMERGENCY_BYPASS_ENABLED to false
 * TO ENABLE: Set EMERGENCY_BYPASS_ENABLED to true
 * 
 * When enabled:
 * - All /admin routes are accessible without login
 * - A Super Admin session is auto-created on first access
 * - /admin/login redirects directly to /admin
 * 
 * ⚠️ REMOVE THIS FILE AFTER DEBUGGING IS COMPLETE ⚠️
 */

export const EMERGENCY_BYPASS_ENABLED = true;

export const BYPASS_CONFIG = {
  email: 'puadsolihan@gmail.com',
  role: 'Super Admin',
  status: 'Active'
} as const;
