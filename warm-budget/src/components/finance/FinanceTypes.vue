<template>
  <section class="u-section border-y border-line bg-paper-sink/50">
    <div class="u-gutter flex flex-col gap-10">
      <SectionHeading
        title="HP or PCP: which suits you?"
        subtitle="Two common ways to pay for a car. Choose one to see how it works."
        center
      />

      <div class="mx-auto grid w-full max-w-md grid-cols-2 gap-1 rounded-full bg-paper-soft p-1 shadow-card" role="radiogroup" aria-label="Type of finance">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="financeType === opt.value"
          class="rounded-full px-4 py-3 text-sm font-semibold transition-colors duration-150"
          :class="financeType === opt.value ? 'bg-accent text-accent-ink' : 'text-ink-soft hover:text-ink'"
          @click="financeType = opt.value"
        >
          {{ opt.title }}
        </button>
      </div>

      <div class="mx-auto w-full max-w-4xl">
        <article :key="selected.value" class="card grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div>
            <h3 class="font-display text-3xl font-semibold text-ink">{{ selected.title }}</h3>
            <p class="mt-1 text-sm font-medium text-accent">{{ selected.full }}</p>
            <p class="mt-5 text-ink-soft">{{ selected.summary }}</p>
          </div>
          <ul class="flex flex-col gap-3">
            <li
              v-for="point in selected.points"
              :key="point"
              class="flex items-start gap-3 rounded-tile bg-paper-sink/70 p-4 text-sm text-ink-soft"
            >
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
                <AppIcon name="check" :size="14" />
              </span>
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
