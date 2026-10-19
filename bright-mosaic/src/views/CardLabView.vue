<template>
  <div class="flex min-h-screen items-center justify-center bg-paper p-8">
    <div class="flex flex-col items-center gap-10">
      <p class="max-w-md text-center text-sm text-ink-muted">
        Hover or tab to a card to reveal its label. On touch screens and below the md
        breakpoint the label is always shown.
      </p>
      <div class="flex flex-col items-start gap-10 md:flex-row">
        <figure v-for="variant in variants" :key="variant.label" class="flex flex-col gap-3">
          <figcaption class="text-[0.68rem] font-semibold uppercase tracking-micro text-ink-muted">
            {{ variant.label }}
          </figcaption>
          <div :class="variant.box">
            <MosaicCard v-if="vehicle" :vehicle="vehicle" :large="variant.large" />
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
import MosaicCard from '../components/shared/MosaicCard.vue'

// First featured vehicle, so the badge variant is covered too.
const vehicle = computed(() => vehicles.find((v) => v.featured) ?? vehicles[0])

const variants = [
  { label: 'Grid tile', box: 'aspect-[4/3] w-[340px] max-w-full', large: false },
  { label: 'Hero tile (tall)', box: 'aspect-[4/5] w-[300px] max-w-full', large: true },
]
</script>
