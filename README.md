# Dealer designs

Six standalone dealer website previews behind one gallery:
**https://louis-b-work.github.io/dealers/**

These are design demonstrations, not live dealerships. Stock, contact details
and finance examples are demo content.

| Template | Direction |
| --- | --- |
| [Light Video](./light-video/) | Light, full-bleed video hero |
| [Dark Sidebar](./dark-sidebar/) | Cinematic dark layout with side navigation |
| [Minimal Editorial](./minimal-editorial/) | Minimal, centred branding and guided search |
| [Warm Budget](./warm-budget/) | Approachable, budget-led cream and teal |
| [Bright Mosaic](./bright-mosaic/) | Bright, interlocking stock tiles |
| [Evergreen Editorial](./standard-06/) | Warm paper, evergreen tones and a gallery-like showroom |

The first five are Vite + Vue 3 + TypeScript + Tailwind apps. Evergreen Editorial uses
HTML, CSS and native JavaScript modules; it requires no install or compile step.

## Local development

This is an independent personal repository, not a fork of or a dependency on
the CF247 UI builder. Use the `designs` branch for ongoing design work; merge
finished changes into `main` to publish them. Its only Git remote is
`https://github.com/Louis-B-Work/dealers.git`.

Use Node.js 22 and npm:

```sh
npm run setup         # installs each Vue app from its package-lock.json
npm run dev           # starts previews and opens the gallery at localhost:4180
npm run dev:standard-06 # starts only Evergreen Editorial at localhost:5179
npm run check:finance # verifies the five Vue apps' shared finance calculations
npm run build         # type-checks the Vue apps and assembles all six in dist/
npm test              # checks the built gallery, template links and local assets
```

Keep the dev terminal open while browsing. Each Vue app can also be run on its
own with `npm run dev` from its folder.

## GitHub Pages

In the repository's **Settings > Pages**, choose **GitHub Actions** as the source.
The [deployment workflow](./.github/workflows/pages.yml) installs, validates,
builds and deploys on every push to `main`, or can be run manually.

The build produces `dist/index.html` and one subfolder per template. All links
and assets are relative, so they work beneath the `/dealers/` project path.
Production Vue previews use hash routes (for example,
`light-video/#/vehicles`), so bookmarked inner pages and refreshes work without
server-side rewrites. Local Vite development keeps its existing clean URLs.
The gallery opens previews in new tabs, keeping the original index available.
Each gallery card includes a locally bundled homepage screenshot from
`previews/`. These 1440 x 900 JPEGs are copied into the published gallery;
recapture the matching homepage at that viewport after significant design
changes to keep its thumbnail current.

Edit templates in this repository to update the published previews. These are
independent copies of the original `louis-designs` drafts, not an automatic
sync with the UI builder repository.

## Images and design status

Some imagery, videos and fonts are loaded from external providers and require
an internet connection. Bright Mosaic's bundled images retain their
[photo credits and licences](./bright-mosaic/public/cars/CREDITS.md), also
linked from the published gallery. Replace demo stock photography and content
before using any design for a real dealer.

Evergreen Editorial includes a complete homepage, filterable stock, vehicle details,
finance calculator, sell/part-exchange, about, contact, MOT/servicing, warranty,
body shop, breakdown and privacy pages. Hash routes (for example,
`standard-06/#/vehicles`) work on GitHub Pages without server rewrites.
Its eleven fully specified demo vehicles are shared by the homepage, filters,
detail pages and finance calculator; the earlier unpictured sample records
have been removed so counts and available vehicles agree.

Evergreen Editorial remains a non-operational design preview. Forms validate locally and
explicitly confirm that nothing is sent or saved; no live enquiries, valuations,
bookings, credit checks or purchases are made. Reviews, locations and stock
are illustrative, and photographs may not match the exact vehicle specification.
Finance uses an effective monthly rate equivalent to 11.9% APR, with totals
based on penny-rounded instalments and no fees or balloon payment. `npm test`
also checks Evergreen Editorial stock filtering, routes, finance arithmetic and published
assets. Run `node --test scripts/standard-06.test.mjs` for its focused logic tests.
