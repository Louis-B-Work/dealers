# light-video — Light, video-led

A premium, light/clean dealer website template led by a **full-bleed hero video**. Built as a
standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app for fast visual drafting.

Design direction is inspired by clean premium dealerships (e.g. Acklam Cars) with tasteful
on-scroll reveals, hover states, a sticky transparent→solid nav and a parallax video hero.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  main.ts, App.vue, router.ts, style.css   # entry, shell, routing, design tokens
  data/          vehicles.ts, dealer.ts      # mock inventory + dealership details
  composables/   useScrollReveal, useStickyNav, useVehicleFilters
  components/
    layout/      TheNav, TheFooter
    home/        HeroVideo, SearchBar, FeaturedVehicles, UspStrip,
                 FinanceCta, ValuationCta, Reviews, BrandStory
    shared/      VehicleCard, VehiclePlaceholder, SectionHeading,
                 EnquiryForm, AppIcon, SelectMenu
  views/         HomeView, VehiclesView (VLP), VehicleDetailView (VDP), ContactView
```

## Theming

All colours and key scales are CSS custom properties defined at the top of
[`src/style.css`](./src/style.css) and surfaced through
[`tailwind.config.js`](./tailwind.config.js). Change the `--c-*` tokens to re-skin the whole
template (accent, surfaces, text, borders).

## Hero video

The hero plays a hotlinked [Pexels](https://www.pexels.com/video/26542243/) clip (autoplay, muted,
looped) defined by the `heroVideoSrc` constant in
[`src/components/home/HeroVideo.vue`](./src/components/home/HeroVideo.vue).
[`public/hero-poster.svg`](./public/hero-poster.svg) is the poster, shown until the clip loads and
if the CDN is unreachable. To self-host instead, drop a file in `public/` and point
`heroVideoSrc` at it.

## Typography

**Instrument Sans** (loaded from Google Fonts in [`index.html`](./index.html)) is currently the
only typeface. Both the `sans` and `display` Tailwind families map to it, so `font-display`
remains the seam for reintroducing a second face later.

## Notes

- All vehicle data is **mock** (`src/data/vehicles.ts`); wire a real API/store in later.
- Motion respects `prefers-reduced-motion`.
- One of four drafts; the others are `dark-sidebar`, `minimal-editorial` and `warm-budget`.

## Port notes

For whoever ports this into the production web component library. Written while the
design reasoning was fresh; the decisions below are deliberate, not incidental.

**Suits:** a dealership whose stock rewards being shown moving — performance and
specialist cars — and whose buyers expect a restrained, cinematic site.

**Homepage order:** `HeroVideo`, `UspStrip`, `FeaturedVehicles`, `FinanceCta`,
`ValuationCta`, `BrandStory`, `Reviews`.

**Fixed spine — do not make these reorderable or removable:**

- `TheNav` must stay sticky and must begin transparent, solidifying on scroll. This is
  only coherent because `HeroVideo` is full-viewport and sits directly beneath it; if
  the hero is moved, made shorter, or preceded by anything, the nav transition reads as
  a bug rather than an effect.
- `HeroVideo` must be first and full-bleed.
- `TheFooter` last.

**Reorderable:** `UspStrip`, `FeaturedVehicles`, `FinanceCta`, `ValuationCta`,
`BrandStory`, `Reviews`. These are genuinely independent sections.

**Data each section needs:** `dealer` (name, phone, address, opening hours, socials,
rating) for nav, footer and contact; `vehicles` for `FeaturedVehicles` and the card
components; `REPRESENTATIVE_APR` plus `brokerDisclosure` on **every** surface that
shows a price. All of this is static in `src/data/` and must become props or store
reads in production.

**Do not change without checking with me:** the on-scroll reveals assume sections enter
the viewport one at a time — a denser layout makes them fire simultaneously and the
effect collapses. `VehicleCardOverlay` is a distinct variant from `VehicleCard`, used
where a card sits over imagery; both are needed.

**Known open questions:** the finance basis (HP vs PCP, deposit assumptions) is not
settled — see `docs/adr/0002-monetary-figures-derive-from-apr.md`. Themes are not wired
here; this template ships one hardcoded palette and production theming is still to be
decided.
