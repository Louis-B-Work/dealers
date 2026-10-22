# noir-collection: dark, premium dealer template

A dark, premium dealer website template in warm black and ivory with a single champagne accent.
A thin make and model search sits in the header on every page. The homepage opens on a full-bleed
**spotlight** band that cycles through every car in stock. Each photograph is shown whole, never
cropped, over a blurred copy of itself, with the car's details on a black strip beneath. The hero
fits the screen height so the name and buttons are always in the first view. It then presents the stock as a **numbered catalogue**, like a collector's lot list, with a photo that follows the pointer on
desktop.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app. The stock data and finance
kernel come from [`dark-sidebar`](../dark-sidebar). The page set and URL-driven filtering match
[`stock-marketplace`](../stock-marketplace).

## Getting started

```bash
npm install
npm run dev      # localhost:5181
npm run build    # type-check (vue-tsc) + production build
```

## What is in it

- **Spotlight hero** (`components/home/SpotlightHero.vue`): cycles through the whole stock, leading
  with the strongest photographs. A counter, one progress segment per car (each a keyboard-operable
  tab) and previous, pause and next buttons. It advances every seven seconds, pauses on hover,
  focus, the pause button or when scrolled out of view, and stays still for reduced motion. Photos
  load as they come up rather than all at once.
- **Header search** (`components/layout/NavSearch.vue`): a thin bar fixed under the menu on every page.
  Make, then model, with a live count; it opens the collection filtered to that choice and mirrors the
  collection's filters while you are on it.
- **Catalogue list** (`components/shared/CatalogueList.vue`): numbered rows with a pointer-following
  preview on hover-capable screens and thumbnails on phones. The collection page can switch to a
  two-column gallery of large cards.
- **Collection search** (`composables/useCollectionSearch.ts`): search, marque, model, body style, price,
  year, sort and layout, all kept in the URL so a view can be shared.
- **Vehicle page**: full-bleed photograph, spec sheet, a sticky finance panel with deposit and term
  controls, and a **private viewing request** with a preferred date and time.
- **Pages**: finance, sell or part-exchange, about, contact, MOT, warranty, body shop, breakdown and
  privacy. Forms are demo-only: they validate, say clearly that nothing is sent or stored, and never
  produce an offer, valuation or booking.

## Finance

`data/dealer.ts` holds the shared finance kernel, copied verbatim. Every monthly figure goes
through `monthlyPaymentFor`; `npm run check:finance` at the repository root enforces this.

## Re-branding

Colours are CSS variables in `src/style.css`. Champagne (`--c-accent`) is used only for actions,
prices and small highlights, so changing it re-brands the template. The typeface is Manrope throughout:
light and tightly set for headlines, regular for text.

## Images

Every car has its own Wikimedia Commons photo of the model, bundled in `public/cars/` at 1600px and
credited in `public/cars/CREDITS.md`. Each car's stated colour was matched to its photo. Replace
them with real stock photography before anything goes live.
