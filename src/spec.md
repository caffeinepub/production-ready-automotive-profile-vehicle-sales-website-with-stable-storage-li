# Specification

## Summary
**Goal:** Fix the Admin CMS regression where media assets don’t appear in editors and admin save/publish operations fail, especially around expired/invalid sessions.

**Planned changes:**
- Update backend admin authorization/session validation error handling so admin CMS and Media Manager methods return a safe unauthorized response (instead of trapping) that existing React Query hooks can handle.
- Ensure media assets can load end-to-end (list/search/select) in `/admin/media` and Media Picker dialogs using the existing `caffeineAdminSession.token` storage key.
- Restore create/update/save and Published/Draft persistence for Vehicles, Promotions, Testimonials, and Blog so listings refresh correctly after saves.
- Add minimal backend debug logging for session-validation rejections and media listing failures (English, no sensitive data).

**User-visible outcome:** Admins can see and pick media assets in editors, and can reliably save and publish/draft content across Vehicles/Promotions/Testimonials/Blog; when sessions are expired, the UI shows the existing session-required/expired messaging and continues working after re-login.
