<template>
  <div class="bg-paper">
    <PageHeader title="Warranty" subtitle="Drive away with added peace of mind on your next used car.">
      <div class="mt-7 flex flex-wrap gap-3">
        <RouterLink to="/contact" class="btn-primary">
          Ask our team
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-on-dark">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- confidence: a warm highlight card -->
    <section class="u-section">
      <div class="u-gutter">
        <div class="grid items-center gap-8 rounded-block bg-highlight-wash px-6 py-10 sm:px-12 md:py-14 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div class="flex items-center gap-5">
            <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/70 text-highlight-ink">
              <AppIcon name="shield" :size="30" />
            </span>
            <h2 class="u-display text-[1.65rem] !text-highlight-ink sm:text-[2rem]">Buy with confidence</h2>
          </div>
          <div class="flex flex-col gap-4 text-highlight-ink/85">
            <p>
              Buying a used car can feel daunting. Many of our cars include a warranty, and every one goes through
              extensive checks before it reaches the forecourt.
            </p>
            <p>
              We work with a trusted warranty provider, and our team will explain exactly what is covered on the
              car you choose before you decide.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- what is covered -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading
          title="What a warranty can cover"
          subtitle="Packages vary by car and level of cover. They are designed to help with the cost of unexpected faults."
          center
        />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="item in covers" :key="item.title" class="card flex flex-col gap-4 p-6">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-accent-wash text-accent">
              <AppIcon :name="item.icon" :size="22" />
            </span>
            <h3 class="font-display text-lg font-semibold text-ink">{{ item.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ item.body }}</p>
          </li>
        </ul>

        <p class="u-legal mx-auto max-w-prose text-center">
          Cover, terms and limits depend on the package and the car, and are confirmed before you buy.
        </p>
      </div>
    </section>

    <!-- extended cover -->
    <section class="u-section">
      <div class="u-gutter">
        <div class="grid gap-8 rounded-block bg-paper-dark px-6 py-12 text-ink-inverse sm:px-12 md:py-16 lg:grid-cols-2 lg:gap-14">
          <div class="flex flex-col items-start gap-5">
            <h2 class="u-display text-[1.65rem] !text-ink-inverse sm:text-[2rem] md:text-[2.35rem]">Extended cover</h2>
            <p class="text-ink-inverse/80">
              Want longer protection? Extra warranty options may be available on selected vehicles. Our team will
              talk you through the levels of cover, what is included and what each one costs, so you can choose what
              suits you and your budget.
            </p>
            <RouterLink to="/contact" class="btn-primary mt-1">
              Ask about extended cover
              <AppIcon name="arrow" :size="16" />
            </RouterLink>
          </div>
          <ul class="flex flex-col gap-3 self-center">
            <li
              v-for="point in extended"
              :key="point"
              class="flex items-center gap-3 rounded-tile bg-white/10 px-4 py-3.5 text-sm"
            >
              <AppIcon name="check" :size="16" class="shrink-0 text-accent-soft" />
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- faq -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="Warranty questions answered" center />
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
import ContactPanel from '../components/shared/ContactPanel.vue'

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const covers = [
  { icon: 'gear', title: 'Mechanical faults', body: 'Help with the cost of repairing key mechanical parts such as the engine and gearbox.' },
  { icon: 'key', title: 'Electrical faults', body: 'Cover for many electrical components, so a sudden fault doesn’t become a surprise bill.' },
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
