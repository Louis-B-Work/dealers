<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="card-hover group flex flex-col overflow-hidden rounded-panel border border-line bg-white shadow-soft"
  >
    <div class="relative aspect-[16/10] overflow-hidden">
      <VehiclePlaceholder
        :gradient="vehicle.gradient"
        :badge="vehicle.badge"
        :image="vehicle.image"
        :label="`${vehicle.make} ${vehicle.model}`"
        class="h-full w-full transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
      />
      <div
        class="absolute bottom-3 right-3 rounded-control bg-ink/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
      >
        {{ formatCurrency(vehicle.price) }}
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="flex flex-col gap-1">
        <p class="text-xs font-semibold uppercase tracking-wider text-accent">
          {{ vehicle.make }}
        </p>
        <h3 class="font-display text-lg leading-tight text-ink">
          {{ vehicle.model }} <span class="text-ink-muted">{{ vehicle.variant }}</span>
        </h3>
      </div>

      <ul class="grid grid-cols-2 gap-y-2 text-sm text-ink-soft">
        <li class="flex items-center gap-2">
          <AppIcon name="calendar" :size="15" class="text-ink-muted" />{{ vehicle.registration }}
        </li>
        <li class="flex items-center gap-2">
          <AppIcon name="gauge" :size="15" class="text-ink-muted" />{{ formatMileage(vehicle.mileage) }}
        </li>
        <li class="flex items-center gap-2">
          <AppIcon name="fuel" :size="15" class="text-ink-muted" />{{ vehicle.fuel }}
        </li>
        <li class="flex items-center gap-2">
          <AppIcon name="gear" :size="15" class="text-ink-muted" />{{ vehicle.transmission }}
        </li>
      </ul>

      <div class="mt-auto flex items-end justify-between border-t border-line pt-4">
        <div>
          <p class="text-xs text-ink-muted">From</p>
          <p class="font-display text-lg text-ink">
            {{ formatCurrency(vehicle.monthlyFrom) }}<span class="text-sm text-ink-muted">/mo</span>
          </p>
        </div>
        <span
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-all duration-300 ease-premium group-hover:gap-2.5 group-hover:text-accent"
        >
          View
          <AppIcon name="arrow" :size="16" />
        </span>
      </div>

      <!-- Required on every card that shows a monthly price, not once per row. -->
      <p class="text-[0.6rem] leading-snug text-ink-muted">
        Representative {{ REPRESENTATIVE_APR }}% APR. {{ brokerDisclosure }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Vehicle } from '../../data/vehicles'
import { formatCurrency, formatMileage } from '../../composables/useVehicleFilters'
import { brokerDisclosure, REPRESENTATIVE_APR } from '../../data/dealer'
import AppIcon from './AppIcon.vue'
import VehiclePlaceholder from './VehiclePlaceholder.vue'

defineProps<{ vehicle: Vehicle }>()
</script>
