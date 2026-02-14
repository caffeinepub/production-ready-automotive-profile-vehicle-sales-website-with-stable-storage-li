# Specification

## Summary
**Goal:** Refresh the public UI by standardizing icons to Heroicons, improving mobile typography, removing the homepage main banner slider, and polishing the Bottom CTA bar and public dropdown/menu styling—without changing any admin UI or behavior.

**Planned changes:**
- Replace public-facing icons that currently use `lucide-react` and `react-icons` with Heroicons (`@heroicons/react`) across public pages and shared public components (no `/admin` changes).
- Reduce oversized mobile title typography in shared public title components (e.g., `SectionTitle`) and the home hero title, while preserving md+ sizing.
- Remove the Main Banner Slide/carousel from the public Home page while keeping other Home sections and existing data wiring intact.
- Update the mobile Bottom CTA Bar to be 50px tall and square-cornered, keeping the same four actions and existing color blocks.
- Reposition the Bottom CTA Bar “Main Menu” dropdown to open directly above the blue “Main Menu” button, and apply minimalist visual polish to public dropdown/sheet menus (e.g., Bottom CTA menu and Navbar mobile sheet) without changing navigation items or behavior.

**User-visible outcome:** On the public site, icons appear consistently in the Heroicons style, mobile titles look better balanced, the homepage no longer shows the main banner slider, the Bottom CTA bar is slimmer with square corners, and public menus/dropdowns look cleaner with the Bottom CTA “Main Menu” opening directly above its button.
