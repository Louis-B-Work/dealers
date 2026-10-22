<template>
  <div class="bg-paper pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-5 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>Warranty</h1>
        <p class="max-w-prose text-ink-soft sm:text-lg" data-intro>
          Drive away with added peace of mind on your next used car.
        </p>
        <div class="flex flex-wrap gap-3" data-intro>
          <RouterLink to="/contact" class="btn-accent">
            Ask our team
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <a :href="telHref" class="btn-ghost">
            <AppIcon name="phone" :size="16" />
            {{ dealer.phone }}
          </a>
        </div>
      </div>
    </div>

    <!-- confidence + cover: one bento -->
    <section class="py-16 md:py-24">
      <div class="container grid gap-4 lg:grid-cols-3">
        <div
          class="flex flex-col justify-between gap-8 rounded-panel bg-accent p-8 text-accent-ink lg:row-span-2"
          data-reveal
        >
          <AppIcon name="shield" :size="34" />
          <div class="flex flex-col gap-4">
            <h2 class="u-display text-3xl !text-accent-ink sm:text-4xl">Buy with confidence</h2>
            <p class="text-accent-ink/85">
              Buying a used car can feel daunting. Many of our cars include a warranty, and every one goes through
              extensive checks before it reaches the forecourt.
            </p>
            <p class="text-accent-ink/85">
              We work with a trusted warranty provider, and our team will explain exactly what is covered on the car
              you choose before you decide.
            </p>
          </div>
        </div>

        <div
          v-for="(item, i) in covers"
          :key="item.title"
          class="flex flex-col gap-3 rounded-panel border border-line p-6 shadow-soft"
          :class="i === 3 ? 'bg-paper-sink' : 'bg-surface'"
          data-reveal
          :data-reveal-delay="(i + 1) * 70"
        >
          <span class="flex h-11 w-11 items-center justify-center rounded-control bg-paper-soft text-accent">
            <AppIcon :name="item.icon" :size="20" />
          </span>
          <h3 class="font-display text-lg font-extrabold text-ink">{{ item.title }}</h3>
          <p class="text-sm leading-relaxed text-ink-soft">{{ item.body }}</p>
        </div>
      </div>
      <p class="container mt-6 text-center text-xs text-ink-muted">
        Cover, terms and limits depend on the package and the car, and are confirmed before you buy.
      </p>
    </section>

    <!-- extended cover -->
    <section class="border-y border-line bg-paper-soft py-16 md:py-24">
      <div class="container grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col items-start gap-5 rounded-panel bg-ink p-8 text-paper" data-reveal>
          <h2 class="u-display text-3xl !text-paper sm:text-4xl">Extended cover</h2>
          <p class="text-paper/80">
            Want longer protection? Extra warranty options may be available on selected vehicles. Our team will talk
            you through the levels of cover, what is included and what each one costs, so you can choose what suits
            you and your budget.
          </p>
          <RouterLink to="/contact" class="btn-accent mt-2">
            Ask about extended cover
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </div>

        <ul class="grid gap-3 sm:grid-cols-2">
          <li
            v-for="(point, i) in extended"
            :key="point"
            class="flex items-start gap-3 rounded-panel border border-line bg-surface p-5 shadow-soft"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-sink text-accent">
              <AppIcon name="check" :size="16" />
            </span>
            <span class="text-sm font-semibold text-ink">{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- faq -->
    <section class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading title="Warranty questions answered" center />
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
import ContactPanel from '../components/shared/ContactPanel.vue'

useScrollReveal()

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const covers = [
  { icon: 'gear', title: 'Mechanical faults', body: 'Help with the cost of repairing key mechanical parts such as the engine and gearbox.' },
  { icon: 'spark', title: 'Electrical faults', body: 'Cover for many electrical components, so a sudden fault doesn’t become a surprise bill.' },
  { icon: 'shield', title: 'Peace of mind', body: 'Know that help is available if something goes wrong after you drive away.' },
  { icon: 'tag', title: 'Clear terms', body: 'We explain what’s included and any limits before you buy, with nothing hidden.' },
]

const extended = [
  'Longer protection on selected vehicles',
  'Different levels of cover to suit your budget',
  'A clear explanation of what is and isn’t included',
  'Honest, no-pressure advice from our team',
]

const faqs = [
  {
    question: 'Does my car come with a warranty?',
    answer:
      'Many of our cars include a warranty. Ask our team about the car you’re interested in and we’ll confirm exactly what is covered.',
  },
  {
    question: 'What does a warranty usually cover?',
    answer:
      'Warranties generally help with the cost of unexpected mechanical and electrical faults. The cover, limits and exclusions depend on the package and the car.',
  },
  {
    question: 'Does a warranty cover servicing and wear and tear?',
    answer:
      'Usually not. Routine servicing, MOT costs and parts that wear out through normal use, such as tyres and brake pads, are typically excluded.',
  },
  {
    question: 'Can I extend my warranty?',
    answer:
      'Extra warranty options may be available on selected vehicles. Speak to the team for the cover levels and prices.',
  },
  {
    question: 'How do I make a claim?',
    answer:
      'Contact us or the warranty provider as soon as a fault appears and before any repair work begins. We’ll guide you through the steps.',
  },
]
</script>
