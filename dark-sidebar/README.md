# dark-sidebar — Dark, side navigation

A premium, dark dealer website template built around a **left sticky sidebar navigation**: the
nav occupies a fixed column down the left edge of the viewport and every page section runs
full-bleed across the remaining width. Led by a **full-bleed hero video**.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app for fast visual drafting,
alongside (not inside) [`light-video`](../light-video).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the production build
```

## Structure

Site structure and page set follow template 01, so the two can be compared like for like.

```
src/
  main.ts, App.vue, router.ts, style.css   # entry, shell, routing, design tokens
  data/          vehicles.ts, dealer.ts      # mock inventory + dealership details
  composables/   useScrollReveal, useVehicleFilters
  components/
    layout/      SideNav, BrandMark, TheFooter
    home/        HeroVideo, SearchBar, UspStrip, FeaturedVehicles,
                 FinanceCta, ValuationCta, BrandStory, Reviews
    shared/      VehicleCard, VehiclePlaceholder, SectionHeading, PageHeader,
                 EnquiryForm, AppIcon, SelectMenu
  views/         HomeView, VehiclesView (VLP), VehicleDetailView (VDP),
                 ContactView, StubView, CardLabView
```

## Layout

[`App.vue`](./src/App.vue) renders [`SideNav`](./src/components/layout/SideNav.vue) as a fixed
column and offsets the page by exactly its width (`--nav-w`). Below `lg` the column collapses to
a fixed top bar (`--nav-h`) and the same panel slides in from the left as a drawer.

Because the column is fixed rather than a flex sibling, every section is free to run edge to edge
across the remaining viewport; horizontal alignment is owned by the single `.u-gutter` class.

## Theming

Dark is currently the only mode. All colours and key scales are CSS custom properties defined at
the top of [`src/style.css`](./src/style.css) and surfaced through
[`tailwind.config.js`](./tailwind.config.js).

Token names are deliberately semantic — `paper` is *a surface*, `ink` is *text on it* — rather
than literal, so the planned **light mode** is a value swap on the `:root` block alone and needs
no component changes.

## Look & feel

Where template 01 uses 16px radii, white cards and soft drop shadows, template 02 is built from:

- near-square geometry (2px radii)
- hairline rules and divided strips instead of shadows — a drop shadow on near-black reads as a
  smudge, so elevation comes from borders and surface steps
- numbered section counters (`01`, `02`…) tying sections to the sidebar's numbered nav
- a champagne accent (`#d9c08c`) used sparingly against near-black surfaces
- **DM Sans** for display type against **Work Sans** for everything functional — a geometric
  grotesk for headings paired with a versatile grotesk body, no serif

## Hero video

The hero plays a hotlinked [Pexels](https://www.pexels.com/video/20156198/) clip (autoplay, muted,
looped) defined by the `heroVideoSrc` constant in
[`src/components/home/HeroVideo.vue`](./src/components/home/HeroVideo.vue). Pexels only publishes
this clip at UHD, so it is a large file; drop a compressed copy in `public/` and repoint
`heroVideoSrc` if that matters. [`public/hero-poster.svg`](./public/hero-poster.svg) is the poster,
shown until the clip loads and if the CDN is unreachable.

## Compliance

Regulated finance wording follows template 01 and is centralised in
[`src/data/dealer.ts`](./src/data/dealer.ts) (`REPRESENTATIVE_APR`, `representativeExample`,
`brokerDisclosure`) so the calculator, the vehicle cards and the VDP can never quote different
figures. The rules applied here:

- every **card** that shows a monthly figure carries the representative APR and the credit-broker
  disclosure — per card, not once per row
- the home **finance calculator** is labelled "for illustration purposes only", subject to status,
  and shows the representative example beside the figure it produces
- the **VDP** repeats the representative example and broker disclosure next to the price
- the **footer** carries the broker disclosure, the limited-panel-of-lenders statement and the
  representative example sitewide

## Notes

- All vehicle data is **mock** (`src/data/vehicles.ts`); wire a real API/store in later.
- Motion respects `prefers-reduced-motion`.
- `/card-lab` renders the vehicle card without site chrome, at each column width it meets in the
  grid (the card is container-query driven).

## Port notes

For whoever ports this into the production web component library. Written while the
design reasoning was fresh; the decisions below are deliberate, not incidental.

**Suits:** a dealership wanting a showroom-dark, gallery-like site, where the stock
carries the colour and the interface gets out of its way.

**Homepage order:** `HeroVideo`, `UspStrip`, `FeaturedVehicles`, `FinanceCta`,
`ValuationCta`, `BrandStory`, `Reviews`.

**Fixed spine — do not make these reorderable or removable:**

- `SideNav` is a fixed full-height column down the left edge, and every section runs
  full-bleed across the remaining width. **This is the entire template.** Converting it
  to a top bar leaves a design indistinguishable from `light-video` and there is
  then no reason for this template to exist.
- `HeroVideo` must be first and must fill the width left by the side nav.
- `TheFooter` last, inside the same offset column.

**Reorderable:** `UspStrip`, `FeaturedVehicles`, `FinanceCta`, `ValuationCta`,
`BrandStory`, `Reviews`.

**Data each section needs:** `dealer` (name, phone, address, opening hours, socials,
rating) for nav, footer and contact; `vehicles` for `FeaturedVehicles` and the card
components; `REPRESENTATIVE_APR` plus `brokerDisclosure` on **every** surface that
shows a price. All static in `src/data/`; must become props or store reads.

**Do not change without checking with me:** there is no `TheNav` and no `NavDropdown`
here by design — `SideNav` and `BrandMark` replace them. The left column's width is
load-bearing for every section's measure; changing it rebalances the whole page.

**Known open questions:** the finance basis (HP vs PCP, deposit assumptions) is not
settled — see `docs/adr/0002-monetary-figures-derive-from-apr.md`. Themes are not wired
here; this template ships one hardcoded dark palette, and a light theme would need the
side nav's contrast rethought rather than merely recoloured.
