<template>
  <div class="panel overflow-hidden lg:grid lg:grid-cols-[1fr_0.9fr]">
    <form class="grid content-start gap-5 p-6 sm:p-8" novalidate @submit.prevent>
      <div>
        <p class="u-eyebrow">Payment calculator</p>
        <h2 class="u-h2 mt-2">Work out a monthly payment</h2>
      </div>

      <div>
        <label class="field-label" for="c-vehicle">Choose a car from stock</label>
        <select id="c-vehicle" v-model="vehicleId" class="field" @change="onVehicle">
          <option value="">Enter my own price</option>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.make }} {{ vehicle.model }} · {{ formatCurrency(vehicle.price) }}
          </option>
        </select>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="field-label" for="c-price">Cash price (£)</label>
          <input id="c-price" v-model.number="price" type="number" min="500" max="200000" step="100" class="field" :aria-invalid="!!error" @input="vehicleId = ''" />
        </div>
        <div>
          <label class="field-label" for="c-deposit">Deposit (£)</label>
          <input id="c-deposit" v-model.number="deposit" type="number" min="0" :max="Number.isFinite(price) ? price : 0" step="100" class="field" :aria-invalid="!!error" />
        </div>
      </div>

      <div>
        <label class="field-label" for="c-term">Repayment term</label>
        <select id="c-term" v-model.number="term" class="field">
          <option v-for="months in TERMS" :key="months" :value="months">
            {{ months }} months ({{ months / 12 }} years)
          </option>
        </select>
      </div>

      <p class="text-xs leading-relaxed text-ink-muted">
        Illustration at a representative {{ REPRESENTATIVE_APR }}% APR, rounded to the nearest pound.
        It is not a quote, and no credit check is made.
      </p>
    </form>

    <div class="bg-ink p-6 text-paper sm:p-8" aria-live="polite">
      <template v-if="!error">
        <p class="text-xs font-semibold uppercase tracking-micro text-orange-300">Estimated payment</p>
        <p class="tabular mt-3 text-5xl font-bold">
          {{ formatCurrency(monthly) }}<span class="text-lg font-medium text-paper/70"> / month</span>
        </p>
        <p class="mt-1 text-sm text-paper/70">for {{ term }} months at {{ REPRESENTATIVE_APR }}% APR</p>
        <dl class="mt-8 divide-y divide-paper/15 text-sm">
          <div class="flex justify-between py-3"><dt class="text-paper/70">Cash price</dt><dd class="tabular">{{ formatCurrency(price) }}</dd></div>
          <div class="flex justify-between py-3"><dt class="text-paper/70">Deposit</dt><dd class="tabular">{{ formatCurrency(deposit) }}</dd></div>
          <div class="flex justify-between py-3"><dt class="text-paper/70">Amount of credit</dt><dd class="tabular">{{ formatCurrency(price - deposit) }}</dd></div>
        </dl>
        <RouterLink :to="enquiryLink" class="btn mt-8 w-full bg-paper text-ink hover:bg-orange-100">
          Talk through the options
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </template>
      <template v-else>
        <p class="text-xs font-semibold uppercase tracking-micro text-orange-300">Check your figures</p>
        <p class="mt-3 text-lg font-semibold" role="alert">{{ error }}</p>
      </template>
      <p class="mt-6 text-xs leading-relaxed text-paper/60">{{ brokerDisclosure }} Finance is subject to status.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { formatCurrency } from '../../composables/useStockSearch'
import { REPRESENTATIVE_APR, brokerDisclosure, monthlyPaymentFor } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'

const TERMS = [24, 36, 48, 60]
const route = useRoute()
const initial = vehicles.find((vehicle) => vehicle.id === route.query.vehicle)

const vehicleId = ref(initial?.id ?? '')
const price = ref<number>(initial?.price ?? 12000)
const deposit = ref<number>(0)
const term = ref(60)

function onVehicle() {
  const vehicle = vehicles.find((item) => item.id === vehicleId.value)
  if (vehicle) price.value = vehicle.price
}

const error = computed(() => {
  if (!Number.isFinite(price.value) || price.value < 500 || price.value > 200000)
    return 'Enter a cash price between £500 and £200,000.'
  if (!Number.isFinite(deposit.value) || deposit.value < 0 || deposit.value > price.value)
    return 'The deposit must be between £0 and the cash price.'
  return ''
})

const monthly = computed(() => (error.value ? 0 : monthlyPaymentFor(price.value - deposit.value, term.value)))

const enquiryLink = computed(() => ({
  path: '/contact',
  query: { subject: 'Finance', ...(vehicleId.value ? { vehicle: vehicleId.value } : {}) },
}))
</script>
