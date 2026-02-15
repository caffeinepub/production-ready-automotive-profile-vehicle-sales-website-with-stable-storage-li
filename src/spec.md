# Specification

## Summary
**Goal:** Improve admin usability by fixing the Visitor Stats layout, making Admin Profile updates persist correctly, normalizing Admin UI styling, and enabling admins to control the Home page Main Banner and CTA Banner images from the existing Media area.

**Planned changes:**
- Update `/admin/stats` statistics cards to render in a responsive 2-column grid (wrapping into rows up to 5) with no horizontal overflow at common breakpoints, keeping all existing metrics unchanged.
- Fix `/admin/profile` so Name/Email/Phone edits can be saved reliably, persist using the existing admin session-based authorization, and reload correctly after refresh (English success/error messaging preserved).
- Polish and normalize admin panel visual styling for consistency, including a clear red accent highlight for the active sidebar/menu item across all admin routes (including query-string variations), with visual-only changes.
- Add an admin-only section within `/admin/media` to select (and/or upload then select) Media Assets for “Home Main Banner” and “Home CTA Banner”, persist these settings in stable storage, and use them on the public Home page:
  - Render the configured Main Banner image directly below the Navbar on `/`, replacing the current red Home-only hero section.
  - Use the configured CTA Banner image on `/`, with fallback to current CTA banner behavior when not configured.

**User-visible outcome:** Admins see a properly wrapped stats grid, can save their profile changes reliably, get a more consistent admin UI with a clear red active-menu highlight, and can update the Home page’s Main Banner and CTA Banner images from the existing Media page without changing routes or breaking existing media management.
