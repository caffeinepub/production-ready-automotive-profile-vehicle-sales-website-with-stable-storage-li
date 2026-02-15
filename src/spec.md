# Specification

## Summary
**Goal:** Improve public blog engagement and admin oversight by enhancing likes, enabling threaded comments with moderation, and activating the article views counter.

**Planned changes:**
- Add a visible “Like” text label to the Like (heart) action in the public blog interactions bar and enforce one-like-per-visitor per blogPostId (Share and Comment remain unrestricted).
- Render published comments below the public Blog Detail content and support threaded replies with nested display; update the UI immediately after posting without a full refresh (new UI text in English).
- Extend backend comment storage and APIs to support replies (parent/child), and update the existing admin blog management/editor experience to allow admins to edit and delete individual comments and replies (new UI text in English).
- Activate blog post view counting so visiting a public Blog Detail increments views (at most once per visitor per article per session) and the admin views counter reflects the updated backend value.

**User-visible outcome:** Visitors can like an article once, see and post threaded comments/replies under the article, and article view counts increase on visits and are visible in the admin panel; admins can edit/delete individual comments and replies.
