<template>
  <section class="border-y border-line bg-paper-soft py-16 md:py-24">
    <div class="container flex flex-col gap-10">
      <SectionHeading
        title="HP or PCP: which suits you?"
        subtitle="Two common ways to pay for a car. Choose one to see how it works."
        center
      />

      <div class="mx-auto grid w-full max-w-sm grid-cols-2 gap-1 rounded-full bg-surface p-1 shadow-soft" role="radiogroup" aria-label="Type of finance">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="financeType === opt.value"
          class="rounded-full px-4 py-3 text-sm font-extrabold transition duration-300"
          :class="financeType === opt.value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'"
          @click="financeType = opt.value"
        >
          {{ opt.title }}
        </button>
      </div>

      <!-- Static-class reveal wrapper: swapping the tiles inside it can't strip `is-revealed`. -->
      <div class="mx-auto w-full max-w-5xl" data-reveal>
        <div :key="selected.value" class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col justify-between gap-6 rounded-panel bg-accent p-7 text-accent-ink md:row-span-2">
            <div>
              <h3 class="font-display text-5xl font-extrabold">{{ selected.title }}</h3>
              <p class="mt-1 text-sm font-bold uppercase tracking-micro text-accent-ink/70">{{ selected.full }}</p>
            </div>
            <p class="text-lg leading-relaxed text-accent-ink/90">{{ selected.summary }}</p>
          </div>

          <div
            v-for="(point, i) in selected.points"
            :key="point"
            class="flex items-start gap-3 rounded-panel border border-line bg-surface p-5 shadow-soft"
            :class="i === 0 ? 'md:bg-paper-sink' : ''"
          >
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-sink text-accent">
              <AppIcon name="check" :size="16" />
            </span>
            <p class="text-sm font-semibold leading-relaxed text-ink">{{ point }}</p>
          </div>
        </div>
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
