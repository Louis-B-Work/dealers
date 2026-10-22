<template>
  <section class="border-t border-line bg-paper-soft py-20 md:py-28">
    <div class="u-gutter flex w-full flex-col gap-14">
      <SectionHeading
        title="HP or PCP: which suits you?"
        subtitle="Two common ways to pay for a car. Choose one to see how it works."
        center
      />

      <div class="mx-auto flex gap-14" role="radiogroup" aria-label="Type of finance">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="financeType === opt.value"
          class="tab"
          :class="{ 'is-selected': financeType === opt.value }"
          @click="financeType = opt.value"
        >
          {{ opt.title }}
        </button>
      </div>

      <!-- Static-class reveal wrapper: swapping the content inside it can't strip `is-revealed`. -->
      <div class="mx-auto w-full max-w-5xl" data-reveal>
        <article :key="selected.value" class="grid gap-10 border-y border-ink py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h3 class="u-display text-4xl">{{ selected.title }}</h3>
            <p class="mt-3 text-[0.62rem] uppercase tracking-micro text-ink-muted">{{ selected.full }}</p>
            <p class="mt-8 max-w-prose text-ink-soft">{{ selected.summary }}</p>
          </div>
          <ul class="flex flex-col border-t border-line self-start">
            <li v-for="point in selected.points" :key="point" class="flex items-start gap-4 border-b border-line py-4 text-sm text-ink-soft">
              <AppIcon name="check" :size="14" class="mt-0.5 shrink-0 text-ink" />
              {{ point }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFinanceType, type FinanceType } from '../../composables/useFinanceType'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const { financeType } = useFinanceType()

const options: {
  value: FinanceType
  title: string
  full: string
  summary: string
  points: string[]
}[] = [
  {
    value: 'hp',
    title: 'HP',
    full: 'Hire purchase',
    summary:
      'Pay off the full cost of the car in fixed monthly instalments. Once the last payment is made, the car is yours.',
    points: [
      'Higher monthly payments, because you pay for the whole car',
      'You own the car outright at the end of the agreement',
      'No mileage limits or return conditions',
      'Best if you plan to keep the car for the long term',
    ],
  },
  {
    value: 'pcp',
    title: 'PCP',
    full: 'Personal contract purchase',
    summary:
      'Pay for the part of the car’s value you use, with lower monthly payments and an optional final payment at the end.',
    points: [
      'Lower monthly payments than HP',
      'At the end: return the car, pay the final payment to keep it, or part-exchange',
      'Mileage limit applies, and excess mileage or damage charges may be due',
      'Best if you like to change your car every few years',
    ],
  },
]

const selected = computed(() => options.find((o) => o.value === financeType.value) ?? options[0])
</script>

<style scoped>
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
</style>
