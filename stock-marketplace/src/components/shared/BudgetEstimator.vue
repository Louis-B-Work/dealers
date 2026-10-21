<template>
  <div class="panel p-6 sm:p-8">
    <p class="u-eyebrow">Shop by monthly budget</p>
    <h2 class="u-h2 mt-2">What fits your monthly budget?</h2>

    <label class="field-label mt-6" for="budget">Monthly budget</label>
    <div class="flex items-center gap-4">
      <input
        id="budget"
        v-model.number="budget"
        type="range"
        :min="MONTHLY_MIN"
        :max="MONTHLY_MAX"
        step="50"
        class="h-2 flex-1 cursor-pointer accent-[rgb(194_65_12)]"
      />
      <output for="budget" class="tabular w-24 text-right text-2xl font-bold">
        {{ formatCurrency(budget) }}
      </output>
    </div>

    <p class="mt-4 text-sm text-ink-soft" aria-live="polite">
      That could support borrowing of around
      <strong class="tabular text-ink">{{ formatCurrency(borrowable) }}</strong>
      over {{ QUOTE_TERM_MONTHS / 12 }} years with no deposit.
      <span class="tabular">{{ matches }}</span> {{ matches === 1 ? 'car' : 'cars' }} in stock
      {{ matches === 1 ? 'is' : 'are' }} within that payment.
    </p>

    <RouterLink :to="link" class="btn-accent mt-6 w-full sm:w-auto">
      See cars up to {{ formatCurrency(budget) }}/mo
      <AppIcon name="arrow" :size="16" />
    </RouterLink>

    <p class="mt-4 text-xs leading-relaxed text-ink-muted">
      Estimate only, at a representative {{ REPRESENTATIVE_APR }}% APR, rounded to the nearest £100.
      Finance is subject to status. {{ brokerDisclosure }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCurrency } from '../../composables/useStockSearch'
import {
  QUOTE_TERM_MONTHS,
  REPRESENTATIVE_APR,
  amountBorrowableFor,
  brokerDisclosure,
} from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{ target?: 'home' | 'vehicles' }>(), { target: 'home' })

const MONTHLY_MIN = 100
const MONTHLY_MAX = 400
const budget = ref(200)

const borrowable = computed(() => Math.round(amountBorrowableFor(budget.value) / 100) * 100)
const matches = computed(() => vehicles.filter((vehicle) => vehicle.monthlyFrom <= budget.value).length)

const link = computed(() =>
  props.target === 'home'
    ? { path: '/', query: { show: 'monthly', maxMonthly: String(budget.value) }, hash: '#stock' }
    : { path: '/vehicles', query: { show: 'monthly', maxMonthly: String(budget.value) } },
)
</script>
