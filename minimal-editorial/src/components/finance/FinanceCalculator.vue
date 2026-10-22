<template>
  <section id="calculator" class="py-20 md:py-28">
    <div class="u-gutter flex w-full flex-col gap-14">
      <SectionHeading
        title="Estimate your payments"
        subtitle="For illustration purposes only. Credit is subject to status."
        center
      />

      <div class="mx-auto grid w-full max-w-6xl border-y border-ink lg:grid-cols-[1.1fr_1fr] lg:divide-x lg:divide-line" data-reveal>
        <div class="flex flex-col gap-10 py-10 lg:py-12 lg:pr-14">
          <div class="flex flex-col gap-4">
            <span class="field-label !mb-0">Type of finance</span>
            <div class="flex gap-10" role="radiogroup" aria-label="Type of finance">
              <button
                v-for="opt in types"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="financeType === opt.value"
                class="tab"
                :class="{ 'is-selected': financeType === opt.value }"
                @click="financeType = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <label class="flex flex-col gap-4">
            <span class="flex items-baseline justify-between">
              <span class="field-label !mb-0">Vehicle price</span>
              <span class="font-display text-xl font-light text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="4000" max="150000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-4">
            <span class="flex items-baseline justify-between">
              <span class="field-label !mb-0">Deposit</span>
              <span class="font-display text-xl font-light text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="Math.round(price * 0.5)" step="250" class="range" />
          </label>

          <div class="flex flex-col gap-4">
            <span class="field-label !mb-0">Finance term</span>
            <div class="flex gap-10" role="radiogroup" aria-label="Finance term">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                role="radio"
                :aria-checked="term === t"
                class="tab"
                :class="{ 'is-selected': term === t }"
                @click="term = t"
              >
                {{ t }} mo
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-8 py-10 lg:py-12 lg:pl-14">
          <div>
            <p class="field-label">Estimated monthly payment</p>
            <p class="font-display text-6xl font-light leading-none tracking-tight text-ink">{{ formatCurrency(monthly) }}</p>
            <p class="mt-3 text-xs uppercase tracking-micro text-ink-muted">
              {{ term }} payments · representative {{ apr }}% APR
            </p>
          </div>

          <dl class="flex flex-col border-t border-line text-sm">
            <div v-for="row in rows" :key="row.label" class="flex items-baseline justify-between border-b border-line py-3">
              <dt class="text-ink-muted">{{ row.label }}</dt>
              <dd class="tabular-nums text-ink">{{ row.value }}</dd>
            </div>
          </dl>

          <p v-if="financeType === 'pcp'" class="text-xs leading-relaxed text-ink-muted">
            Excess mileage and damage charges may apply if you return the car at the end of a PCP.
          </p>

          <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-primary self-start">
            Apply now
            <AppIcon name="arrow" :size="14" />
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
/* Options are set as wide-tracked words with a drawn rule under the chosen one. */
.tab {
  @apply relative pb-2 text-[0.72rem] font-medium uppercase tracking-micro text-ink-muted transition-colors duration-300 ease-premium hover:text-ink;
}

.tab::after {
  content: '';
  @apply absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-premium;
}

.tab.is-selected {
  @apply text-ink;
}

.tab.is-selected::after {
  @apply scale-x-100;
}

.range {
  @apply h-px w-full cursor-pointer appearance-none bg-ink/30 outline-none;
}

.range::-webkit-slider-thumb {
  @apply h-3 w-3 appearance-none bg-ink;
}

.range::-moz-range-thumb {
  @apply h-3 w-3 rounded-none border-0 bg-ink;
}
</style>
