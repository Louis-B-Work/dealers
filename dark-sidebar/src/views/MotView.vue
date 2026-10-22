<template>
  <div class="bg-paper">
    <PageHeader
      title="MOT & Service"
      subtitle="Keep your car road-legal and running well, with a friendly workshop team on hand."
    >
      <div class="flex flex-wrap gap-3 pt-2">
        <RouterLink :to="{ hash: '#book' }" class="btn-primary">
          Book now
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro: copy on the left, a call panel on the right -->
    <section class="border-b border-line">
      <div class="u-gutter grid w-full gap-8 py-14 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-20">
        <div class="flex flex-col gap-4" data-reveal>
          <h2 class="u-display text-[2.1rem] sm:text-[2.6rem]">Great value car servicing</h2>
          <p class="max-w-prose text-ink-soft">
            Our trained mechanics look after every make and model at competitive prices, and will
            happily answer any questions you have.
          </p>
        </div>
        <a :href="telHref" class="panel panel-hover group flex items-center justify-between gap-6 p-6" data-reveal data-reveal-delay="100">
          <div>
            <p class="text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted">Call for a service deal</p>
            <p class="mt-1 font-display text-2xl text-ink transition-colors group-hover:text-accent">{{ dealer.phone }}</p>
          </div>
          <AppIcon name="phone" :size="22" class="text-accent" />
        </a>
      </div>
    </section>

    <!-- service levels: a side-by-side comparison on one shared hairline grid -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading title="Choose your service" subtitle="Two levels of service, each following your manufacturer’s schedule." />

        <div class="panel grid divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0" data-reveal>
          <article v-for="service in services" :key="service.title" class="flex flex-col gap-6 p-6 md:p-10">
            <div class="flex items-center justify-between gap-4">
              <h3 class="font-display text-2xl text-ink">{{ service.title }}</h3>
              <span class="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-accent">
                <AppIcon :name="service.icon" :size="20" />
              </span>
            </div>
            <p class="text-ink-soft">{{ service.body }}</p>
            <ul class="flex flex-col divide-y divide-line border-y border-line text-sm">
              <li v-for="point in service.points" :key="point" class="flex items-start gap-3 py-3.5">
                <AppIcon name="check" :size="15" class="mt-0.5 shrink-0 text-accent" />
                <span class="text-ink-soft">{{ point }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- booking: how it works beside the form -->
    <section id="book" class="bg-paper py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div class="flex flex-col gap-8">
          <SectionHeading
            title="Book your MOT, service or repair"
            subtitle="Send us your details and we’ll get back to you to arrange a date."
          />
          <ol class="flex flex-col divide-y divide-line border-y border-line" data-reveal data-reveal-delay="120">
            <li v-for="step in steps" :key="step.title" class="flex flex-col gap-1 py-4">
              <span class="font-display text-lg text-ink">{{ step.title }}</span>
              <span class="text-sm text-ink-soft">{{ step.body }}</span>
            </li>
          </ol>
        </div>

        <div data-reveal>
          <ServiceEnquiry
            :types="['Service request', 'Repair', 'MOT test']"
            show-reg
            message-label="Anything we should know?"
          />
        </div>
      </div>
    </section>

    <!-- faq -->
    <section class="u-rule bg-paper-soft py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading title="MOT questions answered" />
        </div>
        <FaqList :faqs="faqs" />
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'

useScrollReveal()

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

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

const steps = [
  { title: 'Tell us what you need', body: 'Choose an MOT, service or repair and add your car’s details.' },
  { title: 'We get back to you', body: 'Our team replies during opening hours to agree a date.' },
  { title: 'Drop the car in', body: 'We carry out the work and keep you updated.' },
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
