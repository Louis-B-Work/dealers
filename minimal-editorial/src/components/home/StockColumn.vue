<template>
  <aside class="flex flex-col">
    <!-- Deliberately not sticky. Pinning this heading meant every card slid
         underneath it, and since the card leads with the vehicle's name, the
         card on screen spent most of the scroll with its title clipped —
         headless. A label that costs the cards their identity isn't worth
         keeping, so it scrolls away with everything else. -->
    <div
      class="-mt-px flex items-baseline justify-between gap-4 border-y border-line py-5"
    >
      <h2 class="u-display-caps text-[0.8rem]">In stock now</h2>
      <p class="text-[0.62rem] uppercase tracking-micro text-ink-muted">
        <span class="text-ink tabular-nums">{{ total }}</span> vehicles
      </p>
    </div>

    <div class="mt-8 flex flex-col gap-8">
      <VehicleCard
        v-for="(vehicle, i) in shown"
        :key="vehicle.id"
        :vehicle="vehicle"
        data-reveal
        :data-reveal-delay="i * 60"
      />
    </div>

    <RouterLink to="/vehicles" class="btn-ghost mt-8 w-full">
      View all stock
      <AppIcon name="arrow" :size="15" />
    </RouterLink>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import VehicleCard from '../shared/VehicleCard.vue'

// Six cards, after which the homepage drops back to full-width sections —
// the column is a shop window, not the whole inventory.
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 })

const total = vehicles.length

// Featured first, then the rest by price — the column is a shop window, so
// the most striking cars sit where the reader starts.
const shown = computed(() =>
  [...vehicles]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price)
    .slice(0, props.limit),
)
</script>
