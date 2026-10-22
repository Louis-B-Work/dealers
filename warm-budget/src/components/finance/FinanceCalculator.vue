<template>
  <section id="calculator" class="u-section">
    <div class="u-gutter-wide flex flex-col gap-10">
      <SectionHeading
        title="Estimate your payments"
        subtitle="For illustration purposes only. Credit is subject to status."
        center
      />

      <div class="card grid w-full gap-8 p-6 md:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div class="flex flex-col gap-7">
          <div class="flex flex-col gap-2">
            <span class="field-label !mb-0">Type of finance</span>
            <div class="grid grid-cols-2 gap-1 rounded-full bg-paper-sink p-1" role="radiogroup" aria-label="Type of finance">
              <button
                v-for="opt in types"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="financeType === opt.value"
                class="rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-150"
                :class="financeType === opt.value ? 'bg-accent text-accent-ink shadow-card' : 'text-ink-soft hover:text-ink'"
                @click="financeType = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <label class="flex flex-col gap-3">
            <span class="flex items-baseline justify-between">
              <span class="field-label !mb-0">Vehicle price</span>
              <span class="font-display text-lg font-semibold text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="4000" max="150000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-3">
            <span class="flex items-baseline justify-between">
              <span class="field-label !mb-0">Deposit</span>
              <span class="font-display text-lg font-semibold text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="Math.round(price * 0.5)" step="250" class="range" />
          </label>

          <div class="flex flex-col gap-2">
            <span class="field-label !mb-0">Finance term</span>
            <div class="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Finance term">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                role="radio"
                :aria-checked="term === t"
                class="rounded-full border px-2 py-2.5 text-sm font-semibold transition-colors duration-150"
                :class="term === t ? 'border-accent bg-accent-wash text-accent' : 'border-line text-ink-soft hover:border-ink/30 hover:text-ink'"
                @click="term = t"
              >
                {{ t }} mo
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5 rounded-panel bg-accent-wash/60 p-6">
          <div>
            <p class="text-xs font-semibold text-ink-soft">Estimated monthly payment</p>
            <p class="font-display text-5xl font-semibold leading-tight text-accent">{{ formatCurrency(monthly) }}</p>
            <p class="text-sm text-ink-soft">{{ term }} payments at a representative {{ apr }}% APR</p>
          </div>

          <dl class="flex flex-col divide-y divide-line text-sm">
            <div v-for="row in rows" :key="row.label" class="flex justify-between py-2.5">
              <dt class="text-ink-soft">{{ row.label }}</dt>
              <dd class="font-medium text-ink">{{ row.value }}</dd>
            </div>
          </dl>

          <p v-if="financeType === 'pcp'" class="u-legal">
            Excess mileage and damage charges may apply if you return the car at the end of a PCP.
          </p>

          <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-primary">
            Apply now
            <AppIcon name="arrow" :size="16" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ELIGIBILITY_URL,
  REPRESENTATIVE_APR,
  balloonFor,
  monthlyPaymentFor,
  pcpMonthlyFor,
} from '../../data/dealer'
import { formatCurrency } from '../../composables/useVehicleFilters'
import { useFinanceType, type FinanceType } from '../../composables/useFinanceType'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const OPTION_TO_PURCHASE_FEE = 10

const apr = REPRESENTATIVE_APR
const types: { value: FinanceType; label: string }[] = [
  { value: 'pcp', label: 'PCP' },
  { value: 'hp', label: 'HP' },
]
const terms = [24, 36, 48, 60]

const { financeType } = useFinanceType()
const price = ref(15000)
const deposit = ref(1500)
const term = ref(48)

// The deposit cap follows the price, so a large deposit must come back down with it.
watch(price, (p) => {
  const cap = Math.round(p * 0.5)
  if (deposit.value > cap) deposit.value = cap
})

const financed = computed(() => Math.max(price.value - deposit.value, 0))
const balloon = computed(() => (financeType.value === 'pcp' ? balloonFor(price.value, term.value) : 0))

const monthly = computed(() =>
  financeType.value === 'pcp'
    ? pcpMonthlyFor(financed.value, balloon.value, term.value, apr)
    : monthlyPaymentFor(financed.value, term.value, apr),
)

const totalRepayable = computed(
  () => deposit.value + monthly.value * term.value + balloon.value + OPTION_TO_PURCHASE_FEE,
)

const rows = computed(() => [
  { label: 'Vehicle price', value: formatCurrency(price.value) },
  { label: 'Deposit', value: formatCurrency(deposit.value) },
  { label: 'Amount to finance', value: formatCurrency(financed.value) },
  { label: 'Optional final payment', value: formatCurrency(balloon.value) },
  { label: 'Option to purchase fee', value: formatCurrency(OPTION_TO_PURCHASE_FEE) },
  { label: 'Total cost of credit', value: formatCurrency(Math.max(totalRepayable.value - price.value, 0)) },
  { label: 'Total repayable', value: formatCurrency(totalRepayable.value) },
])
</script>

<style scoped>
.range {
  @apply h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line outline-none;
}

.range::-webkit-slider-thumb {
  @apply h-5 w-5 appearance-none rounded-full border-2 border-white bg-accent shadow-card;
}

.range::-moz-range-thumb {
  @apply h-5 w-5 rounded-full border-2 border-white bg-accent;
}
</style>
