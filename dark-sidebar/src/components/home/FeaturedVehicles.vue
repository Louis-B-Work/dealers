<template>
  <section class="border-b border-line bg-paper py-20 md:py-28">
    <!-- Full-bleed rather than `.container`: the card row uses the whole
         content column, aligned to the same edges as every other section. -->
    <div class="u-gutter w-full">
      <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="The Collection"
          title="Featured vehicles"
          subtitle="A rotating selection from our current stock, featuring the cars our team can't stop talking about."
        />
        <RouterLink
          to="/vehicles"
          class="group inline-flex items-center gap-2 border-b border-line pb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-ink-soft transition-colors duration-300 ease-premium hover:border-accent hover:text-accent"
          data-reveal
        >
          View all {{ total }} vehicles
          <AppIcon
            name="arrow"
            :size="15"
            class="transition-transform duration-300 ease-premium group-hover:translate-x-1"
          />
        </RouterLink>
      </div>

      <!-- One featured row at desktop widths; cards adapt their internals via container query. -->
      <div class="mt-12 grid gap-5 sm:grid-cols-2 min-[1100px]:grid-cols-4">
        <div
          v-for="(vehicle, i) in featured"
          :key="vehicle.id"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <VehicleCard :vehicle="vehicle" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vehicles } from '../../data/vehicles'
import SectionHeading from '../shared/SectionHeading.vue'
import VehicleCard from '../shared/VehicleCard.vue'
import AppIcon from '../shared/AppIcon.vue'

const total = vehicles.length
// Keep the homepage collection to one row at desktop widths.
const featured = computed(() =>
  [...vehicles].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4),
)
</script>
