<template>
  <section class="u-gutter w-full u-section">
    <SectionHeading
      title="Find the right car, fast"
      subtitle="The searches our customers run most. Every one is a live count of what is on the forecourt right now."
    />

    <ul class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
      <li v-for="tile in tiles" :key="tile.title">
        <RouterLink
          :to="{ name: 'vehicles', query: tile.query }"
          class="card card-hover group flex h-full flex-col items-start gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4"
        >
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile sm:h-16 sm:w-16"
            :class="tile.tone === 'warm' ? 'bg-highlight-wash text-highlight-ink' : 'bg-accent-wash text-accent'"
          >
            <AppIcon :name="tile.icon" :size="26" />
          </span>

          <span class="min-w-0 flex-1">
            <span
              class="block font-display text-base font-semibold text-ink transition-colors duration-150 group-hover:text-accent sm:truncate"
            >
              {{ tile.title }}
            </span>
            <span
              class="mt-1.5 inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-accent"
            >
              View {{ tile.count }} cars
              <AppIcon name="chevron-right" :size="14" />
            </span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { countVehicles } from '../../composables/useVehicleFilters'
import AppIcon from '../shared/AppIcon.vue'
import SectionHeading from '../shared/SectionHeading.vue'

interface Tile {
  title: string
  icon: string
  tone: 'cool' | 'warm'
  query: Record<string, string>
  filters: Parameters<typeof countVehicles>[0]
}

const candidates: Tile[] = [
  {
    title: 'Cars under £6,000',
    icon: 'wallet',
    tone: 'warm',
    query: { maxPrice: '6000' },
    filters: { priceMode: 'total', maxPrice: 6000 },
  },
  {
    title: 'Under £150 a month',
    icon: 'pound',
    tone: 'warm',
    query: { maxMonthly: '150' },
    filters: { priceMode: 'monthly', maxMonthly: 150 },
  },
  {
    title: 'Small hatchbacks',
    icon: 'car',
    tone: 'cool',
    query: { bodyType: 'Hatchback' },
    filters: { bodyType: 'Hatchback' },
  },
  {
    title: 'SUVs & crossovers',
    icon: 'users',
    tone: 'cool',
    query: { bodyType: 'SUV' },
    filters: { bodyType: 'SUV' },
  },
  {
    title: 'Automatics',
    icon: 'gear',
    tone: 'cool',
    query: { transmission: 'Automatic' },
    filters: { transmission: 'Automatic' },
  },
  {
    title: 'Diesel & hybrid',
    icon: 'fuel',
    tone: 'warm',
    query: { fuel: 'Diesel' },
    filters: { fuel: 'Diesel' },
  },
]

// A tile that leads nowhere is worse than one tile fewer, so empty searches
// are dropped rather than shown with a zero on them.
const tiles = computed(() =>
  candidates
    .map((tile) => ({ ...tile, count: countVehicles(tile.filters) }))
    .filter((tile) => tile.count > 0),
)
</script>
