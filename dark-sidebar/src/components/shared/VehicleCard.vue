<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="vcard panel panel-hover group relative flex h-full flex-col overflow-hidden"
  >
    <!-- Hairline that draws itself across the top edge on hover. It replaces
         the shadow lift template 01 uses, which reads as a smudge on black. -->
    <span
      class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-premium group-hover:scale-x-100"
    ></span>

    <div class="relative aspect-[16/10] overflow-hidden border-b border-line">
      <VehiclePlaceholder
        :gradient="vehicle.gradient"
        :image="vehicle.image"
        object-position="center 78%"
        :label="`${vehicle.make} ${vehicle.model}`"
        class="h-full w-full transition-transform duration-[900ms] ease-premium group-hover:scale-[1.06]"
      />

      <!-- Scrim so the quick-spec row stays legible over any photo. -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-14"
        style="background: linear-gradient(to bottom, rgba(9, 10, 12, 0.85), transparent)"
      ></div>

      <!-- Quick specs as a single dot-separated line — the values (year,
           mileage, fuel, gearbox) are self-explanatory without labels. Sits
           at the top of the photo so it doesn't compete with the car itself,
           which is framed toward the lower half of the shot. -->
      <p
        class="absolute left-3.5 right-3.5 top-2.5 truncate text-[0.72rem] font-medium text-white/90"
      >
        {{ vehicle.year }}
        <span class="text-white/35">&middot;</span>
        {{ formatMileageShort(vehicle.mileage) }}
        <span class="text-white/35">&middot;</span>
        {{ vehicle.fuel }}
        <span class="text-white/35">&middot;</span>
        {{ vehicle.transmission }}
      </p>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="flex min-w-0 flex-col gap-2">
        <p class="truncate text-[0.62rem] font-semibold uppercase tracking-micro text-ink-muted">
          {{ vehicle.make }}
        </p>
        <!-- Single line, ellipsised: a wrapping title would make this card
             taller than its neighbours in the same grid row. The space before
             the variant is explicit, as Vue condenses whitespace across lines. -->
        <h3
          class="card-title truncate font-display text-xl leading-tight text-ink transition-colors duration-300 ease-premium group-hover:text-accent"
        >
          {{ vehicle.model }}&nbsp;<span class="text-ink-muted">{{ vehicle.variant }}</span>
        </h3>
      </div>

      <div class="mt-auto flex flex-col gap-3 border-t border-line pt-4">
        <span
          class="font-display text-2xl leading-none text-ink transition-colors duration-300 ease-premium group-hover:text-accent"
        >
          {{ formatCurrency(vehicle.price) }}
        </span>

        <div class="flex items-end justify-between gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted">
              Finance from
            </span>
            <span class="text-sm text-ink-soft">
              {{ formatCurrency(vehicle.monthlyFrom) }}<span class="text-ink-muted">/mo</span>
            </span>
          </div>

          <span
            class="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft transition-all duration-300 ease-premium group-hover:gap-2.5 group-hover:text-accent"
          >
            View
            <AppIcon name="arrow" :size="15" />
          </span>
        </div>
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
import { formatCurrency, formatMileageShort } from '../../composables/useVehicleFilters'
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

/* Narrow columns (4-up): the title drops a size so it keeps to one line
   beside the card's own padding. */
@container vcard (max-width: 340px) {
  .card-title {
    @apply text-lg;
  }
}
</style>
