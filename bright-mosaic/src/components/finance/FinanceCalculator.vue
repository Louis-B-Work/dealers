<template>
  <section id="calculator" class="py-16 md:py-24">
    <div class="container flex flex-col gap-10">
      <SectionHeading
        title="Estimate your payments"
        subtitle="For illustration purposes only. Credit is subject to status."
        center
      />

      <!-- A bento: the controls are separate tiles, the answer is the tall blue one. -->
      <div class="grid gap-4 lg:grid-cols-3" data-reveal>
        <div class="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-rows-[auto_auto_auto]">
          <div class="flex flex-col gap-3 rounded-panel border border-line bg-surface p-5 shadow-soft">
            <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Type of finance</span>
            <div class="grid grid-cols-2 gap-1 rounded-full bg-paper-sink p-1" role="radiogroup" aria-label="Type of finance">
              <button
                v-for="opt in types"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="financeType === opt.value"
                class="rounded-full px-4 py-2.5 text-sm font-extrabold transition duration-300"
                :class="financeType === opt.value ? 'bg-accent text-accent-ink shadow-soft' : 'text-ink-soft hover:text-ink'"
                @click="financeType = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3 rounded-panel border border-line bg-surface p-5 shadow-soft">
            <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Finance term</span>
            <div class="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Finance term">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                role="radio"
                :aria-checked="term === t"
                class="rounded-full border px-1 py-2.5 text-sm font-extrabold transition duration-300"
                :class="term === t ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft hover:border-ink-muted hover:text-ink'"
                @click="term = t"
              >
                {{ t }}
              </button>
            </div>
            <span class="text-xs text-ink-muted">months</span>
          </div>

          <label class="flex flex-col gap-4 rounded-panel bg-paper-sink p-5 sm:col-span-2">
            <span class="flex items-baseline justify-between">
              <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Vehicle price</span>
              <span class="font-display text-2xl font-extrabold text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="4000" max="150000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-4 rounded-panel bg-paper-soft p-5 sm:col-span-2">
            <span class="flex items-baseline justify-between">
              <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Deposit</span>
              <span class="font-display text-2xl font-extrabold text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="Math.round(price * 0.5)" step="250" class="range" />
          </label>
        </div>

        <div class="flex flex-col gap-6 rounded-panel bg-accent p-6 text-accent-ink shadow-lift">
          <div>
            <p class="text-xs font-bold uppercase tracking-micro text-accent-ink/70">Estimated monthly payment</p>
            <p class="mt-3">
              <span class="price-pill !px-4 !py-1.5 !text-3xl">{{ formatCurrency(monthly) }}</span>
            </p>
            <p class="mt-3 text-sm text-accent-ink/80">{{ term }} payments at a representative {{ apr }}% APR</p>
          </div>

          <dl class="flex flex-col divide-y divide-white/20 text-sm">
            <div v-for="row in rows" :key="row.label" class="flex justify-between gap-4 py-2.5">
              <dt class="text-accent-ink/75">{{ row.label }}</dt>
              <dd class="font-bold tabular-nums">{{ row.value }}</dd>
            </div>
          </dl>

          <p v-if="financeType === 'pcp'" class="text-xs text-accent-ink/70">
            Excess mileage and damage charges may apply if you return the car at the end of a PCP.
          </p>

          <a
            :href="ELIGIBILITY_URL"
            target="_blank"
            rel="noopener"
            class="btn mt-auto bg-surface text-accent hover:-translate-y-0.5 hover:shadow-lift"
          >
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
  @apply h-2 w-full cursor-pointer appearance-none rounded-full bg-white outline-none;
  box-shadow: inset 0 0 0 1px rgb(var(--c-line));
}

.range::-webkit-slider-thumb {
  @apply h-6 w-6 appearance-none rounded-full border-4 border-white bg-accent shadow-soft;
}

.range::-moz-range-thumb {
  @apply h-6 w-6 rounded-full border-4 border-white bg-accent;
}
</style>
