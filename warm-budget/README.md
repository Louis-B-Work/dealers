# warm-budget — Warm, friendly, budget-led

A **warm, friendly, budget-led** dealer website template: still a good-looking site, but built for an
ordinary used-car forecourt rather than a specialist. It opens by asking the only question a
budget buyer always knows the answer to — **how much can you spend?** — and it asks it in whichever
of the two currencies they actually think in, total price or monthly payment.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app for fast visual drafting,
alongside (not inside) [`light-video`](../light-video), [`dark-sidebar`](../dark-sidebar)
and [`minimal-editorial`](../minimal-editorial).

Visually inspired by [HPL Motors](https://hplmotors.co.uk/) — warm, rounded, friendly, budget-led —
with the structural restraint of
[Lawrence Warner](https://www.lawrencewarnerspecialistcars.co.uk/): a plain top bar, the search
straight into the hero, and no theatrics anywhere.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the production build
```

## Structure

Site structure and page set follow the other templates, so all four can be compared like for
like.

```
src/
  main.ts, App.vue, router.ts, style.css   # entry, shell, routing, design tokens
  data/          vehicles.ts, dealer.ts,     # mock inventory + dealership details & finance maths
                 brands.ts                   # stocked marques for the brand strip
  composables/   useStickyNav, useVehicleFilters, useMarquee, useDragScroll
  components/
    layout/      TheNav, NavDropdown, BrandMark, TheFooter
    home/        Hero, SearchBar, BrandStrip, UspStrip, TrendingSearches,
                 FeaturedVehicles, PromiseCards, FinanceCta, ValuationCta, Reviews
    shared/      VehicleCard, VehiclePlaceholder, SelectMenu, SectionHeading,
                 PageHeader, EnquiryForm, AppIcon
  views/         HomeView, VehiclesView (VLP), VehicleDetailView (VDP),
                 ContactView, StubView, CardLabView
```

There is **no `useScrollReveal`**. See [Motion](#motion).

## Layout

[`App.vue`](./src/App.vue) renders [`TheNav`](./src/components/layout/TheNav.vue) as a fixed top bar
and offsets the page by exactly its height (`--nav-h`) — the same arrangement as templates 01 and
03. The bar is the plain one: wordmark left, links in the middle, a solid teal phone button on the
right. Below `lg` the links collapse into a drawer, and the phone button stays, shortened to
"Call us" — on a forecourt this size the phone is the primary conversion, so it never leaves the bar.

Scrolling condenses the bar from `--nav-h` to `--nav-h-scrolled`. The two sticky elements on the
site (the VLP filter rail, the VDP purchase panel) offset against `--nav-h-scrolled` rather than
`--nav-h`, because by the time anything reaches the top of the viewport the bar has already
condensed — offsetting against the taller value leaves a strip of page showing through.

### The dark slab

The homepage hero is a **dark block with rounded bottom corners** sitting on the cream page. The
same shape reappears at a third of the height as
[`PageHeader`](./src/components/shared/PageHeader.vue) on every inner page, so the whole site opens
the same way and the header never needs its own photograph.

### The homepage

One column, full width, top to bottom:

```
┌──────────── hero (dark, rounded foot) ─────────────┐
│  headline · subhead                                 │
│  ┌───────────────────────────────────────────────┐  │
│  │ Total price | Monthly budget                  │  │   ← the search bar lives
│  │ [budget ▾] [make ▾] [model] [ Search (17) ]   │  │     inside the hero block
│  └───────────────────────────────────────────────┘  │
│  ★ 4.8 · no-haggle pricing · all credit histories   │
└─────────────────────────────────────────────────────┘
  Brands → Popular searches → USPs → Latest arrivals → Promises
       → Finance → Valuation → Reviews
```

No two-column spread and no sticky stock rail: this template is the simple one. A shopper who
has answered "what's my budget?" in the hero should be able to fall straight down the page to the
stock that matches it, and meet the same budget question twice more on the way — once as
[`TrendingSearches`](./src/components/home/TrendingSearches.vue) and once as
[`FinanceCta`](./src/components/home/FinanceCta.vue).

## Search bar

[`SearchBar`](./src/components/home/SearchBar.vue) keeps the other templates' single-row
footprint rather than `minimal-editorial`'s guided wizard — a standard dealership's customers
already know how a search bar works — but reorders it so **budget comes first**, and adds the one
control the other templates have no use for:

> **Total price | Monthly budget**

The toggle switches the leading control between a maximum total price and a maximum monthly
payment, and the results filter on `price` or on `monthlyFrom` accordingly. Switching the toggle
**clears the answer**, because £10,000 is not £10,000 a month.

- Budget is a **select of bands**, not a slider. A slider is the more expressive control and that
  is exactly why template 03 uses one; here the quieter control is the right one, and a band is how
  a budget buyer already thinks ("about eight grand").
- Every option carries a **live count**, including the budget bands, so the bar shows what the
  forecourt actually holds before the shopper commits to a search.
- Choosing a budget that empties the selected make **clears the make** rather than leaving a
  dead "(0)" in the control.
- Answers hand off to the VLP as `maxPrice` / `maxMonthly` / `make` / `q` query params, and the VLP
  opens in whichever budget mode it was given.

A shopper with nothing to buy is offered the other thing they might want — *or sell us your car* —
right next to the button.

## Vehicle card

[`VehicleCard`](./src/components/shared/VehicleCard.vue) is photo-first, the opposite of template
03's name-first card. A budget shopper scans pictures and prices; the name is confirmation.

```
┌───────────────────────────────┐
│ 📷 22              Low mileage│   ← photo count, then any status badge
│            photo              │
└───────────────────────────────┘
Ford Fiesta
2019 (19) 1.0 EcoBoost Zetec 5dr
[34,200 miles] [Petrol] [Manual] [Hatchback]
──────────────────────────────────────────
£8,495                    £186 a month
Representative 11.9% APR. … credit broker, not a lender.
```

The **monthly figure is the only thing on the card set in the accent**, because on a budget
forecourt it is what most shoppers are actually comparing. A vehicle with no finance figure shows
`Cash sale only` in its place — and, critically, **no APR and no broker disclosure**, because it
quotes no figure. A vehicle with no price at all renders as `POA`.

Hover is a **border darken plus a slightly larger shadow, and the title turning teal**. Nothing
scales, nothing moves, nothing fades.

The card is container-query driven, so it is correct in the 4-up VLP grid, the 3-up homepage row and
the card lab without any width props. Below 280px the fourth spec chip is dropped rather than
allowed to wrap the price row. [`/card-lab`](./src/views/CardLabView.vue) renders it at each width
it actually meets, plus the two edge cases (no finance figure, no price).

## Finance maths

Every monthly figure on the site comes out of two functions in
[`src/data/dealer.ts`](./src/data/dealer.ts) — `monthlyPaymentFor` and `amountBorrowableFor` — so
the cards, the homepage calculator and the VDP panel cannot quote arithmetic that disagrees.

- `monthlyFrom` is **never authored by hand**. The inventory records a `financeAvailable` flag, and
  the figure is derived from the price at `QUOTE_TERM_MONTHS` (60) with no deposit — which is what
  makes a *from* price literally true.
- Both calculators **open on that same 60-month term**, so their first reading matches the "from"
  figure printed directly above them; shortening the term is then visibly a trade-off the shopper
  made, not a discrepancy.
- The APR is converted to an **effective monthly rate**, not divided by twelve, which would
  understate the cost of credit.
- The homepage calculator runs the formula **backwards** — budget in, amount of credit out — because
  that is the direction this template's customers think in. It rounds the answer *down* to the
  nearest £50, so the headline figure is never more flattering than the arithmetic.

## Theming

All colours and key scales are CSS custom properties defined at the top of
[`src/style.css`](./src/style.css) and surfaced through
[`tailwind.config.js`](./tailwind.config.js). Token names are semantic — `paper` is *a surface*,
`ink` is *text on it* — matching templates 01, 02 and 03 so all four can be read side by side.

The palette is **cream, near-black and teal**:

- `--c-paper` is a warm cream, not white, and cards lift off it by being **white**. That inversion
  is the whole trick: template 03 separates surfaces with hairlines on white, this one separates
  them with warmth.
- `--c-accent` is teal, and it owns **every interactive element** — buttons, links, prices, focus
  rings, active states.
- `--c-highlight` is a single warm amber, used only for badges and one of the three promise cards,
  so the page is not single-hue. It is never used on a control.
- `--c-danger` exists. Unlike template 03's monochrome palette, this one leaves red free to mean
  "wrong", so form errors are marked by colour **and** a doubled border — never by colour alone.

Two exceptions to the palette, both deliberate:

- the **registration plate** on the valuation form keeps its statutory yellow and blue GB flash,
  because the colour is legally part of what a UK number plate is
- **vehicle photography** stays in colour

## Look & feel

Where template 03 is square, light and wide-tracked, this one is built from:

- **generous radii** — 20px panels, 14px tiles, and every button a full pill
- **two typefaces** — **Poppins** for headings and prices, **Inter** for reading. Poppins at body
  size in long paragraphs is wide and tiring; Inter is not, and the pairing is warmer than one
  grotesk doing both jobs
- **sentence case throughout** — none of the other drafts' wide uppercase tracking
- **plain, second-person copy** — "Let's get you driving", not "handpicked, delivered with care"
- **spec pills** rather than label/value rows, because four short facts read faster as chips
- **flat blocks of colour** doing the work that photography and gradients do on the premium
  templates

## Motion

There is **no scroll-reveal and no entrance animation** in this template. Every section is painted
in its final state on load. The only transitions in the build are:

- 150ms colour, border and shadow moves on hover
- a 1px lift on buttons

No image zoom, no greyscale-to-colour, no scrim transitions, no parallax, no menu slide. The one
`@keyframes` in [`tailwind.config.js`](./tailwind.config.js) is a skeleton pulse, which is
information rather than decoration.

Under `prefers-reduced-motion` even the 150ms transitions are dropped, along with smooth scrolling.

## Compliance

Regulated finance wording follows templates 01–03 and is centralised in
[`src/data/dealer.ts`](./src/data/dealer.ts) (`REPRESENTATIVE_APR`, `representativeExample`,
`brokerDisclosure`, `lenderPanelDisclosure`, `calculatorDisclaimer`). The representative example is
carried over verbatim from templates 02 and 03 — its figures are already internally consistent, so
they are reused rather than re-derived. The rules applied here:

- every **card** that shows a monthly figure carries the representative APR and the credit-broker
  disclosure — per card, not once per row. A card with no finance line carries neither, because it
  quotes no figure
- the home **finance calculator** is labelled "for illustration purposes only", not a quotation, and
  shows the representative example and the broker/lender-panel wording beneath it
- the **VDP** repeats the disclaimer, the representative example and the broker disclosure in the
  purchase panel, next to the figures they describe
- a **monthly-budget search excludes cash-only vehicles entirely**, because a car we quote no
  monthly figure for cannot satisfy a monthly budget
- the **footer** carries the broker disclosure, the limited-panel-of-lenders statement and the
  representative example sitewide

## Notes

- All vehicle data is **mock** (`src/data/vehicles.ts`): 17 budget cars from £3,995 to £18,995,
  2015–2022, 18k–82k miles, mainstream makes only. Two are deliberately cash-only so the "no finance
  figure" path is always exercised. Wire a real API/store in later.
- `bodyType` adds `MPV` to the union the other templates use.
- The hero photograph and the card stand-in are hotlinked [Pexels](https://www.pexels.com/) stills.
  If the CDN is unreachable the hero falls back to
  [`public/hero-poster.svg`](./public/hero-poster.svg) and
  [`VehiclePlaceholder`](./src/components/shared/VehiclePlaceholder.vue) falls back to a tinted well
  with a car silhouette, so neither is ever an empty box.
- [`SelectMenu`](./src/components/shared/SelectMenu.vue) wraps a **native `<select>`** rather than
  the other drafts' hand-built listbox: it opens natively on mobile, needs no keyboard handling of
  our own, and cannot animate.
- `/card-lab` renders the vehicle card without site chrome, at each column width it meets on the
  site.

## Port notes

For whoever ports this into the production web component library. Written while the
design reasoning was fresh; the decisions below are deliberate, not incidental.

**Suits:** a dealership selling regular, lower-priced stock. The governing constraint
is that a budget buyer must not feel intimidated — every choice below follows from
that, and it is this template's whole reason for existing.

**Homepage order:** `Hero`, `SearchBar`, `BrandStrip`, `TrendingSearches`, `UspStrip`,
`FeaturedVehicles`, `PromiseCards`, `FinanceCta`, `ValuationCta`, `Reviews`.

**Fixed spine — do not make these reorderable or removable:**

- `Hero` opens by asking **"how much can you spend?"**, in either total price or
  monthly payment. That question must come first and must keep both currencies. It is
  the only question a budget buyer reliably knows the answer to, and leading with
  anything else makes this a generic used-car site.
- `SearchBar` sits directly beneath the hero and continues that question. The two are
  one idea split across two components.
- `TheFooter` last.

**Reorderable:** `BrandStrip`, `TrendingSearches`, `UspStrip`, `FeaturedVehicles`,
`PromiseCards`, `FinanceCta`, `ValuationCta`, `Reviews`.

**Data each section needs:** `dealer` (name, phone, address, opening hours, socials,
rating); `brands` for `BrandStrip`; `vehicles` for `FeaturedVehicles` and the cards;
`REPRESENTATIVE_APR`, `brokerDisclosure`, `lenderPanelDisclosure` and
`calculatorDisclaimer` wherever a figure appears. Note this template carries **more**
compliance copy than the other templates, because it leads with monthly payments.

**Do not change without checking with me:** `BrandStrip` uses `useMarquee` and
`TrendingSearches` uses `useDragScroll`. Under `prefers-reduced-motion` both must
degrade to a static, scrollable list — not disappear, since they carry real navigation.
The rounded, warm, low-motion treatment is the anti-intimidation design, not a
stylistic preference; sharpening it turns this into one of the other templates.

**Known open questions:** the finance basis (HP vs PCP, deposit assumptions) is not
settled — see `docs/adr/0002-monetary-figures-derive-from-apr.md`. Themes are not wired
here. This is currently the only budget-led draft, so treat anything here that feels
generic as a candidate for sharing rather than copying.
