<template>
  <div class="bg-paper">
    <PageHeader title="Warranty" subtitle="Drive away with added peace of mind on your next used car.">
      <div class="flex flex-wrap gap-3 pt-2">
        <RouterLink to="/contact" class="btn-primary">
          Ask our team
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- confidence: heading left, copy right -->
    <section class="border-b border-line">
      <div class="u-gutter grid w-full items-center gap-8 py-14 md:py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="u-display text-[2.1rem] sm:text-[2.6rem]" data-reveal>Buy with confidence</h2>
        <div class="flex flex-col gap-4 text-ink-soft" data-reveal data-reveal-delay="100">
          <p>
            Buying a used car can feel daunting. Many of our cars include a warranty, and every one
            goes through extensive checks before it reaches the forecourt.
          </p>
          <p>
            We work with a trusted warranty provider, and our team will explain exactly what is
            covered on the car you choose before you decide.
          </p>
        </div>
      </div>
    </section>

    <!-- covered: one shared grid, ruled cells -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading
          title="What a warranty can cover"
          subtitle="Packages vary by car and level of cover. They are designed to help with the cost of unexpected faults."
        />

        <ul class="panel grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0" data-reveal>
          <li
            v-for="(item, i) in covers"
            :key="item.title"
            class="cell flex items-start gap-5 p-6 md:p-8"
            :class="{ 'cell-top': i < 2 }"
          >
            <AppIcon :name="item.icon" :size="22" class="mt-1 shrink-0 text-accent" />
            <div>
              <h3 class="font-display text-xl text-ink">{{ item.title }}</h3>
              <p class="mt-2 text-ink-soft">{{ item.body }}</p>
            </div>
          </li>
        </ul>

        <p class="text-xs text-ink-muted" data-reveal>
          Cover, terms and limits depend on the package and the car, and are confirmed before you
          buy.
        </p>
      </div>
    </section>

    <!-- extended -->
    <section class="bg-paper py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-2 lg:gap-20">
        <div class="flex flex-col gap-6">
          <SectionHeading
            title="Extended cover"
            subtitle="Want longer protection? Extra warranty options may be available on selected vehicles."
          />
          <p class="max-w-prose text-ink-soft" data-reveal data-reveal-delay="120">
            Our team will talk you through the levels of cover, what is included and what each one
            costs, so you can choose what suits you and your budget.
          </p>
          <div data-reveal data-reveal-delay="180">
            <RouterLink to="/contact" class="btn-ghost">
              Ask about extended cover
              <AppIcon name="arrow" :size="16" />
            </RouterLink>
          </div>
        </div>

        <ul class="flex flex-col divide-y divide-line self-start border-y border-line" data-reveal>
          <li v-for="point in extended" :key="point" class="flex items-center gap-4 py-5">
            <AppIcon name="check" :size="16" class="shrink-0 text-accent" />
            <span class="text-ink-soft">{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- faq -->
    <section class="u-rule bg-paper-soft py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading title="Warranty questions answered" />
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

<style scoped>
/* Hairlines between the 2x2 cells on wider screens (stacked cells use the list's own dividers). */
@media (min-width: 640px) {
  .cell:nth-child(odd) {
    @apply border-r border-line;
  }
  .cell:nth-child(n + 3) {
    @apply border-t border-line;
  }
}
</style>
