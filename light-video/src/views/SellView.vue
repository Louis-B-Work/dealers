<template>
  <div>
    <SellHero />
    <SellSteps />
    <Reviews />
    <FeaturedVehicles />

    <!-- finance disclosure -->
    <section class="bg-paper pb-8">
      <div class="container">
        <p class="mx-auto max-w-prose text-center text-xs text-ink-muted">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <!-- faq -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="Frequently asked questions" center />
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
import SellHero from '../components/sell/SellHero.vue'
import SellSteps from '../components/sell/SellSteps.vue'
import SellContact from '../components/shared/SellContact.vue'
import Reviews from '../components/home/Reviews.vue'
import FeaturedVehicles from '../components/home/FeaturedVehicles.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import FaqList from '../components/shared/FaqList.vue'

useScrollReveal()

const faqs = [
  {
    question: 'Can I sell my car with outstanding finance?',
    answer:
      'Yes. Ask your lender for a settlement figure and we will take care of paying it off as part of the deal. If your car is worth more than you owe, the difference goes towards your next car or to you.',
  },
  {
    question: 'Who do I need to tell that I’ve sold my car?',
    answer:
      'The DVLA needs to know the car has changed hands. We will help you complete the V5C notification, and you should also let your insurer know once the sale is done.',
  },
  {
    question: 'What documents are needed to part-exchange my car?',
    answer:
      'Bring your V5C logbook, photo ID, proof of address, the service history and all keys. If the car is on finance, bring your settlement figure from the lender too.',
  },
]
</script>
