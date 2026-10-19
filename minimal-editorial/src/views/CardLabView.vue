<template>
  <div class="flex min-h-screen items-center justify-center bg-paper-soft p-8">
    <div class="flex w-full flex-col items-center gap-12 xl:w-auto">
      <!-- The card is container-query driven, so the lab shows it at the
           widths it actually meets on the site rather than one sample size.
           The three samples only fit side by side from xl up. -->
      <div class="flex w-full flex-col items-start gap-10 xl:w-auto xl:flex-row">
        <figure v-for="width in widths" :key="width.label" class="flex w-full flex-col gap-4 xl:w-auto">
          <figcaption class="text-[0.58rem] uppercase tracking-micro text-ink-muted">
            {{ width.label }}
          </figcaption>
          <div class="max-w-full" :style="{ width: `${width.px}px` }">
            <VehicleCard v-if="vehicle" :vehicle="vehicle" />
          </div>
        </figure>
      </div>

      <div class="flex items-center gap-4 text-xs text-ink-muted">
        <span class="uppercase tracking-micro">Card lab</span>
        <span class="h-3 w-px bg-line"></span>
        <RouterLink to="/" class="transition-opacity duration-300 hover:opacity-60">
          Back to site
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vehicles } from '../data/vehicles'
import VehicleCard from '../components/shared/VehicleCard.vue'

// First featured vehicle, so the badge variant is covered too.
const vehicle = computed(() => vehicles.find((v) => v.featured) ?? vehicles[0])

const widths = [
  { label: '4-up column (280px)', px: 280 },
  { label: '3-up column (360px)', px: 360 },
  { label: 'Home stock column (420px)', px: 420 },
]
</script>
