# minimal-editorial — White, minimal, editorial

A premium, **white and minimal** dealer website template: a centred-logo top bar, a two-step
search bar, and a homepage that opens as a **two-column spread** — the dealership's pitch down the
left, the stock running down the right — before reclaiming the full width.

Built as a standalone **Vite + Vue 3 + TypeScript + Tailwind CSS** app for fast visual drafting,
alongside (not inside) [`light-video`](../light-video) and [`dark-sidebar`](../dark-sidebar).

Visually inspired by [Romans International](https://www.romansinternational.com/): wide-tracked
uppercase type, hairlines instead of shadows, a lot of white space, and vehicle cards that lead
with the name rather than the photograph.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the production build
```

## Structure

Site structure and page set follow `light-video` and `dark-sidebar`, so the three can be
compared like for like.

```
src/
  main.ts, App.vue, router.ts, style.css   # entry, shell, routing, design tokens
  data/          vehicles.ts, dealer.ts,     # mock inventory + dealership details
                 brands.ts                   # marque artwork for the make step
  composables/   useScrollReveal, useStickyNav, useVehicleFilters,
                 useDragScroll
  components/
    layout/      TheNav, NavDropdown, BrandMark, TheFooter
    home/        Hero, SearchWizard, UspStrip, PremiumTiles, BrandStory,
                 FinanceCta, ValuationCta, Reviews, StockColumn,
                 StockJump
    shared/      VehicleCard, VehiclePlaceholder, SectionHeading, PageHeader,
                 EnquiryForm, AppIcon
  views/         HomeView, VehiclesView (VLP), VehicleDetailView (VDP),
                 ContactView, StubView, CardLabView
```

`UspStrip`, `PremiumTiles` and `BrandStory` are laid out for the homepage's left column and carry
no gutter of their own; `FinanceCta`, `ValuationCta` and `Reviews` sit below the spread and are
full-width sections with their own internal two-column layouts.

## Layout

[`App.vue`](./src/App.vue) renders [`TheNav`](./src/components/layout/TheNav.vue) as a fixed top
bar and offsets the page by exactly its height (`--nav-h`) — the same arrangement as template 01,
rather than template 02's fixed left rail.

The nav is a three-column grid: links on the left, the **wordmark dead centre**, the remaining
links and the phone number on the right. The mark sits in its own grid column, so the two link
groups can be uneven without pushing it off centre. The full desktop arrangement only appears from
`xl` — two link groups either side of a centred wordmark *and* a phone number need about 1280px
before they stop crowding each other — so below that the left column becomes a menu toggle and the
links move into a drawer, with the mark staying centred throughout.

Scrolling condenses the bar from `--nav-h` to `--nav-h-scrolled`. Every sticky element on the site
(the VLP filter bar, the VDP purchase panel) offsets against `--nav-h-scrolled` rather than
`--nav-h`, because by the time anything reaches the top of the viewport the bar has already
condensed — offsetting against the taller value leaves a strip of page showing through between the
two.

### The homepage spread

[`HomeView`](./src/views/HomeView.vue) is the template's defining layout:

```
┌─────────────────── hero ───────────────────┐
│            headline over the photo          │
└─────────────────────────────────────────────┘
┌──────────── search bar (full width) ────────┐   ← straddles the foot of the photo
├─────────────────────────────┬───────────────┤
│ USPs                        │ IN STOCK NOW  │
│ Premium tiles               │ ┌───────────┐ │
│ Brand story                 │ │ card × 6  │ │
│                             │ └───────────┘ │
│                             │ VIEW ALL STOCK│
├─────────────────────────────┴───────────────┤
│ Finance · Valuation · Reviews (full width)  │   ← the page reclaims the margin
└─────────────────────────────────────────────┘
```

The two columns are separated by a single vertical rule rather than a gap, so they read as one
spread rather than two panels. [`StockColumn`](./src/components/home/StockColumn.vue) shows six
cards, and **nothing in it is sticky**: the column scrolls with the page.

That's a deliberate reversal. The heading was originally pinned beneath the nav so the list stayed
labelled, but every card then slid underneath it — and because the card leads with the vehicle's
name, whichever card was on screen spent most of the scroll with its title clipped, reading
headless. A label that costs the cards their identity isn't worth keeping. An internally scrolling
column was rejected for a different reason: it would trap the wheel halfway down the homepage.

Once the column has run out at `VIEW ALL STOCK`, the **remaining sections go back to full width**
rather than holding the left margin for an empty gutter, and they switch to their own internal
two-column layouts. The three sections in the band are chosen so that the two sides of the spread
run out together. Below `lg` the stock column drops beneath the content as an ordinary stacked
section.

## Search bar

[`SearchWizard`](./src/components/home/SearchWizard.vue) replaces the row of dropdowns used by
`light-video` and `dark-sidebar` with **two questions asked one at a time**, but keeps the
footprint of a search bar rather than a form: a rail of two tabs over a single control row, full
width, sitting across the foot of the hero photograph.

1. **Make** — a row of **marque plates**, each a fixed logo-shaped slot carrying the brand's
   own mark, and **multi-select**: a buyer shopping this kind of stock will happily shortlist
   three marques. Artwork is hotlinked from the same host the rest of the estate uses, so no
   trademarked files are vendored into this repo; where we hold no mark for a marque, or
   the artwork fails to load, the wordmark stands in and the plate is never empty.
   The marks are shown in black and white — see [Marque plates](#marque-plates).
2. **Model** — plain text, and single-select: "a 911 or a Cayenne" is a different search, not a
   broader one.

Because makes toggle, the make step **cannot auto-advance** — the buyer has to be able to add a
second marque. The step rail is the way on, which is why both tabs are always live. The model step
does still commit and advance. "Any make" acts as **clear**, and deselecting a marque that a chosen
model belonged to drops that model rather than leaving it filtering everything out.

Options with nothing behind them are **dropped rather than shown disabled** — a row of dead choices
is wasted width in a bar this size. Model pills carry their live count; the marque plates do not,
so the plate is all artwork.

The row is a **single rail across both steps**, so the scroll container survives the step change;
switching steps rewinds it and re-measures. It **scrolls sideways** whenever there are more options
than fit. Touch and trackpads scroll it natively, mice get **click-and-drag** via `useDragScroll` —
the same composable the other drafts use for their rails — and **stepping arrows** flank it, so the
row never depends on a drag or a hidden scrollbar being discovered.

The arrows sit **outside the rail** as flex siblings, not over it: overlaying them covered a plate's
face, and padding the scroll container would not help, since its padding scrolls away with the
content. The rail is simply narrower instead. At an end the arrow **keeps its space and only loses
its ink** — removing it would hand that width back to the rail and shift every plate sideways on the
first step. A short fade at the trailing edge still marks a part-visible plate, and the fade, the
grab cursor and the arrows all appear **only when the row actually overflows**, so a two-item model
list does not look clipped.

All of that is desktop behaviour. Below `sm` **nothing scrolls sideways**: the marques lay out as a
grid and the models wrap, so every option is on screen at once. A rail that narrow showed two plates
at a time, which reads as broken rather than scrollable, and the arrows that fixed that then gave up
70px of the width they were there to reveal. With no overflow the arrows, the edge fade and the grab
cursor all **drop out on their own**, because `canScroll` is false — none of them is suppressed by
hand.

The grid takes more columns as the phone gets wider — three below 420px, four to 560px, five up to
the `sm` breakpoint — so the block stays short and the plates stay roughly square instead of
stretching to fill three columns on a 600px screen. Fourteen marques measure 306px tall at 375px,
244px at 430px and 182px at 560px. Models **wrap rather than grid**: they are variable-width pills
that a grid would stretch to a uniform size for no reason.

There is **no back arrow**. Both tabs are live at all times, each showing its own answer so
far, so the rail is both the summary and the only navigation the bar needs.

The answers are handed to the VLP as `make` and `q` query params — the VLP has no model
filter of its own, so the model answer goes through its free-text search. A shortlist goes over as
**repeated `make` params**, and `useVehicleFilters` normalises either shape, so a single marque
still reads back as a plain string. The VLP's Make control is a single select and cannot represent
a shortlist, so when more than one marque arrives it shows **"N makes"** with a clear button rather
than displaying "Any make" over filtered results — a "View 3" that landed on a page claiming no
make filter would be the search lying about itself.

## Marque plates

The make step shows each manufacturer's own mark, pulled from
[`src/data/brands.ts`](./src/data/brands.ts). The plates carry **no count**: with the mark running
at full size the plate is all artwork, and the running total in the bar's "N matches" already says
what the counts were for. Four decisions are load-bearing:

- **The artwork is hotlinked, not vendored.** These are trademarks; the repo holds no copies
  of them. The host is the same one the other drafts and the production templates already
  read from, so the marks match across the estate.
- **Every plate falls back to the wordmark.** A marque we hold no artwork for, or one whose
  image fails to load, renders its name instead — an `@error` handler retires the URL for the
  session rather than retrying it on every render. A plate is never an empty box.
- **The marks are shown in black and white.** Thirteen brand palettes at once fight the
  template's white-and-hairline restraint, so the artwork is desaturated with a little added
  contrast and the row reads as one material. Chrome and silver marques are the ones to watch
  here — Aston Martin's and Bentley's wings sit lightest — which is what the contrast bump is
  for. Land Rover's oval actually reads *better* in mono than in green.
- **Selected fills the plate with ink and knocks the mark out in white.** Hover only darkens
  the hairline, so the three states stay distinct: hairline, ink hairline, ink fill.

  The knockout reduces the mark to a silhouette — `brightness(0)` flattens every opaque pixel
  to black while keeping the alpha shape, and `invert(1)` turns that white. **Marks carrying
  light detail inside them lose it.** Of the thirteen, three are materially affected: Land
  Rover becomes a blank oval, Porsche a blank shield, and Bentley's winged B closes up. The
  other ten read cleanly, being outlines or wordmarks.

  The alternative is `grayscale(1) invert(1)`, a luminance negative rather than a flat
  silhouette. It keeps Land Rover's text and Porsche's crest legible, but renders the marks as
  greys rather than white, so the punchier ones dim noticeably. It is a one-line swap in
  `SearchWizard.vue` if the lost detail matters more than the uniform white.

The plate's accessible name survives the swap: where a mark replaces the wordmark, the make
name is still present for screen readers, so the button still announces as "Porsche, 1".
That hidden label is absolutely positioned, which is why `.marque` is `relative` — without a
positioned ancestor it escapes the rail's overflow clipping and stretches the **page's**
horizontal scroll area to the full width of the row, giving the whole site a sideways scroll
on mobile. The same trap is documented on `warm-budget`'s brand strip.

## Vehicle card

[`VehicleCard`](./src/components/shared/VehicleCard.vue) follows the Romans structure rather than
the photo-first card used by templates 01 and 02:

```
MERCEDES-AMG GT 63 S 4MATIC+ COUPE     ← title above the photo
┌───────────────────────────────┐
│            photo              │
└───────────────────────────────┘
YEAR:     2022 (22)              £84,995
COLOUR:   AMG Solarbeam Yellow
MILEAGE:  8,200
FINANCE:  £1,099 per month
────────────────────────────────────────  ← full-strength rule
[          VIEW VEHICLE          ]
Representative 11.9% APR. …
```

The name reads first and the car confirms it. The price is aligned to the **first** spec row rather
than floated to the bottom, which is what gives the block its newspaper-listing feel. A vehicle
with no price on it renders as `POA`.

**The whole card is one hover target.** A single `group` hover drives every response at once: the
photograph scales, the border darkens from hairline to full ink, the card lifts a fraction on a
very soft shadow, and the `VIEW VEHICLE` button inverts from solid black to outlined white.

The card is container-query driven, so it is correct in the narrow home stock column, in the wider
VLP grid and in the card lab without any width props. `/card-lab` renders it at each width it
actually meets.

## Premium tiles

[`PremiumTiles`](./src/components/home/PremiumTiles.vue) is the tall-tile strip: a 3:4 photograph
under an editorial scrim, with an uppercase caption bracketed by two drawn rules. Hovering a tile
grows both rules to full width, widens the caption's tracking, lifts the scrim and scales the
photograph. The images are rendered **greyscale by default and return to colour on hover**, so the
strip stays inside the monochrome palette and colour becomes the reward for engaging with a tile
rather than a permanent part of the page.

It is **two-up at every width**. Four across renders the tiles too small to read as photography
inside the homepage's left column, and a single column on mobile stacked four portrait tiles into
a run over a thousand pixels tall. On mobile the pair is **squared off and tightened** instead —
square rather than 3:4, a smaller gap, and the caption stepping down in size and tracking so it
still holds one line in a tile roughly half the width.

## Theming

All colours and key scales are CSS custom properties defined at the top of
[`src/style.css`](./src/style.css) and surfaced through
[`tailwind.config.js`](./tailwind.config.js). Token names are semantic — `paper` is *a surface*,
`ink` is *text on it* — matching templates 01 and 02 so the three can be read side by side.

The palette is **monochrome**: white, near-black and greys, with no brand hue anywhere.
`--c-accent` is deliberately kept as a token (set to ink) rather than removed, so introducing a
brand colour later is a single value change on that block and needs no component edits.

Two exceptions to the monochrome rule, both deliberate:

- the **registration plate** on the valuation form keeps its statutory yellow, because the colour
  is legally part of what a UK plate is
- **vehicle photography** stays in colour, because the card literally lists the car's colour as a
  spec; only editorial imagery (the tiles, the brand-story shot) is desaturated

The hero is the one place the palette inverts — white type reversed out of a dark photograph rather
than ink on white. See [Hero](#hero).

## Look & feel

Where template 01 uses 16px radii and soft shadows, and template 02 uses 2px radii on near-black,
template 03 is built from:

- **fully square geometry** — every radius is 0, so every edge in the layout lines up on the same
  orthogonal grid
- **hairlines, not shadows** — the only shadow in the template is a very faint hover lift; on white,
  a heavy shadow reads as grubby
- **whitespace as the primary device** — a wider gutter than either sibling template, and generous
  vertical rhythm between sections
- **very wide uppercase tracking** on every piece of secondary type: eyebrows, labels, buttons,
  nav links and the wordmark
- **light display type** — headings run light and wide rather than bold and tight, the inverse of
  template 02's semibold voice
- **Jost throughout** — one geometric grotesk carrying both display and body, which is what holds
  the page together without an accent colour or a second typeface

## Hero

The hero is a **still photograph**, not template 02's video: the page is carried by whitespace, and
motion above the fold would be the loudest thing on it. The shot is a dark showroom interior, so
rather than veiling it in white and setting the type in ink, **the type reverses out of it** — the
one place in the template where the palette inverts.

The scrim is kept as light as legibility allows, so the cars stay clearly visible: a faint flat
tint across the frame, a gradient weighted to top and bottom, and a soft pool behind the copy block
itself, which is the only place the contrast actually has to hold and where the photograph is at
its brightest. The headline is set as **two explicit lines** rather than left to wrap, which would
otherwise drop a single orphaned word onto the second line at most widths.

Copy sits high in the frame, leaving the lower third of the photograph clear before the search bar
crosses it. The bar then straddles the foot of the image, so it belongs to both the photograph and
the page.

The image is a hotlinked [Pexels](https://www.pexels.com/) still; if the CDN is unreachable,
[`public/hero-poster.svg`](./public/hero-poster.svg) stands in so the hero is never an empty box
behind the headline.

## Compliance

Regulated finance wording follows templates 01 and 02 and is centralised in
[`src/data/dealer.ts`](./src/data/dealer.ts) (`REPRESENTATIVE_APR`, `representativeExample`,
`brokerDisclosure`) so the calculator, the vehicle cards and the VDP can never quote different
figures. The rules applied here:

- every **card** that shows a monthly figure carries the representative APR and the credit-broker
  disclosure — per card, not once per row. A card with no price shows neither a finance line nor a
  disclosure, because it quotes no figure
- the home **finance calculator** is labelled "for illustration purposes only", subject to status,
  and shows the representative example beside the figure it produces
- the **VDP** repeats the representative example and broker disclosure next to the price
- the **footer** carries the broker disclosure, the limited-panel-of-lenders statement and the
  representative example sitewide

## Notes

- All vehicle data is **mock** (`src/data/vehicles.ts`), and is shared verbatim with template 02 so
  the templates render identical content; wire a real API/store in later.
- Motion respects `prefers-reduced-motion`.
- Form validation is marked by weight and a doubled border rather than by colour, since the palette
  has no red.
- `/card-lab` renders the vehicle card without site chrome, at each column width it meets on the
  site (the card is container-query driven).

## Port notes

For whoever ports this into the production web component library. Written while the
design reasoning was fresh; the decisions below are deliberate, not incidental.

**Suits:** a dealership selling on provenance and condition rather than price, whose
buyers read before they browse and expect the restraint of a printed catalogue.

**Homepage order:** `Hero`, `UspStrip`, `PremiumTiles`, `BrandStory`, `StockColumn`,
`FinanceCta`, `ValuationCta`, `Reviews`.

**Fixed spine — do not make these reorderable or removable:**

- The **homepage spread** is a two-column grid, not a stack. The left cell holds
  `UspStrip`, `PremiumTiles` and `BrandStory` in that order; the right cell holds
  `StockColumn` alone, separated by a single rule so the two read as one spread. The
  page reclaims full width only after `StockColumn` ends. Flattening this into a linear
  sequence of sections removes the template's only structural signature and leaves a
  generic minimal layout.
- The centred-logo `TheNav` — the symmetry is the point; a left-aligned logo makes the
  wide-tracked uppercase type look like a mistake.
- `SearchWizard` is a deliberate **two-step** guided search. Collapsing it to a
  single row of selects turns it into `light-video`'s search bar and discards the
  guided-search idea.

**Reorderable:** `UspStrip`, `PremiumTiles` and `BrandStory` may be reordered *within
the left cell of the spread*, but must not leave it. `FinanceCta`, `ValuationCta` and
`Reviews` are genuinely independent full-width sections below the spread.

**Data each section needs:** `dealer` (name, phone, address, opening hours, socials,
rating); `vehicles` for `StockColumn`, `PremiumTiles` and the card components; `brands`
for the make step's marque artwork (hotlinked, with a wordmark fallback);
`REPRESENTATIVE_APR` plus `brokerDisclosure` on **every** surface showing a price.

**Do not change without checking with me:** hairlines are used instead of shadows
throughout, and vehicle cards lead with the **name** rather than the photograph. Both
are deliberate inversions of the other templates. A shadow or a photo-first card here
is not a small styling change; it is a different design.

**Three sections change shape below `sm`**, and all three do it for the same reason —
a narrow column makes the desktop layout read as broken rather than dense:

- the make step's marque rail becomes a **grid** and the model step's pills **wrap** — neither
  scrolls, so the wizard's arrows and edge fade disappear
- `PremiumTiles` goes **two-up and square** instead of a single stacked column
- `Reviews` becomes **one horizontally scrolling row** of 80%-width cards, so the next
  card always peeks and the section stays a band rather than a long column

There is also a mobile-only control, [`StockJump`](./src/components/home/StockJump.vue): a
sticky shortcut down to the stock column. The spread unstacks on a phone, so the pitch runs
first and the stock lands a long way below it — a buyer who has just used the wizard has no
quick way to the cars. It appears only once the wizard has scrolled **above** the viewport
(not merely left it, which is why it tests the bounding rect's top rather than just
`isIntersecting`), and retires as soon as the stock column arrives rather than sitting over
the cards it was pointing at. It scrolls to `#in-stock`, offset by the condensed nav height
so the heading does not park underneath the fixed nav.

`Reviews` also **opts out of the scroll reveal** below `sm`. The reveal is written for a
grid where every card is on screen; in the scrolling row the later cards are clipped, so
they would sit at opacity 0 and fade in late as you swipe onto them. The grid keeps the
staggered reveal.

**Known open questions:** the finance basis (HP vs PCP, deposit assumptions) is not
settled — see `docs/adr/0002-monetary-figures-derive-from-apr.md`. Themes are not wired
here; the white/minimal palette is close to non-negotiable for this template, so it may
be the one that opts out of theming entirely.
