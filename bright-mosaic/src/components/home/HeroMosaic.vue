<template>
  <section class="relative overflow-clip bg-paper">
    <!-- Sunny glow behind the wall, so the cards sit in light rather than on flat grey. -->
    <div
      class="pointer-events-none absolute -right-40 top-1/3 h-[640px] w-[640px] rounded-full opacity-40 blur-3xl"
      style="background: radial-gradient(circle, rgb(var(--c-deal) / 0.55), transparent 70%)"
    ></div>

    <div
      class="u-gutter relative grid w-full items-center gap-12 pb-16 pt-[calc(var(--nav-h)+3rem)] lg:min-h-[100svh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 lg:py-0"
    >
      <!-- Copy -->
      <div class="relative z-10 flex flex-col gap-6 lg:py-[calc(var(--nav-h)+2rem)]">
        <div
          class="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs text-ink-soft"
          data-intro
          style="--intro-delay: 80ms"
        >
          <span class="flex text-accent">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="12" filled />
          </span>
          <span class="font-semibold text-ink">{{ dealer.rating.score }}</span>
          <span>from {{ dealer.rating.count }} {{ dealer.rating.source }}</span>
        </div>

        <h1
          class="u-display text-4xl sm:text-5xl xl:text-6xl"
          data-intro
          style="--intro-delay: 160ms"
        >
          Good cars.<br />
          <span class="text-accent">Fair prices.</span>
        </h1>

        <p class="max-w-md text-lg text-ink-soft" data-intro style="--intro-delay: 260ms">
          {{ stockCount }} checked cars, all under {{ formatCurrency(priceCeiling) }}. Every price is
          on the card, so there are no surprises.
        </p>

        <div class="flex flex-col gap-3" data-intro="plain" style="--intro-delay: 360ms">
          <PriceModeToggle />
          <SearchBar />
        </div>

        <div data-intro style="--intro-delay: 400ms">
          <nav class="flex flex-wrap items-center gap-2" aria-label="Shop by budget">
            <span class="mr-1 text-sm font-semibold text-ink-soft">Shop by budget</span>
            <RouterLink
              v-for="band in budgetChips"
              :key="band.max"
              :to="{ name: 'vehicles', query: { [isMonthly ? 'maxMonthly' : 'maxPrice']: String(band.max) } }"
              class="budget-chip"
            >
              Under {{ formatCurrency(band.max) }}{{ isMonthly ? '/mo' : '' }}
              <span class="budget-count">{{ band.count }}</span>
            </RouterLink>
          </nav>
        </div>

        <div class="flex flex-wrap gap-3" data-intro style="--intro-delay: 480ms">
          <RouterLink to="/vehicles" class="btn-primary">
            Browse all {{ stockCount }} cars
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <RouterLink to="/sell" class="btn-ghost">Value my car</RouterLink>
        </div>
      </div>

      <!-- Mosaic: columns with uneven tile heights, offset vertically, so the
           cards interlock into a stepped wall instead of a flat row. -->
      <div ref="wallRef" class="mosaic-wall" aria-label="Cars in stock">
        <div
          v-for="(column, c) in columns"
          :key="c"
          class="mosaic-col"
          :class="[COLUMN_OFFSETS[c], { 'hidden xl:flex': c === 2 }]"
          data-intro="plain"
          :style="{ '--intro-delay': `${240 + c * 140}ms` }"
        >
          <div
            v-for="(tile, t) in column"
            :key="tile.vehicle.id"
            data-tile
            class="w-full"
            :class="{ 'hidden lg:block': t >= MOBILE_TILES_PER_COLUMN }"
            :style="{ aspectRatio: tile.ratio }"
          >
            <MosaicCard :vehicle="tile.vehicle" large :eager="t < 3" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { dealer } from '../../data/dealer'
import { vehicles, type Vehicle } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import MosaicCard from '../shared/MosaicCard.vue'
import SearchBar from './SearchBar.vue'
import { BUDGET_BANDS, formatCurrency } from '../../composables/useVehicleFilters'
import { MONTHLY_BANDS, usePriceMode } from '../../composables/usePriceMode'
import PriceModeToggle from '../shared/PriceModeToggle.vue'

// The wall is the whole stock list, which is what the headline promises.
// Ratios alternate square/wide/landscape down each column so neighbouring tiles
// never line up — that misalignment is the whole look.
const HERO_LAYOUT: { id: string; ratio: string }[][] = [
  [
    { id: 'fiat-500-2014', ratio: '1 / 1' },
    { id: 'volkswagen-polo-2019', ratio: '3 / 2' },
    { id: 'ford-focus-2018', ratio: '4 / 3' },
    { id: 'toyota-yaris-2020', ratio: '1 / 1' },
    { id: 'vauxhall-astra-2022', ratio: '3 / 2' },
  ],
  [
    { id: 'kia-picanto-2018', ratio: '4 / 3' },
    { id: 'peugeot-208-2020', ratio: '1 / 1' },
    { id: 'nissan-juke-2020', ratio: '3 / 2' },
    { id: 'volkswagen-golf-2020', ratio: '1 / 1' },
  ],
  [
    { id: 'dacia-sandero-2021', ratio: '1 / 1' },
    { id: 'hyundai-i10-2020', ratio: '3 / 2' },
    { id: 'ford-fiesta-2022', ratio: '4 / 3' },
    { id: 'skoda-fabia-2022', ratio: '1 / 1' },
  ],
]
/** Below lg the wall sits under the copy, so each column is cut to a teaser. */
const MOBILE_TILES_PER_COLUMN = 2

