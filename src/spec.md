# Specification

## Summary
**Goal:** Fix Admin navigation highlighting for vehicle categories, restore a richer Vehicle Add/Edit experience, make Media Manager/Picker reliably show assets with correct empty/loading/error states, and improve the public vehicle listing + detail UI polish.

**Planned changes:**
- Fix Admin sidebar active-state logic so Passenger Vehicles and Commercial Vehicles menu items are visually separated and only the correct one is highlighted based on the current `category` query param.
- Upgrade the Admin Add/Edit Vehicle dialog to support richer editing: variants list (name, price adjustment, feature list, premium flag), technical specs fields (engine, transmission, dimensions, weight, fuel capacity, suspension), and an “Additional features” list.
- For Commercial vehicles only, add checkbox controls for commercial badges/features (Economical, Power, Speed, Capacity, Bus, 4x2, 6x2, 6x4); hide/disable these controls for Passenger vehicles.
- Ensure the Vehicle editor continues to use the existing MediaPickerDialog for Image and Brochure selection and saves selected URLs into `imageUrl` and `brochure`, while remaining compatible with existing create/update calls (including bigint/nat conversions).
- Fix Admin Media Manager and MediaPickerDialog to reliably render existing assets in a responsive grid and to show an English empty state message exactly: “No media yet.” when none exist.
- Improve Media Manager/Picker error handling to show an English message prompting re-login when loading fails due to missing/expired admin session, without crashing.
- Improve public vehicle listing grid and vehicle card styling (spacing, typography, hierarchy, hover states) while keeping existing routes, links, data wiring, and responsive behavior; preserve placeholder fallbacks when `imageUrl` is empty.
- Improve Passenger and Commercial vehicle detail page UI polish (layout, spacing, sectioning) while keeping existing behavior (e.g., Passenger variant selection if variants exist; Commercial constraints like no variant/color switcher), ensuring placeholders and empty optional fields render cleanly, and keeping all user-facing text in English.

**User-visible outcome:** Admin users can clearly see which vehicle category they’re managing, edit vehicles with a richer CMS-like form (including variants/specs and commercial badges), and reliably pick/manage media with clear English empty/error states. Public users see more professional vehicle listing cards and more polished vehicle detail pages that still work even without uploaded media.
