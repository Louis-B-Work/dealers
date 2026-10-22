<template>
  <div class="bg-paper">
    <PageHeader
      :title="`About ${dealer.name}`"
      subtitle="Years of handpicking, preparing and presenting premium vehicles to an exacting standard."
    />

    <!-- stats: one hairline rail, left-aligned, numbered -->
    <section class="border-b border-line">
      <dl class="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="stat u-gutter flex flex-col gap-3 py-8 lg:py-10"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <dt class="u-index">{{ stat.label }}</dt>
          <dd class="font-display text-4xl text-ink md:text-5xl">{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- story: full-bleed showroom band, pitch overlaid, narrative below -->
    <section class="border-b border-line bg-paper-soft">
      <div class="relative aspect-[21/9] min-h-[260px] w-full overflow-hidden" data-reveal>
        <VehiclePlaceholder
          :gradient="['22 25 30', '48 53 61']"
          image="https://images.pexels.com/photos/20428028/pexels-photo-20428028.jpeg"
          label="Dealership Name showroom"
          :silhouette-size="170"
          class="h-full w-full"
        />
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to top, rgba(9, 10, 12, 0.92) 0%, rgba(9, 10, 12, 0.35) 55%, transparent 85%)"
        ></div>
        <div class="u-gutter absolute inset-x-0 bottom-0 w-full pb-8 md:pb-10">
          <SectionHeading title="A family-run dealership" />
        </div>
      </div>

      <div class="u-gutter grid w-full gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-16">
        <div class="flex flex-col gap-6" data-reveal>
          <p class="max-w-prose text-lg leading-relaxed text-ink-soft">
            We built our reputation on one simple idea: treat every customer the way we'd want to be
            treated ourselves. We hand-select every car in our collection, prepare it to an exacting
            standard and price it honestly.
          </p>
          <p class="max-w-prose leading-relaxed text-ink-soft">
            Whether you are buying, part-exchanging or just want advice, you will always speak to
            someone who knows the car and takes the time to explain your options.
          </p>
        </div>

        <ul class="flex flex-col divide-y divide-line border-y border-line self-start" data-reveal data-reveal-delay="120">
          <li v-for="fact in facts" :key="fact.label" class="flex items-baseline justify-between gap-6 py-4 text-sm">
            <span class="text-ink-muted">{{ fact.label }}</span>
            <span class="text-ink">{{ fact.value }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- values: numbered editorial rows rather than cards -->
    <section class="bg-paper py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            title="What you can expect from us"
            subtitle="Four commitments we hold ourselves to on every car and every customer."
          />
        </div>

        <ol class="flex flex-col divide-y divide-line border-y border-line">
          <li
            v-for="(value, i) in values"
            :key="value.title"
            class="grid gap-3 py-8 md:grid-cols-[1fr_1.4fr] md:gap-8"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <h3 class="font-display text-2xl text-ink">{{ value.title }}</h3>
            <p class="text-ink-soft">{{ value.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <Reviews />

    <!-- cta: split band, left-aligned -->
    <section class="u-rule bg-paper-soft py-16 md:py-20">
      <div class="u-gutter flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl" data-reveal>
          <h2 class="u-display text-[2.1rem] sm:text-[2.6rem] md:text-[3rem]">Come and say hello</h2>
          <p class="mt-4 max-w-prose text-ink-soft">
            Browse the collection online, or visit the showroom and talk it through with the team.
          </p>
        </div>
        <div class="flex flex-wrap gap-3" data-reveal data-reveal-delay="120">
          <RouterLink to="/vehicles" class="btn-primary">
            Browse stock
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <RouterLink to="/contact" class="btn-ghost">Contact us</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import Reviews from '../components/home/Reviews.vue'

useScrollReveal()

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: String(yearsTrading.value), label: 'Years trading' },
  { value: `${dealer.rating.score}★`, label: 'Average rating' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
])

const facts = computed(() => [
  { label: 'Established', value: dealer.established },
  { label: 'Showroom', value: dealer.address.city },
  { label: 'Rated', value: `${dealer.rating.score}/5 on ${dealer.rating.source}` },
  { label: 'Open', value: dealer.openingHours[0].hours + ', ' + dealer.openingHours[0].day },
])

const values = [
  {
    title: 'Handpicked stock',
    body: 'Every car is chosen by our team, checked thoroughly and prepared before it reaches the forecourt.',
  },
  {
    title: 'Honest pricing',
    body: 'Clear prices and no hidden fees, so you know exactly what you are paying for.',
  },
  {
    title: 'Peace of mind',
    body: 'Warranty cover and breakdown assistance come with your car, with support after you drive away.',
  },
  {
    title: 'Personal service',
    body: 'A friendly, no-pressure experience from your first enquiry through to handover and beyond.',
  },
]
</script>

<style scoped>
/* On two columns the stat cells need a hairline between rows, not just columns. */
@media (max-width: 1023px) {
  .stat {
    @apply border-b border-line;
  }
  .stat:nth-child(odd) {
    @apply border-r;
  }
}
</style>
