# Specification

## Summary
**Goal:** Replace the backend’s volatile/in-memory storage with upgrade-safe stable persistence so all application data survives draft rebuilds, canister upgrades, and version redeploys without requiring any frontend changes.

**Planned changes:**
- Update `backend/main.mo` to persist all previously in-memory collections to stable storage, eliminating reliance on volatile `Map.empty(...)` (or similar) as the sole source of truth.
- Define and version stable schemas/structures for these domain collections: `passengerVehicles`, `commercialVehicles`, `promotions`, `testimonials`, `blogPosts`, `contacts`, `creditSimulations`, `adminUsers`, `visitorStats`, `mediaAssets`.
- Define and persist stable interaction collections: `productLikes`, `productShares`, `articleLikes`, `articleComments`, including mapping/splitting any previously combined interaction state without data loss.
- Implement upgrade lifecycle hooks (`preupgrade`/`postupgrade`) to automatically serialize/restore state and handle schema evolution via a version field and backward-compatible decoding/migration paths.
- Preserve the existing backend public interface used by the frontend (method names and argument/return types), with internal mapping as needed (e.g., combining passenger+commercial into existing `getVehicles` outputs).

**User-visible outcome:** The app behaves the same for users, but all stored data (vehicles, content, interactions, stats, contacts, admin users, and media metadata) persists reliably across canister upgrades and redeploys.
