# stock-marketplace: stock-first dealer template

A dealer website template where **the homepage is the stock**. Instead of a hero and a search
box, the page opens on a sticky filter sidebar beside a dense results grid, with a
**cash price / per month** toggle that changes both the figure shown and the budget filter.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app. Its data layer, finance
kernel and page set match the other Vue templates.

## Getting started

```bash
npm install
npm run dev      # localhost:5180
npm run build    # type-check (vue-tsc) + production build
```

## What is in it

- **Stock browser** (`components/home/StockBrowser.vue`): search, make and dependent model, body
  type, transmission, fuel, price or monthly limit, year and mileage. Sort, grid or list view,
  removable filter chips, an empty state and "show more". Below `lg` the filters become a modal drawer.
- **Filters live in the URL** (`composables/useStockSearch.ts`), so a search can be bookmarked,
  shared and survives a refresh. The same filter logic produces the results and the facet counts.
- **Pages**: home, `/vehicles`, `/vehicles/:id` (sticky finance panel), `/finance`, `/sell`,
  `/about`, `/contact`, `/mot`, `/warranty`, `/body-shop`, `/breakdown` and `/privacy`. The four
  care pages share `ServiceView.vue` and read their copy from `data/content.ts`.
- **Forms are demo-only.** They validate, state clearly that nothing is sent or stored, and never
  produce an offer, valuation or booking.

## Finance

`data/dealer.ts` holds the shared finance kernel, copied verbatim from the other templates. Every
monthly figure comes through `monthlyPaymentFor`, so cards, calculators and the detail panel
cannot disagree. `npm run check:finance` at the repository root enforces this, so do not
hard-code a `monthlyFrom` value.

## Re-branding

The palette is a few CSS variables in `src/style.css`. Orange (`--c-accent`) is used only for
actions and prices, so changing it re-brands the template. Dealer details are in `data/dealer.ts`
and stock in `data/vehicles.ts`.

## Images

Hatchback photos are bundled in `public/cars/` and credited in `public/cars/CREDITS.md`. The
larger cars are hotlinked from Pexels and Unsplash and need a network connection.
