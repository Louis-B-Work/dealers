<template>
  <div>
    <PageHeader
      title="Finance, arranged quietly"
      current="Finance"
      subtitle="Model your payments before you speak to anyone. There is no credit check and no obligation."
      :image="headerImage"
    />

    <div class="u-gutter space-y-24 py-16 lg:py-20">
      <FinanceCalculator />

      <section class="grid gap-12 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="options-title">
        <div>
          <h2 id="options-title" class="u-h2">Two common ways to own</h2>
          <p class="mt-5 max-w-md leading-relaxed text-ink-soft">
            A real finance specialist would explain which suits you, along with the lender’s terms, fees and any
            commission, before you decide.
          </p>
        </div>
        <ul class="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          <li v-for="option in options" :key="option.title" class="bg-paper p-8">
            <h3 class="font-display text-3xl">{{ option.title }}</h3>
            <p class="mt-4 leading-relaxed text-ink-soft">{{ option.text }}</p>
          </li>
        </ul>
      </section>

      <section class="rounded-panel border border-line p-8 sm:p-12" aria-labelledby="example-title">
        <h2 id="example-title" class="font-display text-3xl">The figures behind the numbers</h2>
        <p class="mt-5 max-w-3xl leading-relaxed text-ink-soft">{{ representativeExample }}</p>
        <p class="mt-4 text-sm text-ink-muted">{{ brokerDisclosure }} Finance is subject to status, age and affordability checks.</p>
      </section>

      <FaqList :faqs="faqs" />

      <div class="flex flex-col gap-6 border-t border-line pt-12 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="font-display text-4xl">Prefer to talk it through?</h2>
        <RouterLink :to="{ path: '/contact', query: { subject: 'Finance' } }" class="btn-accent">
          Discuss finance
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import FinanceCalculator from '../components/shared/FinanceCalculator.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { REPRESENTATIVE_APR, brokerDisclosure, representativeExample } from '../data/dealer'
import { getVehicleById } from '../data/vehicles'

const headerImage = getVehicleById('aston-db11-2022')?.image ?? ''

const options = [
  {
    title: 'Hire purchase',
    text: 'A deposit, then fixed monthly payments. Ownership normally passes to you once every payment and any option-to-purchase fee is settled.',
  },
  {
    title: 'Balloon payment',
    text: 'Lower monthly payments with a larger final payment, which you can pay, refinance or, depending on the agreement, avoid by returning the car.',
  },
]

const faqs = [
  { question: 'Is this a finance application?', answer: 'No. The calculator is a local illustration. It does not check eligibility, run a credit search or submit anything.' },
  { question: 'How are the figures calculated?', answer: `Each payment uses a representative ${REPRESENTATIVE_APR}% APR converted to an effective monthly rate, with equal monthly payments rounded to the nearest pound. It does not model balloon payments; a lender’s real figures may differ.` },
  { question: 'Can my current car form the deposit?', answer: 'In a real transaction an agreed part-exchange value, less any outstanding finance, could contribute. That would need a valuation and a settlement figure first.' },
  { question: 'Will asking about finance affect my credit file?', answer: 'Nothing on this preview touches your credit file. A real lender would explain whether a quotation uses a soft or hard search before running one.' },
]
</script>
