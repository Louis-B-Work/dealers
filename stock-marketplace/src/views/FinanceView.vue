<template>
  <div>
    <PageHeader
      title="Finance, explained"
      current="Finance"
      eyebrow="Finance"
      subtitle="Work out a comfortable monthly payment before you choose a car. There is no credit check and no obligation."
    />

    <div class="u-gutter space-y-10 py-10">
      <FinanceCalculator />

      <div class="grid gap-6 lg:grid-cols-2">
        <BudgetEstimator target="vehicles" />
        <div class="panel p-6 sm:p-8">
          <p class="u-eyebrow">Representative example</p>
          <h2 class="u-h2 mt-2">The figures behind the numbers</h2>
          <p class="mt-4 text-sm leading-relaxed text-ink-soft">{{ representativeExample }}</p>
          <p class="mt-4 text-sm text-ink-soft">{{ brokerDisclosure }} Finance is subject to status, age and affordability checks.</p>
        </div>
      </div>

      <section aria-labelledby="how-title">
        <h2 id="how-title" class="u-h2 mb-6">How it works</h2>
        <ol class="grid gap-5 md:grid-cols-3">
          <li v-for="(step, index) in steps" :key="step.title" class="panel p-6">
            <span class="tabular text-3xl font-bold text-accent">0{{ index + 1 }}</span>
            <h3 class="mt-4 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-ink-soft">{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <FaqList :faqs="faqs" />

      <div class="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 class="u-h2">Talk it through with the team</h2>
          <p class="mt-2 text-sm text-ink-soft">Preview the enquiry flow. No application or credit check will be made.</p>
        </div>
        <RouterLink :to="{ path: '/contact', query: { subject: 'Finance' } }" class="btn-accent shrink-0">
          Ask about finance
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import BudgetEstimator from '../components/shared/BudgetEstimator.vue'
import FaqList from '../components/shared/FaqList.vue'
import FinanceCalculator from '../components/shared/FinanceCalculator.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { REPRESENTATIVE_APR, brokerDisclosure, representativeExample } from '../data/dealer'

const steps = [
  { title: 'Set your budget', text: 'Start with a monthly figure you are comfortable with, leaving room for insurance, tax and servicing.' },
  { title: 'Compare the options', text: 'Switch the stock to monthly prices, or use the calculator to see how deposit and term change the payment.' },
  { title: 'Check the agreement', text: 'In a live dealership, a finance specialist would explain the lender’s terms, fees and any commission before you decide.' },
]

const faqs = [
  { question: 'Is this a finance application?', answer: 'No. The calculators are a local illustration only. They do not check eligibility, run a credit search or submit anything.' },
  { question: 'How are the figures calculated?', answer: `Each payment uses a representative ${REPRESENTATIVE_APR}% APR converted to an effective monthly rate, with equal monthly payments rounded to the nearest pound. A real lender may use different terms, fees and a final payment.` },
  { question: 'What is hire purchase?', answer: 'You usually pay a deposit and fixed monthly instalments. Ownership normally passes once all payments and any option-to-purchase fee are settled. Always read the lender’s agreement.' },
  { question: 'Can my current car count towards the deposit?', answer: 'In a real transaction an agreed part-exchange value, less any outstanding finance, could contribute. That would need a valuation and a settlement figure first.' },
]
</script>
