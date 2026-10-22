<template>
  <section class="border-y border-line bg-paper-soft py-20 md:py-28">
    <div class="container flex flex-col gap-12">
      <SectionHeading
        title="HP or PCP: which suits you?"
        subtitle="Two common ways to pay for a car. Choose one to see how it works."
        center
      />

      <div class="mx-auto grid w-full max-w-4xl grid-cols-2 gap-1 rounded-control bg-paper-sink p-1" role="radiogroup" aria-label="Type of finance">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="financeType === opt.value"
          class="rounded-control px-4 py-3 text-sm font-semibold transition"
          :class="financeType === opt.value ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'"
          @click="financeType = opt.value"
        >
          {{ opt.title }}
        </button>
      </div>

      <!-- Static-class reveal wrapper: swapping the card inside it can't strip `is-revealed`. -->
      <div class="mx-auto w-full max-w-4xl" data-reveal>
        <article
          :key="selected.value"
          class="flex flex-col gap-5 rounded-panel border border-accent bg-white p-6 shadow-soft md:p-8"
        >
          <div>
            <h3 class="font-display text-2xl text-ink">{{ selected.title }}</h3>
            <p class="text-sm text-ink-muted">{{ selected.full }}</p>
          </div>
          <p class="text-ink-soft">{{ selected.summary }}</p>
          <ul class="grid gap-3 text-sm md:grid-cols-2">
            <li v-for="point in selected.points" :key="point" class="flex items-start gap-3">
              <AppIcon name="check" :size="18" class="mt-0.5 shrink-0 text-accent" />
              <span class="text-ink-soft">{{ point }}</span>
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
