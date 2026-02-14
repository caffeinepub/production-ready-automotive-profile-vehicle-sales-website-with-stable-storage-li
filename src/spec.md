# Specification

## Summary
**Goal:** Implement admin-only email/password authentication with secure, persistent backend sessions, and update `/admin` frontend auth/route guarding to use session tokens (replacing Internet Identity).

**Planned changes:**
- Add an upgrade-safe, stable `adminUsers` collection in the Motoko backend with fields: `id`, `email`, `passwordHash`, `role`, `createdAt`.
- Implement salted, one-way password hashing and constant-time password verification for admin authentication.
- Add a backend admin login method that validates email/password and returns a cryptographically strong session token on success.
- Add an upgrade-safe, stable admin session store mapping session tokens to admin identity/role, including logout/session invalidation and token validation.
- Protect all admin/CMS backend methods so they require a valid admin session token and enforce authorization by role; keep public site methods unauthenticated.
- Update the `/admin` frontend to use an email/password login form, store the session token client-side for persistence across refresh, and implement logout that destroys the backend session.
- Replace `/admin` route guard logic to require a valid session token: redirect unauthenticated users to `/admin/login`, redirect authenticated users away from `/admin/login` to `/admin`, and show an English “Access denied” message when lacking privileges.

**User-visible outcome:** Admin users can log in at `/admin/login` with email/password, stay logged in across refreshes, access protected `/admin` pages only when authenticated (and authorized), and log out to end the session; public pages remain unchanged.
