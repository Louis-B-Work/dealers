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
| [Northline](./standard-06/) | Warm paper, evergreen tones and a gallery-like showroom |

The first five are Vite + Vue 3 + TypeScript + Tailwind apps. Northline is a
self-contained HTML preview; it does not require an install or compile step.

## Local development

Use Node.js 22 and npm:

```sh
npm run setup         # installs each Vue app from its package-lock.json
npm run dev           # starts previews and opens the gallery at localhost:4180
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

Edit templates in this repository to update the published previews. These are
independent copies of the original `louis-designs` drafts, not an automatic
sync with the UI builder repository.

## Images and design status

Some imagery, videos and fonts are loaded from external providers and require
an internet connection. Bright Mosaic's bundled images retain their
[photo credits and licences](./bright-mosaic/public/cars/CREDITS.md), also
linked from the published gallery. Replace demo stock photography and content
before using any design for a real dealer.

Northline is currently a static design draft; publishing does not add missing
production functionality. Finance validation covers the five Vue templates,
not the standalone Northline page.
