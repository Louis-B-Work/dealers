<template>
  <section class="bg-paper py-20 md:py-28">
    <div class="u-gutter w-full">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Best buys"
          title="This week's best buys"
          subtitle="Our pick of the stock for value. Every one is inspected, HPI-checked and comes with a warranty."
        />
        <RouterLink to="/vehicles" class="btn-ghost" data-reveal>
          View all {{ stockCount }}
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>

      <!-- Six columns: the lead tile takes four columns and both rows; the
           next two stack in the remaining two columns; the rest run along a
           row of thirds underneath. -->
      <div class="bento">
        <div
          v-for="(vehicle, i) in featured"
          :key="vehicle.id"
          :class="TILE_CLASSES[i]"
          data-reveal
          :data-reveal-delay="i * 70"
        >
          <MosaicCard :vehicle="vehicle" :large="i === 0" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import MosaicCard from '../shared/MosaicCard.vue'
import SectionHeading from '../shared/SectionHeading.vue'

const TILE_CLASSES = [
  'aspect-[4/3] md:col-span-6 md:aspect-video lg:col-span-4 lg:row-span-2 lg:aspect-auto',
  'aspect-[4/3] md:col-span-3 md:aspect-[4/3] lg:col-span-2 lg:aspect-auto',
  'aspect-[4/3] md:col-span-3 md:aspect-[4/3] lg:col-span-2 lg:aspect-auto',
  'aspect-[4/3] md:col-span-2',
  'aspect-[4/3] md:col-span-2',
  'aspect-[4/3] md:col-span-2',
]

// Cheapest first, so the lead tile is always the headline bargain. Capped to
// the number of designed tile slots.
const featured = computed(() =>
  vehicles
    .filter((v) => v.featured)
    .sort((a, b) => a.price - b.price)
    .slice(0, TILE_CLASSES.length),
)

const stockCount = vehicles.length
</script>

<style scoped>
.bento {
  @apply grid gap-3 sm:gap-4 md:grid-cols-6;
}

/* The lead tile sets the height of the first band; the stacked pair splits it. */
@media (min-width: 1024px) {
  .bento {
    grid-template-rows: repeat(2, minmax(0, clamp(12rem, 17vw, 16.5rem))) auto;
  }
}
</style>
