<template>
  <div class="flex min-h-screen items-center justify-center bg-paper-soft p-8">
    <div class="flex flex-col items-center gap-10">
      <!-- The card is container-query driven, so the lab shows it at the
           widths it actually meets in the grid rather than one sample size. -->
      <div class="flex flex-col items-start gap-10 lg:flex-row">
        <figure v-for="width in widths" :key="width.label" class="flex flex-col gap-3">
          <figcaption class="text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted">
            {{ width.label }}
          </figcaption>
          <div class="max-w-full" :style="{ width: `${width.px}px` }">
            <VehicleCard v-if="vehicle" :vehicle="vehicle" />
          </div>
        </figure>
      </div>

      <div class="flex items-center gap-3 text-xs text-ink-muted">
        <span class="uppercase tracking-micro">Card lab</span>
        <span class="h-3 w-px bg-line"></span>
        <RouterLink to="/" class="transition-colors hover:text-accent">Back to site</RouterLink>
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
  { label: '4-up column (260px)', px: 260 },
  { label: '3-up column (330px)', px: 330 },
  { label: '2-up column (420px)', px: 420 },
]
</script>
