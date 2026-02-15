# Specification

## Summary
**Goal:** Prevent the admin Media Manager from failing on large media libraries by paginating the backend media-asset listing to stay under the Internet Computer 2MB per-response payload limit, while keeping the existing UI behavior unchanged.

**Planned changes:**
- Update the backend `getMediaAssets()`-style listing to support pagination/chunking (e.g., limit + cursor/offset) so each response remains safely below 2MB, with stable/deterministic ordering across pages.
- Ensure the paginated media listing remains protected by the same admin session token authorization as existing admin CMS methods.
- Adapt the frontend data-fetching layer (React Query hook) to fetch all pages and merge results so the UI still receives a single combined `MediaAsset[]` (same shape as before), with no visual/layout changes to the Media Manager.
- Keep existing error handling behavior consistent if any page fetch fails, introducing no new user-facing text unless strictly necessary (and in English).

**User-visible outcome:** The /admin Media Manager loads and displays large media libraries without triggering the IC “application payload size … cannot be larger than 2097152” rejection, and the UI behaves the same as before.