// Each column starts at a different height: the stagger that breaks the grid.
// Padding rather than negative margin, so no tile starts above the wall.
const COLUMN_OFFSETS = ['', 'pt-12 lg:pt-20', 'lg:pt-10']

const wallRef = ref<HTMLElement | null>(null)

// On desktop the wall is one viewport tall. Any tile that would run past the
// bottom is hidden, so every car on the wall is shown in full, never cropped.
function fitWall() {
  const wall = wallRef.value
  if (!wall) return
  const tiles = wall.querySelectorAll<HTMLElement>('[data-tile]')
  tiles.forEach((t) => (t.style.display = ''))
  if (!window.matchMedia('(min-width: 1024px)').matches) return
  const limit = wall.clientHeight - parseFloat(getComputedStyle(wall).paddingBottom)
  // Tiles are measured top-down; hiding one never moves the tiles above it.
  tiles.forEach((t) => {
    let top = 0
    for (let el: HTMLElement | null = t; el && el !== wall; el = el.offsetParent as HTMLElement | null) {
      top += el.offsetTop
    }
    if (top + t.offsetHeight > limit + 0.5) t.style.display = 'none'
  })
}

let observer: ResizeObserver | undefined
onMounted(() => {
  fitWall()
  observer = new ResizeObserver(fitWall)
  if (wallRef.value) observer.observe(wallRef.value)
})
onBeforeUnmount(() => observer?.disconnect())

const byId = new Map(vehicles.map((v) => [v.id, v]))

const columns = computed(() =>
  HERO_LAYOUT.map((col) =>
    col.flatMap((t) => {
      const vehicle = byId.get(t.id)
      return vehicle ? [{ vehicle, ratio: t.ratio } as { vehicle: Vehicle; ratio: string }] : []
    }),
  ),
)

const stockCount = vehicles.length

const topPrice = Math.max(...vehicles.map((v) => v.price))

// The headline promise ("all under £X") is the smallest band that covers the whole stock.
const priceCeiling = BUDGET_BANDS.find((b) => b >= topPrice) ?? topPrice

// Bands that cover everything add nothing, so only narrower ones get a chip. The ceilings
// follow the price mode: cash prices in total mode, monthly payments in monthly mode.
const { priceMode } = usePriceMode()
const isMonthly = computed(() => priceMode.value === 'monthly')

const budgetChips = computed(() =>
  (isMonthly.value ? MONTHLY_BANDS : BUDGET_BANDS)
    .map((max) => ({
      max,
      count: vehicles.filter((v) => (isMonthly.value ? v.monthlyFrom : v.price) <= max).length,
    }))
    .filter((b) => b.count > 0 && b.count < stockCount),
)
</script>

<style scoped>
.mosaic-wall {
  @apply relative grid grid-cols-2 items-start gap-3 sm:gap-4 xl:grid-cols-3;
}

/* On desktop the wall is exactly one viewport tall, below the nav. fitWall()
   hides whichever tiles don't fit, so nothing is cropped or faded. */
@media (min-width: 1024px) {
  .mosaic-wall {
    align-self: start;
    box-sizing: border-box;
    height: 100svh;
    padding-top: calc(var(--nav-h) + 1.5rem);
    padding-bottom: 1.5rem;
  }
}

.budget-chip {
  @apply inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-ink shadow-soft transition duration-300 ease-premium hover:-translate-y-0.5 hover:border-ink;
}
.budget-count {
  @apply rounded-full bg-deal px-2 py-0.5 text-xs font-bold tabular-nums text-deal-ink;
}

.mosaic-col {
  @apply flex flex-col gap-3 sm:gap-4;
}

/* Below lg the wall becomes one swipeable row: the columns dissolve so every
   tile is a direct child of the scroller, and each snaps into place. */
@media (max-width: 1023px) {
  .mosaic-wall {
    --wg: 1.25rem;
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    margin-inline: calc(var(--wg) * -1);
    padding-inline: var(--wg);
    scroll-padding-inline: var(--wg);
    padding-bottom: 0.5rem;
  }
  @media (min-width: 640px) {
    .mosaic-wall {
      --wg: 2rem;
    }
  }
  .mosaic-wall::-webkit-scrollbar {
    display: none;
  }
  .mosaic-col {
    display: contents !important;
  }
  .mosaic-wall [data-tile] {
    display: block !important;
    flex: 0 0 72%;
    max-width: 20rem;
    width: auto !important;
    aspect-ratio: 4 / 3 !important;
    scroll-snap-align: start;
  }
}
</style>
