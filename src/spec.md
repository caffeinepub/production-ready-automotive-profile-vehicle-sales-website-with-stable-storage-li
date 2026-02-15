# Specification

## Summary
**Goal:** Expand and activate visitor statistics for the Admin panel with additional metrics and near-real-time updates, while keeping the public-site Footer UI and its displayed visitor-stat items unchanged.

**Planned changes:**
- Extend backend visitor statistics to compute and persist (upgrade-safe) counters for: Total, Today, Yesterday, Weekly, Monthly, Yearly, Online (real-time), and total Page Views.
- Add WIB timezone rollover/reset logic (daily reset at 00:00 WIB; correct weekly/monthly/yearly rollovers on the next relevant call, idempotently).
- Implement backend tracking for Online Visitors using last-seen/presence expiry and expose an admin-readable online count.
- Expose authenticated (session-token protected) admin APIs to fetch the extended statistics dataset, while keeping the existing public Footer stats API shape unchanged.
- Update the Admin Visitor Statistics page to display all requested metrics using existing admin styling; ensure any new labels/text are in English.
- Add automatic refresh/polling on the Admin Visitor Statistics page so Online Visitors updates near-real-time and other counters refresh periodically without manual reload.
- Ensure the public Footer remains visually unchanged and continues to display only the existing four items.

**User-visible outcome:** Admin users can view a richer Visitor Statistics dashboard (including yesterday/weekly/monthly/yearly and real-time online visitors) that updates automatically, while site visitors see the Footer statistics unchanged with the same four items as before.
