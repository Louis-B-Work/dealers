<template>
  <div class="bg-paper">
    <PageHeader
      title="MOT & Service"
      subtitle="Keep your car road-legal and running well, with a friendly workshop team on hand."
    >
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <RouterLink :to="{ hash: '#book' }" class="btn-primary">
          Book now
          <AppIcon name="arrow" :size="14" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="14" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro: one considered paragraph -->
    <section class="py-24 md:py-32">
      <div class="u-gutter w-full">
        <p
          class="u-display mx-auto max-w-4xl text-center text-[1.5rem] leading-[1.4] sm:text-[1.9rem] md:text-[2.2rem]"
          data-reveal
        >
          Great value servicing for every make and model, from trained mechanics who will happily answer
          your questions.
        </p>
      </div>
    </section>

    <!-- the two services, set as facing columns -->
    <section class="border-t border-line py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading title="Choose your service" center />

        <div class="grid border-y border-ink md:grid-cols-2 md:divide-x md:divide-line">
          <article
            v-for="(service, i) in services"
            :key="service.title"
            class="flex flex-col gap-8 border-b border-line px-0 py-12 last:border-b-0 md:border-b-0 md:px-12 md:py-14"
            data-reveal
            :data-reveal-delay="i * 90"
          >
            <div>
              <h3 class="u-display text-3xl">{{ service.title }}</h3>
              <p class="mt-5 max-w-prose text-ink-soft">{{ service.body }}</p>
            </div>
            <ul class="flex flex-col border-t border-line">
              <li
                v-for="point in service.points"
                :key="point"
                class="flex items-start gap-4 border-b border-line py-4 text-sm text-ink-soft"
              >
                <AppIcon name="check" :size="14" class="mt-0.5 shrink-0 text-ink" />
                {{ point }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- booking -->
    <section id="book" class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading
          title="Book your MOT, service or repair"
          subtitle="Send us your details and we’ll get back to you to arrange a date."
          center
        />
        <div class="mx-auto w-full max-w-4xl" data-reveal>
          <ServiceEnquiry
            :types="['Service request', 'Repair', 'MOT test']"
            show-reg
            message-label="Anything we should know?"
          />
        </div>
      </div>
    </section>

    <!-- faq -->
    <section class="py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
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
    title: 'Interim service',
    body: 'A regular check that keeps your car running efficiently and can help avoid costly repairs, ideal if you cover a lot of miles.',
    points: [
      'Recommended every 6 months or 6,000 miles',
      'Helps extend the life of your car and protect its resale value',
      'Check your manufacturer’s handbook for the right interval',
    ],
  },
  {
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
