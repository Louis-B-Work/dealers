<template>
  <article class="group relative">
    <div class="relative overflow-hidden rounded-panel bg-paper-sink" :style="{ background: `linear-gradient(135deg, rgb(${car.gradient[0]}), rgb(${car.gradient[1]}))` }">
      <img
        :src="car.image"
        :alt="`${car.year} ${car.make} ${car.model} in ${car.colour}`"
        class="aspect-[3/2] w-full object-cover transition duration-[1200ms] ease-premium group-hover:scale-[1.035]"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        width="1600"
        height="1067"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      <span v-if="car.badge" class="absolute left-4 top-4 rounded-full border border-accent/60 bg-black/50 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-accent backdrop-blur-sm">
        {{ car.badge }}
      </span>
    </div>
    <div class="flex items-end justify-between gap-4 border-b border-line py-5">
      <div class="min-w-0">
        <p class="text-[0.65rem] uppercase tracking-[0.24em] text-ink-muted">{{ car.make }}</p>
        <h3 class="truncate font-display text-2xl leading-tight">
          <RouterLink :to="{ name: 'vehicle', params: { id: car.id } }" class="after:absolute after:inset-0 after:content-[''] group-hover:text-accent">
            {{ car.model }}
          </RouterLink>
        </h3>
        <p class="tabular mt-1 truncate text-xs text-ink-muted">{{ car.variant }} · {{ car.year }} · {{ formatMileage(car.mileage) }}</p>
      </div>
      <p class="shrink-0 text-right">
        <span class="tabular block font-display text-xl">{{ formatCurrency(car.price) }}</span>
        <span class="tabular text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">from {{ formatCurrency(car.monthlyFrom) }}/mo</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatCurrency, formatMileage } from '../../composables/useCollectionSearch'
import type { Vehicle } from '../../data/vehicles'

withDefaults(defineProps<{ car: Vehicle; eager?: boolean }>(), { eager: false })
</script>
