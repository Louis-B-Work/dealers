<template>
  <div>
    <FinanceHero />
    <FinanceCalculator />

    <!-- finance disclosure -->
    <section class="bg-paper pb-12">
      <div class="container">
        <p class="mx-auto max-w-prose text-center text-xs text-ink-muted">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <FinanceTypes />
    <EligibilityCta />

    <!-- faq -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="Finance questions answered" center />
        <div class="mx-auto w-full max-w-3xl">
          <FaqList :faqs="faqs" />
        </div>
      </div>
    </section>

    <SellContact />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { brokerDisclosure, representativeExample } from '../data/dealer'
import FinanceHero from '../components/finance/FinanceHero.vue'
import FinanceCalculator from '../components/finance/FinanceCalculator.vue'
import FinanceTypes from '../components/finance/FinanceTypes.vue'
import EligibilityCta from '../components/finance/EligibilityCta.vue'
import SellContact from '../components/shared/SellContact.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import FaqList from '../components/shared/FaqList.vue'

useScrollReveal()

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
