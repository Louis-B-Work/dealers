<template>
  <section class="bg-paper py-20 md:py-28">
    <!-- Full-bleed rather than `.container`: the card row uses the whole
         viewport, aligned to the same edges as the nav. -->
    <div class="u-gutter w-full">
      <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="The Forecourt"
          title="Featured vehicles"
          subtitle="A rotating selection from our current stock, featuring the cars our team can't stop talking about."
        />
        <RouterLink
          to="/vehicles"
          class="group inline-flex items-center gap-2 text-sm font-semibold text-ink"
          data-reveal
        >
          View all {{ total }} vehicles
          <AppIcon
            name="arrow"
            :size="16"
            class="transition-transform duration-300 ease-premium group-hover:translate-x-1"
          />
        </RouterLink>
      </div>

      <!-- 1 / 2 / 4 columns. Three-up is skipped so eight cards always fill
           their rows exactly, leaving no orphan on the final row. The card
           adapts its own internals to the narrower column via container query. -->
      <div class="mt-12 grid gap-6 sm:grid-cols-2 min-[1100px]:grid-cols-4">
        <div
          v-for="(vehicle, i) in featured"
          :key="vehicle.id"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <VehicleCardOverlay :vehicle="vehicle" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vehicles } from '../../data/vehicles'
import SectionHeading from '../shared/SectionHeading.vue'
import VehicleCardOverlay from '../shared/VehicleCardOverlay.vue'
import AppIcon from '../shared/AppIcon.vue'

const total = vehicles.length
// Eight fills the 2- and 4-column layouts exactly, so no row is left short.
const featured = computed(() =>
  [...vehicles].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 8),
)
</script>
