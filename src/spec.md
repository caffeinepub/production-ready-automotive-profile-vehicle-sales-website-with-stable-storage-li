# Specification

## Summary
**Goal:** Build a production-ready automotive dealer website with a Motoko backend that uses upgrade-safe stable persistence, a live /admin CMS (with auth + roles), stable media storage, and public pages with required navigation and interactions.

**Planned changes:**
- Implement a single Motoko backend actor with stable, upgrade-safe persistence for: passengerVehicles, commercialVehicles, promotions, testimonials, blogPosts, contacts, creditSimulations, adminUsers, visitorStats, mediaAssets, productLikes, productShares, articleLikes, articleComments.
- Add admin authentication at `/admin` (email/password), multi-admin management, and role-based access control; seed a super-admin bound to Principal `7aizr-qwhrg-kuvhe-yekzz-6nj4a-t6yeb-5gnrb-pjpwy-gp2ut-up3m5-3qe`.
- Build a live CMS admin panel with CRUD + draft/publish for vehicles, promos, testimonials, blog, leads/contacts, credit simulations, visitor stats counters, and admin profile; ensure changes reflect on public pages.
- Implement a stable canister-backed Media Manager supporting PNG/JPG/WebP/PDF with upload/replace/delete, folder grouping, retrievable serving for UI, and image compression where feasible.
- Create public routing and navigation: Home `/`, Passenger Vehicles `/mobil-keluarga`, Commercial Vehicles `/mobil-niaga`, Promo `/promo`, Testimonials `/testimoni`, Blog `/blog`, Contact `/kontak`; include a red hero section (#C90010, 150px mobile height) and a bottom CTA section on every page.
- Implement a sticky responsive Navbar (#262729) with desktop/mobile layouts and a right-aligned CTA (WhatsApp/Contact); implement a footer (#262729) with dealer info, contact identity (Fuad + provided details), social links, and visitor statistics from backend.
- Add a sticky Bottom CTA Bar with actions (Call/WhatsApp/Credit Simulation/Main Menu) using specified colors and a slide-up menu with multilevel items.
- Build CMS-driven Home sections (banner slider, featured grids, CTA banner, About section #F1C40F, features, WhatsApp CTA, search, latest 5 blog posts).
- Implement vehicle listing + detail pages:
  - Passenger listing grid (4/3/2) and passenger detail pages with admin-managed variants/colors, availability rules, gallery, specs/features tabs, CTA buttons, and brochure download.
  - Commercial page with the three category groupings and specified type lists; commercial detail pages with static image, required chassis price label, optional note, specs/features, optional gallery, badges, and CTAs including brochure download.
- Implement Promo page (banner/description/period/terms), Testimonials page (photo placeholder/name/city/review), Blog list + detail with SEO metadata and interactions (like/share/comments with admin moderation).
- Implement Contact page with stable-stored contact form (fields as specified), configurable Google Maps iframe embed via CMS, and sales consultant profile; implement Credit Simulation submissions stored in creditSimulations and accessible from the bottom CTA.
- Add product interactions for vehicles (like + share to WhatsApp/Facebook/X/Copy Link) with stable persistence; track visitor statistics (total visitors, active users, page views, today traffic) displayed in footer and viewable/editable (if enabled) in admin.
- Seed stable CMS content: 6 SEO-optimized blog posts (200–300 words) + 6 testimonials with placeholder images; generate and attach AI placeholder media for vehicles/blog/testimonials that is replaceable via media manager.
- Apply cohesive frontend theme (colors/typography/spacing) respecting required color constants and implement basic SEO/performance (meta title/description, image optimization approach, lazy-loading, responsive UI).

**User-visible outcome:** Visitors can browse an automotive dealer site with responsive navigation, vehicle listings/details, promos, testimonials, blog (with likes/shares/comments), contact and credit simulation forms, and always-visible CTAs; admins can log into `/admin` to manage all content and media, with data and uploaded assets persisting safely across canister upgrades/redeploys.
