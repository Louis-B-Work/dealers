<template>
  <div class="bg-paper">
    <PageHeader
      title="MOT & Service"
      subtitle="Keep your car road-legal and running well, with a friendly workshop team on hand."
    >
      <div class="mt-7 flex flex-wrap gap-3">
        <RouterLink :to="{ hash: '#book' }" class="btn-primary">
          Book now
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-on-dark">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro -->
    <section class="u-section">
      <div class="u-gutter grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div>
          <h2 class="u-display text-[1.65rem] sm:text-[2rem] md:text-[2.35rem]">Great value car servicing</h2>
          <p class="u-lead mt-4 max-w-prose">
            Our trained mechanics look after every make and model at competitive prices, and will happily answer
            any questions you have, not just on the cars we sell.
          </p>
        </div>
        <a :href="telHref" class="card card-hover flex items-center gap-4 p-6">
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
            <AppIcon name="phone" :size="24" />
          </span>
          <div>
            <p class="text-sm font-semibold text-ink-soft">Call for a service deal</p>
            <p class="font-display text-xl font-semibold text-ink">{{ dealer.phone }}</p>
          </div>
        </a>
      </div>
    </section>

    <!-- the two services -->
    <section class="u-section border-y border-line bg-paper-sink/50">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="Choose your service" center />

        <div class="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-2">
          <article v-for="service in services" :key="service.title" class="card flex flex-col gap-5 p-6 md:p-8">
            <div class="flex items-center gap-4">
              <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
                <AppIcon :name="service.icon" :size="24" />
              </span>
              <h3 class="font-display text-xl font-semibold text-ink">{{ service.title }}</h3>
            </div>
            <p class="text-ink-soft">{{ service.body }}</p>
            <ul class="flex flex-col gap-2.5">
              <li
                v-for="point in service.points"
                :key="point"
                class="flex items-start gap-3 rounded-tile bg-paper-sink/70 p-3.5 text-sm text-ink-soft"
              >
                <AppIcon name="check" :size="16" class="mt-0.5 shrink-0 text-accent" />
                {{ point }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- booking -->
    <section id="book" class="u-section">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading
          title="Book your MOT, service or repair"
          subtitle="Send us your details and we’ll get back to you to arrange a date."
          center
        />
        <div class="mx-auto w-full max-w-3xl">
          <ServiceEnquiry
            :types="['Service request', 'Repair', 'MOT test']"
            show-reg
            message-label="Anything we should know?"
          />
        </div>
      </div>
    </section>

    <!-- faq -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="MOT questions answered" center />
        <div class="mx-auto w-full max-w-3xl">
          <FaqList :faqs="faqs" />
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'

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
    icon: 'spanner',
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
