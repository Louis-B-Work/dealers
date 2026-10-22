<template>
  <div class="bg-paper pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-5 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>MOT &amp; Service</h1>
        <p class="max-w-prose text-ink-soft sm:text-lg" data-intro>
          Keep your car road-legal and running well, with a friendly workshop team on hand.
        </p>
        <div class="flex flex-wrap gap-3" data-intro>
          <RouterLink :to="{ hash: '#book' }" class="btn-accent">
            Book now
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <a :href="telHref" class="btn-ghost">
            <AppIcon name="phone" :size="16" />
            {{ dealer.phone }}
          </a>
        </div>
      </div>
    </div>

    <!-- intro + services as one bento -->
    <section class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading
          title="Great value car servicing"
          subtitle="Our trained mechanics look after every make and model at competitive prices, and will happily answer any questions you have."
          center
        />

        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="(service, i) in services"
            :key="service.title"
            class="flex flex-col gap-5 rounded-panel p-7 md:col-span-1"
            :class="i === 0 ? 'bg-accent text-accent-ink' : 'border border-line bg-surface text-ink shadow-soft'"
            data-reveal
            :data-reveal-delay="i * 80"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-control"
              :class="i === 0 ? 'bg-white/15' : 'bg-paper-sink text-accent'"
            >
              <AppIcon :name="service.icon" :size="22" />
            </span>
            <h3 class="font-display text-2xl font-extrabold">{{ service.title }}</h3>
            <p :class="i === 0 ? 'text-accent-ink/85' : 'text-ink-soft'">{{ service.body }}</p>
            <ul class="mt-auto flex flex-col gap-2.5 text-sm">
              <li v-for="point in service.points" :key="point" class="flex items-start gap-2.5">
                <AppIcon name="check" :size="16" class="mt-0.5 shrink-0" />
                {{ point }}
              </li>
            </ul>
          </article>

          <a
            :href="telHref"
            class="card-hover flex flex-col justify-between gap-8 rounded-panel bg-ink p-7 text-paper"
            data-reveal
            data-reveal-delay="160"
          >
            <AppIcon name="phone" :size="28" />
            <div>
              <p class="text-xs font-bold uppercase tracking-micro text-paper/60">Call for a service deal</p>
              <p class="font-display text-3xl font-extrabold">{{ dealer.phone }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- booking -->
    <section id="book" class="border-y border-line bg-paper-soft py-16 md:py-24">
      <div class="container flex flex-col gap-10">
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
    <section class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading title="MOT questions answered" center />
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
    icon: 'gear',
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
