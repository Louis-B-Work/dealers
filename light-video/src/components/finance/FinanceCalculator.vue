<template>
  <section id="calculator" class="bg-paper py-20 md:py-28">
    <div class="container flex flex-col gap-12">
      <SectionHeading
        title="Estimate your payments"
        subtitle="For illustration purposes only. Credit is subject to status."
        center
      />

      <div
        class="mx-auto grid w-full max-w-5xl gap-8 rounded-panel border border-line bg-white p-6 shadow-soft md:p-10 lg:grid-cols-[1.1fr_1fr]"
        data-reveal
      >
        <div class="flex flex-col gap-7">
          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-ink">Type of finance</span>
            <div class="grid grid-cols-2 gap-1 rounded-control bg-paper-sink p-1" role="radiogroup" aria-label="Type of finance">
              <button
                v-for="opt in types"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="financeType === opt.value"
                class="rounded-control px-4 py-2.5 text-sm font-semibold transition"
                :class="financeType === opt.value ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'"
                @click="financeType = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <label class="flex flex-col gap-2">
            <span class="flex items-center justify-between text-sm">
              <span class="font-medium text-ink">Vehicle price</span>
              <span class="font-semibold text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="5000" max="100000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="flex items-center justify-between text-sm">
              <span class="font-medium text-ink">Deposit</span>
              <span class="font-semibold text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="price * 0.5" step="250" class="range" />
          </label>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-ink">Finance term</span>
            <div class="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Finance term">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                role="radio"
                :aria-checked="term === t"
                class="rounded-control border px-2 py-2.5 text-sm font-semibold transition"
                :class="term === t ? 'border-ink bg-ink text-white' : 'border-line text-ink-soft hover:border-ink hover:text-ink'"
                @click="term = t"
              >
                {{ t }} mo
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 rounded-panel bg-paper-soft p-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-ink-muted">Est. monthly payment</p>
            <p class="font-display text-4xl text-ink">{{ formatCurrency(monthly) }}</p>
            <p class="text-sm text-ink-soft">
              {{ term }} payments at a representative {{ apr }}% APR
            </p>
          </div>

          <dl class="flex flex-col gap-2 text-sm">
            <div v-for="row in rows" :key="row.label" class="flex justify-between border-b border-line pb-2 last:border-0">
              <dt class="text-ink-soft">{{ row.label }}</dt>
              <dd class="font-medium text-ink">{{ row.value }}</dd>
            </div>
          </dl>

          <p v-if="financeType === 'pcp'" class="text-xs text-ink-muted">
            Excess mileage and damage charges may apply if you return the car at the end of a PCP.
          </p>

          <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-accent justify-center">
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

// A deposit larger than half the price would leave the slider's max below its value.
watch(price, (p) => {
  if (deposit.value > p * 0.5) deposit.value = Math.round((p * 0.5) / 250) * 250
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
  @apply h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 outline-none;
}
.range::-webkit-slider-thumb {
  @apply h-4 w-4 appearance-none rounded-full border-2 border-white bg-accent transition;
  box-shadow: 0 0 0 4px rgb(var(--c-accent-soft) / 0.25);
}
.range::-moz-range-thumb {
  @apply h-4 w-4 rounded-full border-2 border-white bg-accent;
}
</style>
