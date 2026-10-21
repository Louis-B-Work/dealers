<template>
  <div class="grid overflow-hidden rounded-panel border border-line lg:grid-cols-[1.1fr_1fr]">
    <form class="grid content-start gap-6 p-6 sm:p-10" novalidate @submit.prevent>
      <div>
        <h2 class="u-h2">Shape your ownership</h2>
      </div>

      <div>
        <label class="field-label" for="c-vehicle">A car from the collection</label>
        <select id="c-vehicle" v-model="vehicleId" class="field" @change="onVehicle">
          <option value="">Enter my own price</option>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.make }} {{ vehicle.model }} · {{ formatCurrency(vehicle.price) }}
          </option>
        </select>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="field-label" for="c-price">Cash price (£)</label>
          <input id="c-price" v-model.number="price" type="number" min="1000" max="500000" step="500" class="field tabular" :aria-invalid="!!error" @input="vehicleId = ''" />
        </div>
        <div>
          <label class="field-label" for="c-deposit">Deposit (£)</label>
          <input id="c-deposit" v-model.number="deposit" type="number" min="0" step="500" class="field tabular" :aria-invalid="!!error" />
        </div>
      </div>

      <fieldset>
        <legend class="field-label">Term</legend>
        <div class="grid grid-cols-4 overflow-hidden rounded-control border border-line">
          <label
            v-for="months in TERMS"
            :key="months"
            class="cursor-pointer border-l border-line py-3 text-center text-sm transition first:border-l-0 has-[:checked]:bg-accent has-[:checked]:text-accent-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-accent"
          >
            <input v-model.number="term" type="radio" name="term" :value="months" class="sr-only" />
            <span class="tabular">{{ months }}</span>
            <span class="text-xs"> mo</span>
          </label>
        </div>
      </fieldset>

      <p class="text-xs leading-relaxed text-ink-muted">
        An illustration at a representative {{ REPRESENTATIVE_APR }}% APR, rounded to the nearest pound. It is not a
        quote and no credit check is made.
      </p>
    </form>

    <div class="flex flex-col border-t border-line bg-paper-soft p-6 sm:p-10 lg:border-l lg:border-t-0" aria-live="polite">
      <template v-if="!error">
        <p class="tabular font-display text-6xl leading-none text-accent">{{ formatCurrency(monthly) }}</p>
        <p class="mt-3 text-sm text-ink-soft">per month for {{ term }} months at {{ REPRESENTATIVE_APR }}% APR</p>
        <dl class="mt-10 divide-y divide-line border-y border-line text-sm">
          <div class="flex justify-between py-4"><dt class="text-ink-muted">Cash price</dt><dd class="tabular">{{ formatCurrency(price) }}</dd></div>
          <div class="flex justify-between py-4"><dt class="text-ink-muted">Deposit</dt><dd class="tabular">{{ formatCurrency(deposit) }}</dd></div>
          <div class="flex justify-between py-4"><dt class="text-ink-muted">Amount of credit</dt><dd class="tabular">{{ formatCurrency(price - deposit) }}</dd></div>
        </dl>
        <RouterLink :to="enquiryLink" class="btn-accent mt-10 self-start">
          Discuss finance
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
      </template>
      <template v-else>
        <p class="font-display text-3xl" role="alert">{{ error }}</p>
      </template>
      <p class="mt-auto pt-8 text-xs leading-relaxed text-ink-muted">{{ brokerDisclosure }} Finance is subject to status.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { formatCurrency } from '../../composables/useCollectionSearch'
import { REPRESENTATIVE_APR, brokerDisclosure, monthlyPaymentFor } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from './AppIcon.vue'

const TERMS = [24, 36, 48, 60]
const route = useRoute()
const initial = vehicles.find((vehicle) => vehicle.id === route.query.vehicle)

const vehicleId = ref(initial?.id ?? '')
const price = ref<number>(initial?.price ?? 75000)
const deposit = ref<number>(Math.round((initial?.price ?? 75000) * 0.1))
const term = ref(48)

function onVehicle() {
  const vehicle = vehicles.find((item) => item.id === vehicleId.value)
  if (!vehicle) return
  price.value = vehicle.price
  deposit.value = Math.round(vehicle.price * 0.1)
}

const error = computed(() => {
  if (!Number.isFinite(price.value) || price.value < 1000 || price.value > 500000)
    return 'Enter a cash price between £1,000 and £500,000.'
  if (!Number.isFinite(deposit.value) || deposit.value < 0 || deposit.value >= price.value)
    return 'The deposit must be at least £0 and less than the cash price.'
  return ''
})

const monthly = computed(() => (error.value ? 0 : monthlyPaymentFor(price.value - deposit.value, term.value)))

const enquiryLink = computed(() => ({
  path: '/contact',
  query: { subject: 'Finance', ...(vehicleId.value ? { vehicle: vehicleId.value } : {}) },
}))
</script>
