<template>
  <article
    class="group relative overflow-hidden rounded-panel border border-line bg-surface transition duration-200 hover:border-ink-muted hover:shadow-soft"
    :class="layout === 'list' ? 'sm:flex' : 'flex flex-col'"
  >
    <div
      class="relative shrink-0 overflow-hidden"
      :class="layout === 'list' ? 'sm:w-72 xl:w-80' : ''"
      :style="{ background: `linear-gradient(135deg, rgb(${vehicle.gradient[0]}), rgb(${vehicle.gradient[1]}))` }"
    >
      <img
        :src="vehicle.image"
        :alt="`${vehicle.year} ${vehicle.make} ${vehicle.model}`"
        class="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        :loading="priority ? 'eager' : 'lazy'"
        decoding="async"
        width="1200"
        height="900"
      />
      <span
        v-if="vehicle.badge"
        class="absolute left-3 top-3 rounded bg-ink px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-paper"
      >
        {{ vehicle.badge }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="line-clamp-2 text-base font-semibold leading-snug">
            <RouterLink
              :to="{ name: 'vehicle', params: { id: vehicle.id } }"
              class="after:absolute after:inset-0 after:content-['']"
            >
              {{ vehicle.make }} {{ vehicle.model }}
            </RouterLink>
          </h3>
          <p class="truncate text-sm text-ink-muted">{{ vehicle.variant }}</p>
        </div>
        <div class="shrink-0 text-right">
          <p class="tabular text-xl font-bold leading-none">{{ primary }}</p>
          <p class="tabular mt-1 text-xs text-ink-muted">{{ secondary }}</p>
        </div>
      </div>

      <ul class="mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-3 text-xs text-ink-soft">
        <li class="tabular">{{ vehicle.year }}</li>
        <li class="tabular">{{ formatMileage(vehicle.mileage) }}</li>
        <li>{{ vehicle.fuel }}</li>
        <li>{{ vehicle.transmission }}</li>
        <li v-if="layout === 'list'">{{ vehicle.bodyType }}</li>
      </ul>

      <p v-if="layout === 'list'" class="mt-3 hidden max-w-prose text-sm text-ink-soft sm:block">
        {{ vehicle.description }}
      </p>

      <p class="mt-auto pt-4 text-sm font-semibold text-accent">
        View details
        <AppIcon name="arrow" :size="14" class="ml-1 inline transition group-hover:translate-x-0.5" />
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Vehicle } from '../../data/vehicles'
import type { PriceMode, ViewMode } from '../../composables/useStockSearch'
import { formatCurrency, formatMileage } from '../../composables/useStockSearch'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    vehicle: Vehicle
    mode?: PriceMode
    layout?: ViewMode
    priority?: boolean
  }>(),
  { mode: 'cash', layout: 'grid', priority: false },
)

// The toggle swaps which figure leads. The other stays visible so neither is hidden.
const monthly = computed(() => `${formatCurrency(props.vehicle.monthlyFrom)}/mo`)
const cash = computed(() => formatCurrency(props.vehicle.price))
const primary = computed(() => (props.mode === 'monthly' ? monthly.value : cash.value))
const secondary = computed(() =>
  props.mode === 'monthly' ? `${cash.value} cash price` : `from ${monthly.value}`,
)
</script>
