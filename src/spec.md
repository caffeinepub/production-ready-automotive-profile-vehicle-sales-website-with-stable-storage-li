# Specification

## Summary
**Goal:** Re-implement stable, upgrade-safe blog post interactions (love/like, share tracking, and comments) with a minimal UI on the public Blog Detail page and admin visibility/moderation, without breaking existing pages, routing, SEO, or existing blog CMS data/methods.

**Planned changes:**
- Add an additive interaction block on `/blog/$id` directly under the article content: a left-aligned horizontal row of 3 minimalist icons (Love with persisted count formatted as `❤️ (N)`, Share, Comment toggle) without altering the existing article layout beyond inserting this block.
- Add a toggleable public comment form under the interaction row with fields Name, Email, Comment; submit persists the comment, clears the form, and refreshes interaction state (at least comment count) via React Query without full page reload; all new user-facing strings in English.
- Implement backend stable persistence (additive collections only) for per-post likes, shares, and comments (with name/email/comment, timestamps, blogPostId association) that survives upgrades and does not change existing blog CRUD method signatures or stored BlogPost data.
- Expose new public-safe backend methods to: fetch interaction summary, increment like, increment share (with platform string), add comment, and fetch comments per post.
- Wire new backend methods into `frontend/src/hooks/useQueries.ts` and integrate into `frontend/src/pages/BlogDetailPage.tsx` so interactions work end-to-end without breaking existing blog loading/rendering/SEO.
- Extend the admin blog management/editor experience (no route/layout changes) to show read-only interaction counts for a selected post and provide comment listing + deletion for moderation; all new admin UI strings in English.

**User-visible outcome:** Visitors see Love/Share/Comment controls under each blog post, can like/share and submit comments that persist and update counts immediately; admins can view interaction counts and moderate (delete) comments for each post in the existing admin blog area.
