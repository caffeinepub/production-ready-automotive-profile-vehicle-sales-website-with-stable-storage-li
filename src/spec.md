# Specification

## Summary
**Goal:** Improve the Home page banner experience and admin media management by adding a vertical 2-image main-banner slider, fixing CTA banner layout, restoring the About section styling, and resolving Admin Media Library rendering issues.

**Planned changes:**
- Update the Home page main banner to support 2 images that auto-rotate with a vertical slide-up transition, keeping the current banner size/position; render a single static banner if only 1 image is configured.
- Extend `/admin/media` to include a dedicated “Home Main Banner” management area to upload and order/select at least two main-banner images (English UI text).
- Add/extend backend persistence and APIs to store and publicly serve an ordered list of Home main-banner image URLs, while preserving existing Home CTA banner configuration behavior.
- Update the public `useGetPublicSiteBanners` hook to fetch real configured values from the backend (main banner + CTA), falling back to existing static assets when none are configured.
- Adjust the Home page CTA banner section to remove vertical margins (touch adjacent sections), make it full-bleed on mobile (no side padding), constrain its height to a CTA-strip feel, and apply a dark gray/black background.
- Restore the Home page “About Us / Tentang Kami” section styling and colors to the previous design used before recent changes.
- Fix Admin Media Library upload/list rendering so uploaded images reliably appear immediately after upload and after refresh (no persistent error state), ensuring API list/get returns stored assets and UI renders them (English messages).

**User-visible outcome:** The Home page shows a vertically sliding 2-image main banner (or static if only one is set), the CTA banner fits as a full-width strip on mobile with no extra spacing, the About section looks like it did previously, and admins can upload/manage main-banner images in `/admin/media` with the Media Library reliably displaying uploaded assets.
