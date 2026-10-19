<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="vcard card-hover group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-white shadow-soft"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <VehiclePlaceholder
        :gradient="vehicle.gradient"
        :image="vehicle.image"
        :label="`${vehicle.make} ${vehicle.model}`"
        class="h-full w-full transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
      />

      <!-- Scrims keep the overlaid text legible whatever the photo behind it. -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style="background: linear-gradient(to top, rgba(10, 13, 16, 0.8), transparent)"
      ></div>

      <!-- Forced onto a single row: a wrapped pill sitting alone reads as an
           orphan, so the labels shrink with the card instead of wrapping. -->
      <ul class="pill-row absolute inset-x-0 bottom-0 flex flex-nowrap items-center gap-1.5 p-4">
        <li class="stat-pill">{{ vehicle.year }}</li>
        <li class="stat-pill">
          <span class="mi-long">{{ formatMileage(vehicle.mileage) }}</span>
          <span class="mi-short">{{ formatMileageShort(vehicle.mileage) }}</span>
        </li>
        <li class="stat-pill">{{ vehicle.fuel }}</li>
        <li class="stat-pill">{{ vehicle.transmission }}</li>
      </ul>
    </div>

    <!-- Title and price share the white block and invert together on hover. -->
    <div
      class="flex flex-1 flex-col gap-4 p-5 transition-colors duration-300 ease-premium group-hover:bg-accent"
    >
      <div class="flex min-w-0 flex-col gap-0.5">
        <p
          class="truncate text-xs font-semibold uppercase tracking-wider text-accent transition-colors duration-300 ease-premium group-hover:text-white/80"
        >
          {{ vehicle.make }}
        </p>
        <!-- Single line, ellipsised: a wrapping title would make this card
             taller than its neighbours in the same grid row. The space before
             the variant is explicit, as Vue condenses whitespace across lines. -->
        <h3
          class="card-title truncate font-display text-lg leading-tight text-ink transition-colors duration-300 ease-premium group-hover:text-white"
        >
          {{ vehicle.model }}&nbsp;<span
            class="text-ink-muted transition-colors duration-300 ease-premium group-hover:text-white/75"
            >{{ vehicle.variant }}</span
          >
        </h3>
      </div>

      <div
        class="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4 transition-colors duration-300 ease-premium group-hover:border-white/25"
      >
        <div class="flex flex-col">
          <p
            class="font-display text-2xl font-semibold leading-none text-ink transition-colors duration-300 ease-premium group-hover:text-white"
          >
            {{ formatCurrency(vehicle.price) }}
          </p>
          <p
            class="mt-1.5 text-sm text-ink-muted transition-colors duration-300 ease-premium group-hover:text-white/80"
          >
            From {{ formatCurrency(vehicle.monthlyFrom) }}/mo
          </p>
        </div>

        <span
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-all duration-300 ease-premium group-hover:gap-2.5 group-hover:text-white"
        >
          View
          <AppIcon name="arrow" :size="16" />
        </span>
      </div>

      <!-- Required on every card that shows a monthly price, not once per row. -->
      <p
        class="text-[0.6rem] leading-snug text-ink-muted transition-colors duration-300 ease-premium group-hover:text-white/75"
      >
        Representative {{ REPRESENTATIVE_APR }}% APR. {{ brokerDisclosure }}
      </p>
    </div>

    <!-- Drawn as an inset ring rather than a border so it occupies no layout
         space and cannot shift the card when it appears. -->
    <span
      class="pointer-events-none absolute inset-0 rounded-panel opacity-0 ring-1 ring-inset ring-accent transition-opacity duration-300 ease-premium group-hover:opacity-100"
    ></span>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Vehicle } from '../../data/vehicles'
import { formatCurrency, formatMileage, formatMileageShort } from '../../composables/useVehicleFilters'
import { brokerDisclosure, REPRESENTATIVE_APR } from '../../data/dealer'
import AppIcon from './AppIcon.vue'
import VehiclePlaceholder from './VehiclePlaceholder.vue'

defineProps<{ vehicle: Vehicle }>()
</script>

<style scoped>
/* The card responds to its own width, not the viewport, so it stays correct in
   any column count or in the isolated card lab. */
.vcard {
  container-type: inline-size;
  container-name: vcard;
}

.stat-pill {
  @apply inline-flex shrink items-center overflow-hidden whitespace-nowrap rounded-control border border-white/25 bg-white/15 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur-md;
}

.mi-short {
  display: none;
}

/* Narrow columns (4-up): tighten the pills and drop to the compact mileage
   label rather than letting a pill wrap or truncate. */
@container vcard (max-width: 340px) {
  .pill-row {
    @apply gap-1 p-3;
  }
  .stat-pill {
    @apply px-2 text-[0.65rem];
  }
  /* Smaller title in narrow columns, so more of it survives before ellipsis. */
  .card-title {
    @apply text-base;
  }
  .mi-long {
    display: none;
  }
  .mi-short {
    display: inline;
  }
}

/* Tightest tier: 4-up at the low end of its range, where the longest
   combination ("Automatic" plus a six-figure mileage) still has to fit. */
@container vcard (max-width: 268px) {
  .pill-row {
    @apply gap-0.5 px-2.5;
  }
  .stat-pill {
    @apply px-1.5 text-[0.6rem];
  }
}
</style>
