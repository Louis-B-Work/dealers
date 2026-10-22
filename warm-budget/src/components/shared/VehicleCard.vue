<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="vcard card card-hover group flex h-full flex-col overflow-hidden"
  >
    <!-- Photo first. A budget shopper scans pictures and prices; the name is
         confirmation, not the headline, which is the opposite of the way the
         other drafts build their card. -->
    <div class="relative aspect-[4/3] shrink-0">
      <VehiclePlaceholder
        :image="vehicle.image"
        :gradient="vehicle.gradient"
        object-position="center 62%"
        :label="`${vehicle.make} ${vehicle.model}`"
        class="h-full w-full"
      />

      <span
        class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-semibold text-paper backdrop-blur-sm"
      >
        <AppIcon name="camera" :size="14" />
        {{ photos }}
      </span>

      <span v-if="vehicle.badge" class="badge absolute right-3 top-3 shadow-card">
        {{ vehicle.badge }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <h3
        class="card-title truncate font-display font-semibold text-ink transition-colors duration-150 group-hover:text-accent"
      >
        {{ vehicle.make }} {{ vehicle.model }}
      </h3>
      <p class="mt-0.5 truncate text-sm text-ink-soft">
        {{ vehicle.registration }} {{ vehicle.variant }}
      </p>

      <ul class="card-chips mt-3 flex flex-wrap gap-1.5">
        <li v-for="chip in chips" :key="chip" class="chip">{{ chip }}</li>
      </ul>

      <div class="mt-auto pt-4">
        <div class="flex items-end justify-between gap-3 border-t border-line pt-3">
          <!-- The shopper chooses which figure leads: the total price, or the monthly cost.
               The other is kept alongside, so both are always on show. -->
          <p v-if="leadsMonthly" class="card-price font-display font-semibold leading-none text-accent">
            {{ formatCurrency(vehicle.monthlyFrom) }}<span class="text-xs font-medium text-ink-muted"> a month</span>
          </p>
          <p v-else class="card-price font-display font-semibold leading-none text-ink">
            {{ priceLabel }}
          </p>

          <p v-if="showsMonthly && leadsMonthly" class="text-right leading-none">
            <span class="card-monthly font-display font-semibold text-ink">{{ priceLabel }}</span>
            <span class="text-xs font-medium text-ink-muted"> total</span>
          </p>
          <p v-else-if="showsMonthly" class="text-right leading-none">
            <span class="card-monthly font-display font-semibold text-accent">
              {{ formatCurrency(vehicle.monthlyFrom) }}
            </span>
            <span class="text-xs font-medium text-ink-muted"> a month</span>
          </p>
          <p v-else class="text-right text-xs font-semibold leading-none text-ink-muted">
            Cash sale only
          </p>
        </div>

        <!-- Required on every card that quotes a monthly figure, not once per
             row. A card with no finance line carries no disclosure, because it
             quotes no figure. -->
        <p v-if="showsMonthly" class="u-legal mt-2.5">
          Representative {{ REPRESENTATIVE_APR }}% APR. {{ brokerDisclosure }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Vehicle } from '../../data/vehicles'
import { photoCount } from '../../data/vehicles'
import { formatCurrency, formatMileage } from '../../composables/useVehicleFilters'
import { brokerDisclosure, REPRESENTATIVE_APR } from '../../data/dealer'
import { usePriceMode } from '../../composables/usePriceMode'
import AppIcon from './AppIcon.vue'
import VehiclePlaceholder from './VehiclePlaceholder.vue'

const props = defineProps<{ vehicle: Vehicle }>()

// A vehicle with no price on it is shown as POA rather than "£0".
const priceLabel = computed(() =>
  props.vehicle.price > 0 ? formatCurrency(props.vehicle.price) : 'POA',
)

// Finance is only quoted where there is a price to finance against.
const showsMonthly = computed(() => props.vehicle.price > 0 && props.vehicle.monthlyFrom > 0)

const { priceMode } = usePriceMode()
const leadsMonthly = computed(() => priceMode.value === 'monthly' && showsMonthly.value)

const photos = computed(() => photoCount(props.vehicle.id))

const chips = computed(() => [
  formatMileage(props.vehicle.mileage),
  props.vehicle.fuel,
  props.vehicle.transmission,
  props.vehicle.bodyType,
])
</script>

<style scoped>
/* The card responds to its own width, not the viewport, so it stays correct in
   the 4-up VLP grid, in the 3-up homepage row and in the card lab — one
   component, no width props. */
.vcard {
  container-type: inline-size;
  container-name: vcard;
}

.card-title {
  @apply text-base;
}

.card-price {
  @apply text-xl;
}

.card-monthly {
  @apply text-lg;
}

/* Roomier columns get a larger title and price. */
@container vcard (min-width: 340px) {
  .card-title {
    @apply text-lg;
  }

  .card-price {
    @apply text-2xl;
  }

  .card-monthly {
    @apply text-xl;
  }
}

/* Tightest columns: the price row would wrap with four chips above it, so the
   last chip is dropped and the figures step down a size. */
@container vcard (max-width: 280px) {
  .card-chips li:nth-child(n + 4) {
    @apply hidden;
  }

  .card-title {
    @apply text-sm;
  }

  .card-price {
    @apply text-lg;
  }

  .card-monthly {
    @apply text-base;
  }
}
</style>
