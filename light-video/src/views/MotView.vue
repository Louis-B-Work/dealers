<template>
  <div>
    <PageHero
      title="MOT & Service"
      intro="Keep your car road-legal and running well, with a friendly workshop team on hand."
    >
      <div class="flex flex-wrap justify-center gap-4" data-intro>
        <RouterLink :to="{ hash: '#book' }" class="btn-accent">
          Book now
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="btn inline-flex border border-white/25 text-white hover:border-white"
        >
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHero>

    <!-- intro -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col items-center gap-6 text-center">
        <SectionHeading
          title="Great value car servicing"
          subtitle="Our trained mechanics look after every make and model at competitive prices, and will happily answer any questions you have."
          center
        />
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="btn-ghost"
          data-reveal
          data-reveal-delay="120"
        >
          Call for a service deal
        </a>
      </div>
    </section>

    <!-- service levels -->
    <section class="border-y border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="Choose your service" center />

        <div class="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
          <article
            v-for="(service, i) in services"
            :key="service.title"
            class="flex flex-col gap-5 rounded-panel border border-line bg-white p-6 shadow-soft md:p-8"
            data-reveal
            :data-reveal-delay="i * 90"
          >
            <div class="flex items-center gap-4">
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
              >
                <AppIcon :name="service.icon" :size="22" />
              </span>
              <h3 class="font-display text-xl text-ink">{{ service.title }}</h3>
            </div>
            <p class="text-ink-soft">{{ service.body }}</p>
            <ul class="flex flex-col gap-3 text-sm">
              <li v-for="point in service.points" :key="point" class="flex items-start gap-3">
                <AppIcon name="check" :size="18" class="mt-0.5 shrink-0 text-accent" />
                <span class="text-ink-soft">{{ point }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- booking -->
    <section id="book" class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading
          title="Book your MOT, service or repair"
          subtitle="Send us your details and we’ll get back to you to arrange a date."
          center
        />
        <div class="mx-auto w-full max-w-3xl" data-reveal>
          <ServiceEnquiry
            :types="['Service request', 'Repair', 'MOT test']"
            show-reg
            message-label="Anything we should know?"
          />
        </div>
      </div>
    </section>

    <!-- faq -->
    <section class="border-t border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="MOT questions answered" center />
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
import { dealer } from '../data/dealer'
import PageHero from '../components/shared/PageHero.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import SellContact from '../components/shared/SellContact.vue'

useScrollReveal()

const services = [
  {
    icon: 'gauge',
    title: 'Interim service',
    body: 'A regular check that keeps your car running efficiently and can help avoid costly repairs, ideal if you cover a lot of miles.',
    points: [
      'Recommended every 6 months or 6,000 miles',
      'Helps extend the life of your car and protect its resale value',
      'Check your manufacturer’s handbook for the right interval',
    ],
  },
  {
    icon: 'shield',
    title: 'Full service',
    body: 'Everything in an interim service, plus extra safety and wear checks for complete peace of mind.',
    points: [
      'Most cars need one at least once a year',
      'More thorough inspection of key components',
      'Follows your manufacturer’s service schedule',
    ],
  },
]

const faqs = [
  {
    question: 'When should I get an MOT?',
    answer:
      'Your car needs its first MOT by the third anniversary of its registration, then every year after that. Driving without a valid MOT can lead to a fine of up to £1,000.',
  },
  {
    question: 'What’s the earliest I can get an MOT?',
    answer:
      'You can book up to a month (minus a day) before your current MOT expires and keep the same renewal date.',
  },
  {
    question: 'My MOT has run out. What can I do?',
    answer:
      'You can’t drive on the road without a valid MOT, except to a pre-booked MOT test or to a place where repairs are being made. Book as soon as you can.',
  },
  {
    question: 'How does an MOT work?',
    answer:
      'The tester checks key parts of your car against legal standards for safety and emissions. The engine, clutch and gearbox condition aren’t covered by the test.',
  },
  {
    question: 'What happens if my car fails?',
    answer:
      'You’ll get a list of the defects. You can’t drive the car away unless the old MOT is still valid, except to have the repairs made or to a pre-booked retest. We can carry out the work for you.',
  },
  {
    question: 'Is my vehicle exempt from an MOT?',
    answer:
      'Some vehicles are exempt, such as those not yet due their first test and some vehicles made before 1960. Check gov.uk to see whether yours is.',
  },
]
</script>
