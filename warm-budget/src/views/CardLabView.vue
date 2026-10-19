<template>
  <div class="min-h-screen bg-paper py-10">
    <div class="u-gutter w-full">
      <header class="max-w-prose">
        <p class="u-eyebrow">Card lab</p>
        <h1 class="u-display mt-2 text-2xl">VehicleCard at every width it meets</h1>
        <p class="mt-3 text-sm leading-relaxed text-ink-soft">
          The card is container-query driven, so it takes no width props. It reads its own column.
          Each strip below is the card at a column width it actually gets on the site, plus the two
          edge cases: a vehicle with no finance figure, and one with no price at all.
        </p>
        <RouterLink to="/" class="btn-ghost mt-5">Back to the site</RouterLink>
      </header>

      <section v-for="strip in strips" :key="strip.label" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {{ strip.label }}
        </h2>
        <div class="mt-3" :style="{ width: strip.width }">
          <VehicleCard :vehicle="strip.vehicle" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { vehicles } from '../data/vehicles'
import VehicleCard from '../components/shared/VehicleCard.vue'

const withFinance = vehicles.find((v) => v.monthlyFrom > 0) ?? vehicles[0]
const withoutFinance = vehicles.find((v) => v.monthlyFrom === 0) ?? vehicles[0]

// A price of zero never appears in the mock inventory, so the POA path is
// exercised with a synthetic copy rather than left untested.
const withoutPrice = { ...withFinance, price: 0, monthlyFrom: 0, badge: undefined }

const strips = computed(() => [
  { label: '4-up VLP / similar-cars grid at 280px', width: '280px', vehicle: withFinance },
  { label: '3-up homepage row at 340px', width: '340px', vehicle: withFinance },
  { label: '2-up tablet grid at 420px', width: '420px', vehicle: withFinance },
  { label: 'Single column on a phone at 560px', width: '560px', vehicle: withFinance },
  { label: 'No finance figure at 340px', width: '340px', vehicle: withoutFinance },
  { label: 'No price at all (POA) at 340px', width: '340px', vehicle: withoutPrice },
])
</script>
