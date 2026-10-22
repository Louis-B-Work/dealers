<template>
  <section id="calculator" class="bg-paper py-20 md:py-28">
    <div class="u-gutter flex w-full flex-col gap-12">
      <SectionHeading
        title="Estimate your payments"
        subtitle="For illustration purposes only. Credit is subject to status."
        center
      />

      <div class="panel mx-auto grid w-full max-w-5xl gap-10 p-6 md:p-10 lg:grid-cols-[1.1fr_1fr]" data-reveal>
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-2.5">
            <span class="calc-label">Type of finance</span>
            <div class="grid grid-cols-2 divide-x divide-line border border-line" role="radiogroup" aria-label="Type of finance">
              <button
                v-for="opt in types"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="financeType === opt.value"
                class="term-btn"
                :class="{ 'is-selected': financeType === opt.value }"
                @click="financeType = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <label class="flex flex-col gap-2.5">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Vehicle price</span>
              <span class="font-display text-lg text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="4000" max="150000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-2.5">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Deposit</span>
              <span class="font-display text-lg text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="Math.round(price * 0.5)" step="250" class="range" />
          </label>

          <div class="flex flex-col gap-2.5">
            <span class="calc-label">Finance term</span>
            <div class="grid grid-cols-4 divide-x divide-line border border-line" role="radiogroup" aria-label="Finance term">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                role="radio"
                :aria-checked="term === t"
                class="term-btn"
                :class="{ 'is-selected': term === t }"
                @click="term = t"
              >
                {{ t }}<span class="ml-0.5 text-[0.6rem] opacity-60">mo</span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 border border-line bg-paper-sink p-6">
          <div class="flex flex-col gap-1">
            <span class="calc-label">Estimated monthly</span>
            <span class="font-display text-[2.6rem] leading-none text-accent">{{ formatCurrency(monthly) }}</span>
            <span class="text-xs text-ink-muted">{{ term }} payments at a representative {{ apr }}% APR</span>
          </div>

          <dl class="flex flex-col divide-y divide-line border-y border-line text-sm">
            <div v-for="row in rows" :key="row.label" class="flex justify-between py-2.5">
              <dt class="text-ink-muted">{{ row.label }}</dt>
              <dd class="text-ink">{{ row.value }}</dd>
            </div>
          </dl>

          <p v-if="financeType === 'pcp'" class="text-xs text-ink-muted">
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
import { ELIGIBILITY_URL, REPRESENTATIVE_APR, balloonFor, monthlyPaymentFor, pcpMonthlyFor } from '../../data/dealer'
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
.calc-label {
  @apply text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted;
}

.term-btn {
  @apply py-3 text-sm font-medium text-ink-soft transition-colors duration-300 ease-premium hover:bg-paper-sink hover:text-ink;
}

.term-btn.is-selected {
  @apply bg-accent text-accent-ink;
}

.range {
  @apply h-px w-full cursor-pointer appearance-none bg-line outline-none;
}

.range::-webkit-slider-thumb {
  @apply h-3.5 w-3.5 appearance-none rounded-full bg-accent transition;
  box-shadow: 0 0 0 4px rgb(var(--c-accent) / 0.18);
}

.range::-moz-range-thumb {
  @apply h-3.5 w-3.5 rounded-full border-0 bg-accent;
}
</style>
