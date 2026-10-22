<template>
  <div class="bg-paper">
    <PageHeader title="Warranty" subtitle="Drive away with added peace of mind on your next used car.">
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <RouterLink to="/contact" class="btn-primary">
          Ask our team
          <AppIcon name="arrow" :size="14" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="14" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- confidence: heading left, copy right, on one rule -->
    <section class="border-b border-line py-20 md:py-28">
      <div class="u-gutter grid w-full items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <h2 class="u-display text-3xl sm:text-4xl" data-reveal>Buy with confidence</h2>
        <div class="flex flex-col gap-6 text-ink-soft sm:text-lg" data-reveal data-reveal-delay="100">
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
    </section>

    <!-- what is covered: definitions in two ruled columns -->
    <section class="py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading
          title="What a warranty can cover"
          subtitle="Packages vary by car and level of cover. They are designed to help with the cost of unexpected faults."
          center
        />

        <dl class="mx-auto grid w-full max-w-6xl border-t border-ink md:grid-cols-2 md:gap-x-20">
          <div
            v-for="(item, i) in covers"
            :key="item.title"
            class="flex flex-col gap-3 border-b border-line py-9"
            data-reveal
            :data-reveal-delay="(i % 2) * 80"
          >
            <dt class="u-display-caps text-[0.82rem]">{{ item.title }}</dt>
            <dd class="text-sm leading-relaxed text-ink-soft sm:text-base">{{ item.body }}</dd>
          </div>
        </dl>

        <p class="mx-auto max-w-prose text-center text-xs leading-relaxed text-ink-muted" data-reveal>
          Cover, terms and limits depend on the package and the car, and are confirmed before you buy.
        </p>
      </div>
    </section>

    <!-- extended cover -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div class="flex flex-col gap-8">
          <SectionHeading
            title="Extended cover"
            subtitle="Want longer protection? Extra warranty options may be available on selected vehicles."
          />
          <p class="max-w-prose text-ink-soft" data-reveal data-reveal-delay="120">
            Our team will talk you through the levels of cover, what is included and what each one costs, so you
            can choose what suits you and your budget.
          </p>
          <div data-reveal data-reveal-delay="180">
            <RouterLink to="/contact" class="link-rule">Ask about extended cover</RouterLink>
          </div>
        </div>

        <ul class="flex flex-col border-t border-ink" data-reveal>
          <li v-for="point in extended" :key="point" class="flex items-center gap-4 border-b border-line py-5">
            <AppIcon name="check" :size="14" class="shrink-0 text-ink" />
            <span class="text-ink-soft">{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- faq -->
    <section class="py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
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
  { title: 'Mechanical faults', body: 'Help with the cost of repairing key mechanical parts such as the engine and gearbox.' },
  { title: 'Electrical faults', body: 'Cover for many electrical components, so a sudden fault doesn’t become a surprise bill.' },
  { title: 'Peace of mind', body: 'Know that help is available if something goes wrong after you drive away.' },
  { title: 'Clear terms', body: 'We explain what’s included and any limits before you buy, with nothing hidden.' },
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
