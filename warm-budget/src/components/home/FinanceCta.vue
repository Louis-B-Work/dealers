<template>
  <section class="bg-paper-sink/60 u-section">
    <div class="u-gutter grid w-full items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        <SectionHeading
          title="Start with the monthly payment"
          subtitle="Most people know what they can afford each month long before they know what car they want. Work it the same way round here: set your budget and we will show you what it buys."
        />

        <ul class="mt-6 flex flex-col gap-3">
          <li v-for="point in points" :key="point" class="flex items-start gap-2.5 text-sm text-ink-soft">
            <AppIcon name="check" :size="18" class="mt-0.5 shrink-0 text-accent" />
            {{ point }}
          </li>
        </ul>

        <RouterLink to="/finance" class="btn-ghost mt-7">
          More about finance
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>

      <div class="card p-5 sm:p-7">
        <h3 class="font-display text-lg font-semibold">What could I borrow?</h3>

        <div class="mt-6">
          <div class="flex items-baseline justify-between gap-3">
            <label :for="budgetId" class="field-label mb-0">Monthly budget</label>
            <output :for="budgetId" class="font-display text-2xl font-semibold text-accent">
              {{ formatCurrency(monthly) }}
            </output>
          </div>
          <input
            :id="budgetId"
            v-model.number="monthly"
            type="range"
            min="75"
            max="400"
            step="5"
            class="mt-3"
          />
          <div class="mt-1.5 flex justify-between text-xs text-ink-muted">
            <span>{{ formatCurrency(75) }}</span>
            <span>{{ formatCurrency(400) }}</span>
          </div>
        </div>

        <div class="mt-6">
          <span class="field-label">Over how long?</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in termOptions"
              :key="option"
              type="button"
              class="term-btn"
              :class="{ 'is-active': term === option }"
              :aria-pressed="term === option"
              @click="term = option"
            >
              {{ option / 12 }} years
            </button>
          </div>
        </div>

        <div class="mt-7 rounded-panel bg-paper-sink p-5">
          <p class="text-sm text-ink-soft">You could borrow around</p>
          <p class="mt-1 font-display text-4xl font-semibold text-ink">
            {{ formatCurrency(borrowable) }}
          </p>
          <p class="mt-1.5 text-sm text-ink-soft">
            at {{ REPRESENTATIVE_APR }}% APR over {{ term / 12 }} years
          </p>

          <!-- Nothing at this budget: the button greys out rather than promising "0 cars". -->
          <RouterLink
            v-if="matching > 0"
            :to="{ name: 'vehicles', query: { maxMonthly: String(monthly) } }"
            class="btn-primary mt-5 w-full"
          >
            <AppIcon name="search" :size="17" />
            Show me {{ matching }} {{ matching === 1 ? 'car' : 'cars' }} I can afford
          </RouterLink>
          <button
            v-else
            type="button"
            disabled
            class="btn mt-5 w-full cursor-not-allowed border-line bg-line/60 !opacity-100 text-ink-muted"
          >
            <AppIcon name="search" :size="17" />
            No cars found at that budget
          </button>
        </div>

        <p class="u-legal mt-5">{{ calculatorDisclaimer }}</p>
        <p class="u-legal mt-2">{{ representativeExample }}</p>
        <p class="u-legal mt-2">{{ brokerDisclosure }} {{ lenderPanelDisclosure }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { RouterLink } from 'vue-router'
import {
  amountBorrowableFor,
  brokerDisclosure,
  calculatorDisclaimer,
  lenderPanelDisclosure,
  QUOTE_TERM_MONTHS,
  representativeExample,
  REPRESENTATIVE_APR,
} from '../../data/dealer'
import { countVehicles, formatCurrency } from '../../composables/useVehicleFilters'
import AppIcon from '../shared/AppIcon.vue'
import SectionHeading from '../shared/SectionHeading.vue'

const budgetId = useId()

const termOptions = [36, 48, 60]
const monthly = ref(200)
// Opens on the same term the cards' "from" figures use, so the amount shown
// here and the stock the CTA links to are quoted on the same basis.
const term = ref(QUOTE_TERM_MONTHS)

const points = [
  'A decision in principle in minutes, with no mark on your credit file.',
  'All credit histories considered, including missed payments and defaults.',
  'Hire Purchase and PCP available on most of our stock.',
]

/**
 * The amount of credit that budget buys, rounded down to the nearest £50 so the
 * headline figure is never more flattering than the arithmetic.
 */
const borrowable = computed(() =>
  Math.floor(amountBorrowableFor(monthly.value, term.value) / 50) * 50,
)

const matching = computed(() =>
  countVehicles({ priceMode: 'monthly', maxMonthly: monthly.value }),
)
</script>

<style scoped>
.term-btn {
  @apply rounded-control border border-line bg-paper-soft px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-ink/25 hover:text-ink;
}

.term-btn.is-active {
  @apply border-accent bg-accent-wash text-accent;
}
</style>
