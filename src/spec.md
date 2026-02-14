# Specification

## Summary
**Goal:** Add a temporary, debug-only emergency bypass that grants direct access to the `/admin` dashboard and other admin CMS routes without the normal login flow, using a backend-issued token.

**Planned changes:**
- Add a single, easy-to-toggle frontend bypass flag/config that disables `AdminGuard` redirects for all `/admin/*` routes and is clearly marked as temporary/debug-only.
- When bypass is enabled, ensure visiting `/admin/login` redirects to `/admin` (replace navigation) so the login UI is skipped during debugging.
- When bypass is enabled and no `caffeineAdminSession` exists, automatically create and persist one in the existing `frontend/src/admin/auth/adminSession.ts` storage format with `role: "Super Admin"` and a non-empty token.
- Add a backend emergency bypass login method (in `backend/main.mo`) that upserts an Active Super Admin user for `puadsolihan@gmail.com` and issues a valid admin session token without password verification (temporary/debug-only).
- Wire the frontend bypass session creation flow to call the backend bypass method so the stored token is recognized by backend admin session checks and admin CMS endpoints work end-to-end.

**User-visible outcome:** With bypass mode enabled, navigating to `/admin` (or any admin CMS route) opens the admin dashboard and CMS pages without being redirected to `/admin/login`, and admin-protected CMS data loads successfully using an automatically created Super Admin session token.
