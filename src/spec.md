# Specification

## Summary
**Goal:** Ensure Super Admin seeding runs only on initial canister initialization (init) and never during upgrade hooks.

**Planned changes:**
- Remove any Super Admin/admin seeding logic from `system func preupgrade()` in `backend/main.mo` (remove the entire seeding block, with no conditional seeding checks left behind).
- Remove the `seedSuperAdmin()` call (and any admin seeding) from `system func postupgrade()` in `backend/main.mo`.
- Add or update `system func init()` in `backend/main.mo` to run `seedSuperAdmin()` only when `adminUsers.size() == 0`.
- Keep stable storage save/restore logic unchanged and make no changes to password hashing (`hashPassword`) or login verification behavior.

**User-visible outcome:** On fresh deployment, exactly one Super Admin is seeded during initialization; upgrading the canister does not seed or duplicate any Super Admin records.
