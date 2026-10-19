<template>
  <div class="flex min-h-screen items-center justify-center bg-paper-soft p-8">
    <div class="flex flex-col items-center gap-10">
      <div class="flex flex-col items-start gap-10 md:flex-row">
        <figure v-for="variant in variants" :key="variant.label" class="flex flex-col gap-3">
          <figcaption class="text-[0.68rem] font-semibold uppercase tracking-micro text-ink-muted">
            {{ variant.label }}
          </figcaption>
          <div class="w-[380px] max-w-full">
            <component :is="variant.component" v-if="vehicle" :vehicle="vehicle" />
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
import { computed, markRaw } from 'vue'
import { vehicles } from '../data/vehicles'
import VehicleCard from '../components/shared/VehicleCard.vue'
import VehicleCardOverlay from '../components/shared/VehicleCardOverlay.vue'

// First featured vehicle, so the badge variant is covered too.
const vehicle = computed(() => vehicles.find((v) => v.featured) ?? vehicles[0])

const variants = [
  { label: 'Current', component: markRaw(VehicleCard) },
  { label: 'Overlay', component: markRaw(VehicleCardOverlay) },
]
</script>
