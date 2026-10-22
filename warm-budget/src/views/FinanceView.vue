<template>
  <div class="bg-paper">
    <PageHeader
      title="Finance your vehicle"
      subtitle="See your monthly payment, compare HP and PCP, and check your eligibility in minutes."
    >
      <div class="mt-7 flex flex-wrap gap-3">
        <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-primary">
          Check eligibility
          <AppIcon name="arrow" :size="16" />
        </a>
        <RouterLink :to="{ hash: '#calculator' }" class="btn-on-dark">Use the calculator</RouterLink>
      </div>
    </PageHeader>

    <FinanceCalculator />

    <!-- finance disclosure -->
    <section class="pb-12">
      <div class="u-gutter">
        <p class="u-legal mx-auto max-w-prose text-center">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <FinanceTypes />
    <EligibilityCta />

    <!-- faq -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="Finance questions answered" center />
        <div class="mx-auto w-full max-w-3xl">
          <FaqList :faqs="faqs" />
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { ELIGIBILITY_URL, brokerDisclosure, representativeExample } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'
import FinanceCalculator from '../components/finance/FinanceCalculator.vue'
import FinanceTypes from '../components/finance/FinanceTypes.vue'
import EligibilityCta from '../components/finance/EligibilityCta.vue'

const faqs = [
  {
    question: 'What’s the difference between HP and PCP?',
    answer:
      'With HP you pay off the full value of the car and own it at the end. With PCP your monthly payments are lower because you only pay for the part of the value you use, then choose to return the car, pay the final payment to keep it, or part-exchange it.',
  },
  {
    question: 'Do I need a deposit?',
    answer:
      'Not always. A deposit lowers your monthly payments and the total you borrow, and requirements vary by lender and type of finance.',
  },
  {
    question: 'Can I get finance with a poor credit history?',
    answer:
      'Possibly. Lenders look at your income, outgoings and credit history, so checking your eligibility first shows where you stand without a hard search.',
  },
  {
    question: 'Will checking my eligibility affect my credit score?',
    answer:
      'No. An eligibility check is a soft search and is not visible to other lenders. Applying for finance runs a hard search, which can affect your score.',
  },
  {
    question: 'Can I use my current car as a deposit?',
    answer:
      'Yes. If you part-exchange your car, its value, less any outstanding finance, can go towards your deposit. Get a free valuation on our Sell Your Car page.',
  },
  {
    question: 'Can I pay off my finance early?',
    answer:
      'Usually yes. You can ask your lender for a settlement figure at any time, and early repayment may reduce the interest you pay. Check your agreement for any charges.',
  },
]
</script>
