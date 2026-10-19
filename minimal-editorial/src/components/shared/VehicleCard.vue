<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="vcard group relative flex h-full flex-col border border-line bg-paper p-5 transition duration-500 ease-premium hover:-translate-y-1 hover:border-ink hover:shadow-lift"
  >
    <!-- Title sits *above* the photo, the way the Romans card is built — the
         name reads first, the car confirms it. One line, ellipsised: a
         wrapping title would make this card taller than its grid neighbours. -->
    <h3 class="card-title truncate font-display font-medium uppercase tracking-[0.12em] text-ink">
      {{ vehicle.make }} {{ vehicle.model }}&nbsp;<span class="text-ink-muted">{{
        vehicle.variant
      }}</span>
    </h3>

    <div class="relative mt-4 aspect-[16/10] overflow-hidden bg-paper-sink">
      <VehiclePlaceholder
        :image="vehicle.image"
        object-position="center 78%"
        :badge="vehicle.badge"
        :label="`${vehicle.make} ${vehicle.model}`"
        class="h-full w-full transition-transform duration-[900ms] ease-premium group-hover:scale-[1.06]"
      />
    </div>

    <!-- Specs left, price right — the price is aligned to the first spec row
         rather than floated to the bottom, which is what gives the block its
         newspaper-listing feel. -->
    <div class="mt-5 flex items-start justify-between gap-5">
      <dl class="card-specs flex min-w-0 flex-1 flex-col gap-2.5">
        <div v-for="spec in specs" :key="spec.label" class="spec-row">
          <dt class="spec-label w-[4.75rem]">{{ spec.label }}:</dt>
          <dd class="spec-value">{{ spec.value }}</dd>
        </div>
      </dl>

      <p class="card-price shrink-0 text-right font-display font-medium tracking-[0.06em] text-ink">
        {{ priceLabel }}
      </p>
    </div>

    <!-- Full-strength rule, not a grey hairline: it's a drawn line that
         separates the detail from the action. -->
    <div class="mt-auto pt-5">
      <div class="u-rule-strong pt-5">
        <span
          class="btn flex w-full border border-ink bg-ink text-paper transition duration-500 ease-premium group-hover:bg-paper group-hover:text-ink"
        >
          View vehicle
        </span>
      </div>

      <!-- Required on every card that shows a monthly figure, not once per
           row. Only rendered when the finance line is actually shown. -->
      <p v-if="showsMonthly" class="mt-4 text-[0.6rem] leading-relaxed text-ink-muted">
        Representative {{ REPRESENTATIVE_APR }}% APR. {{ brokerDisclosure }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '../../data/vehicles'
import { formatCurrency } from '../../composables/useVehicleFilters'
import { brokerDisclosure, REPRESENTATIVE_APR } from '../../data/dealer'
import VehiclePlaceholder from './VehiclePlaceholder.vue'

const props = defineProps<{ vehicle: Vehicle }>()

// A vehicle with no price on it is shown as POA rather than "£0".
const priceLabel = computed(() =>
  props.vehicle.price > 0 ? formatCurrency(props.vehicle.price) : 'POA',
)

// Finance is only quoted where there's a price to finance against.
const showsMonthly = computed(() => props.vehicle.price > 0 && props.vehicle.monthlyFrom > 0)

const specs = computed(() => {
  const v = props.vehicle
  const rows = [
    { label: 'Year', value: v.registration },
    { label: 'Colour', value: v.colour },
    { label: 'Mileage', value: new Intl.NumberFormat('en-GB').format(v.mileage) },
  ]
  if (showsMonthly.value) {
    rows.push({ label: 'Finance', value: `${formatCurrency(v.monthlyFrom)} per month` })
  }
  return rows
})
</script>

<style scoped>
/* The card responds to its own width, not the viewport, so it stays correct
   in the narrow home stock column, in the wider VLP grid, and in the card
   lab — one component, no width props. */
.vcard {
  container-type: inline-size;
  container-name: vcard;
}

.card-title {
  @apply text-sm;
}

.card-price {
  @apply text-lg;
}

/* Roomier columns get a larger title and price, and the spec type steps up
   with them so the block keeps its proportions. */
@container vcard (min-width: 360px) {
  .card-title {
    @apply text-base;
  }

  .card-price {
    @apply text-xl;
  }
}

/* Tightest columns (4-up): the spec block drops a step so the finance row's
   long value still fits beside its label. */
@container vcard (max-width: 300px) {
  .card-specs {
    @apply gap-2;
  }

  .card-specs .spec-row {
    @apply text-[0.8rem];
  }

  .card-specs .spec-label {
    @apply w-[4.1rem];
  }

  .card-price {
    @apply text-base;
  }
}
</style>
