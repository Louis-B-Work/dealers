# bright-mosaic — Bright, budget showroom wall

A bright, budget-friendly dealer website template that opens on **the stock itself**.
The hero is a *showroom wall*: every car as a photo tile, packed into staggered columns of
mixed heights so the cards interlock as one shape rather than sitting side by side in a
grid. Hovering a tile reveals a white glass **base label** with make, model and a yellow
cash-price sticker.

It started as a dark, premium mosaic and was turned around for the everyday end of the
market. The background is light, the stock is small hatchbacks and family cars under
£15,000, and the page leads on **what you can spend**: shop-by-budget chips sit in the
hero, the VLP has a Budget filter, and the featured bento runs cheapest first.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app for fast visual
drafting. It was scaffolded from [`light-video`](../light-video), so the page set and
data layer match the other drafts like for like.

## Getting started

```bash
npm install
npm run dev      # localhost:5178
npm run build    # type-check (vue-tsc) + production build
```

## Structure

```
src/
  main.ts, App.vue, router.ts, style.css   # entry, shell, routing, design tokens
  data/          vehicles.ts, dealer.ts      # mock inventory (+ photo map) + dealership details
  composables/   useScrollReveal, useStickyNav, useVehicleFilters (+ BUDGET_BANDS)
  components/
    layout/      TheNav, NavDropdown, TheFooter
    home/        HeroMosaic, SearchBar, FeaturedBento, FinanceCta,
                 ValuationCta, Reviews
    shared/      MosaicCard, VehiclePlaceholder, SectionHeading,
                 EnquiryForm, AppIcon, SelectMenu
  views/         HomeView, VehiclesView (VLP), VehicleDetailView (VDP),
                 ContactView, StubView, CardLabView
public/
  cars/          local stock photos + CREDITS.md
```

## The showroom wall

[`HeroMosaic.vue`](./src/components/home/HeroMosaic.vue) splits the hero into a copy
column (headline, search, budget chips, CTAs) and the wall. The wall is three columns
(two below `xl`). Each tile takes its aspect ratio from `HERO_LAYOUT`, and each column is
shifted down by `COLUMN_OFFSETS` (top padding). The different heights plus the offsets
are what make the tiles interlock. The ratios are all landscape or square (1/1, 4/3, 3/2)
because everyday stock photos are shot landscape; tall tiles crop them badly. On large
screens the wall is exactly one viewport tall, and `fitWall()` hides any tile that would
run past the bottom, so **every car on the wall is shown in full**: none are cropped or
faded. Bigger screens show more cars. It re-runs on resize. On mobile each column is cut
to `MOBILE_TILES_PER_COLUMN` tiles.

## Shop by budget

`BUDGET_BANDS` in
[`useVehicleFilters.ts`](./src/composables/useVehicleFilters.ts) is the one list of
price ceilings. It drives:

- the hero's **"Shop by budget"** chips, each linking to `/vehicles?maxPrice=…` with a
  yellow count of matching cars. Bands with no cars, or that match the whole stock, are
  hidden.
- the "all under £X" line in the hero copy (the first band above the dearest car).
- the **Budget** select on the VLP, which reads `maxPrice` from the query string.

These are filter thresholds, not finance figures.

## The card

[`MosaicCard.vue`](./src/components/shared/MosaicCard.vue) is the only vehicle card in
the template: hero, bento, VLP and "you may also like" all use it. It fills whatever box
its parent gives it, so the layout owns the shape and the card owns the content.

- The base label is a rounded white glass bar with make & model and a yellow
  `.price-pill` cash price. It slides up on `:hover` **and** on `:focus-visible`, so
  keyboard users get the same reveal.
- On touch devices and below `md` the label is always visible, because hover does not
  exist there.
- `large` gives the bigger label (adds the year), used by the bento's lead tile.
- Under `prefers-reduced-motion` the label fades in without moving.

## Featured bento

[`FeaturedBento.vue`](./src/components/home/FeaturedBento.vue) lays out the featured
cars, **cheapest first**, on a 6-column grid. The lead tile is 4×2, two tiles stack
beside it, and a row of three sits underneath. Tile spans live in `TILE_CLASSES`.

## Theming

Light is the only mode. Tokens are semantic, as in the other drafts: `paper` is the
page, `ink` is text on it, and `surface` is the raised white card colour. They are
defined at the top of [`src/style.css`](./src/style.css) and surfaced through
[`tailwind.config.js`](./tailwind.config.js). The accent is a friendly blue, `deal` is
the yellow price-sticker colour, and the type is **Plus Jakarta Sans**. Buttons are
pills. The footer is navy so the page has a firm base.

## Compliance

Finance wording and figures come from [`src/data/dealer.ts`](./src/data/dealer.ts)
(`REPRESENTATIVE_APR`, `representativeExample`, `brokerDisclosure`). Monthly figures
derive from the APR via `monthlyPaymentFor`.

- **Cards show the cash price only.** A tile is too small to carry the representative
  APR and broker disclosure next to a monthly figure, so it carries no monthly figure.
- Monthly figures appear only on the **VDP** price panel and in the home
  **FinanceCta** calculator (range £3,000–£15,000 to match the stock), and each sits
  beside the representative example and broker disclosure.
- The footer carries the broker disclosure sitewide.

## Notes

- All vehicle data is **mock**. Each car has its own photo of the actual model, stored
  in [`public/cars/`](./public/cars) and mapped in `VEHICLE_PHOTOS`
  (`src/data/vehicles.ts`). They are Wikimedia Commons images under CC licences;
  authors and licences are in [`public/cars/CREDITS.md`](./public/cars/CREDITS.md).
  Real stock photos replace them when ported.
- `/card-lab` renders `MosaicCard` without site chrome, as a grid tile and as a hero
  tile.

## Port notes

For whoever ports this into the production web component library.

**Suits:** a budget or volume dealership whose buyers start from a price, not a make,
and who want to see the whole forecourt at a glance.

**Homepage order:** `HeroMosaic`, `FeaturedBento`, `FinanceCta`, `ValuationCta`,
`Reviews`.

**Fixed spine — do not make these reorderable or removable:**

- `HeroMosaic` must be first. The interlocking wall **is the template**. If you flatten
  it into an even grid or a carousel, the result is just another card grid.
- `MosaicCard`'s hover-reveal base label is the template's one interaction. Keep the
  touch and focus fallbacks with it.
- `TheNav` first and `TheFooter` last.

**Reorderable:** `FeaturedBento`, `FinanceCta`, `ValuationCta`, `Reviews`.

**Data each section needs:** `vehicles` with a real photo each (the wall depends on
photography, and placeholders make it look broken); `dealer` for nav, footer and
contact; `REPRESENTATIVE_APR` plus `brokerDisclosure` on every surface that shows a
monthly figure. `BUDGET_BANDS` should become dealer config, because a dealer selling
around £20k needs different ceilings. Everything is static in `src/data/` and will need
to become props or store reads.

**Do not change without checking with me:**

- The aspect ratios in `HERO_LAYOUT` and the offsets in `COLUMN_OFFSETS` were tuned
  together, so changing one unbalances the wall.
- Keep monthly figures off the cards (see Compliance).

**Known open questions:**

- With very little stock (fewer than about 8 cars), the wall needs a rule: either repeat
  tiles or switch to a shorter layout.
- Whether the budget chips should count stock live or be fixed links.
- The finance basis is still unsettled; see
  `docs/adr/0002-monetary-figures-derive-from-apr.md`.
