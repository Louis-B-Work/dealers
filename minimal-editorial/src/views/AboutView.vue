<template>
  <div class="bg-paper">
    <PageHeader
      :title="`About ${dealer.name}`"
      subtitle="Years of handpicking, preparing and presenting premium vehicles to an exacting standard."
    />

    <!-- figures: ruled columns of large, light numerals -->
    <section class="border-b border-line">
      <dl class="u-gutter grid w-full grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="flex flex-col items-center gap-3 border-b border-line py-10 text-center last:border-b-0 even:border-l even:border-line lg:border-b-0 lg:border-l-0 lg:py-14 lg:even:border-l-0"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <dd class="font-display text-5xl font-light leading-none tracking-tight text-ink md:text-6xl">
            {{ stat.value }}
          </dd>
          <dt class="text-[0.6rem] uppercase tracking-micro text-ink-muted">{{ stat.label }}</dt>
        </div>
      </dl>
    </section>

    <!-- a single considered statement -->
    <section class="py-24 md:py-36">
      <div class="u-gutter w-full">
        <blockquote
          class="u-display mx-auto max-w-4xl text-center text-[1.6rem] leading-[1.35] sm:text-[2rem] md:text-[2.6rem]"
          data-reveal
        >
          We built our reputation on one simple idea: treat every customer the way we would want to be treated
          ourselves.
        </blockquote>
      </div>
    </section>

    <!-- story: a tall photograph set against a narrow column of text -->
    <section class="border-t border-line py-20 md:py-28">
      <div class="u-gutter grid w-full items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div class="relative aspect-[4/5] w-full overflow-hidden bg-paper-sink" data-reveal>
          <VehiclePlaceholder
            label="Dealership Name showroom"
            :image="showroomImage"
            class="h-full w-full grayscale"
          />
        </div>

        <div class="flex flex-col gap-8 lg:max-w-xl">
          <SectionHeading title="A family-run dealership" />
          <p class="text-ink-soft sm:text-lg" data-reveal data-reveal-delay="120">
            We hand-select every car in our collection, prepare it to an exacting standard and price it honestly.
            No pushy sales tactics and no hidden fees, just a considered, personal service from a team who love
            cars.
          </p>
          <p class="text-ink-soft sm:text-lg" data-reveal data-reveal-delay="160">
            Whether you are buying, part-exchanging or simply want advice, you will always speak to someone who
            knows the car and takes the time to explain your options.
          </p>
          <div data-reveal data-reveal-delay="200">
            <RouterLink to="/vehicles" class="link-rule">View the collection</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- principles: definitions on drawn rules, no icons or counters -->
    <section class="border-t border-line py-20 md:py-28">
      <div class="u-gutter grid w-full gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
        <SectionHeading title="What you can expect" />

        <dl class="border-t border-ink">
          <div
            v-for="(value, i) in values"
            :key="value.title"
            class="grid gap-3 border-b border-line py-8 md:grid-cols-[1fr_1.5fr] md:gap-10"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <dt class="u-display-caps text-[0.82rem]">{{ value.title }}</dt>
            <dd class="text-sm leading-relaxed text-ink-soft sm:text-base">{{ value.body }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- invitation -->
    <section class="bg-ink py-24 text-paper md:py-32">
      <div class="u-gutter flex w-full flex-col items-center gap-10 text-center">
        <h2 class="u-display-caps text-2xl !text-paper sm:text-3xl" data-reveal>Come and say hello</h2>
        <p class="max-w-prose text-paper/70" data-reveal data-reveal-delay="80">
          Browse the collection online, or visit the showroom and talk it through with the team.
        </p>
        <div class="flex flex-wrap justify-center gap-4" data-reveal data-reveal-delay="140">
          <RouterLink
            to="/vehicles"
            class="btn border border-paper bg-paper text-ink hover:bg-transparent hover:text-paper"
          >
            View all stock
          </RouterLink>
          <RouterLink to="/contact" class="btn border border-paper/60 text-paper hover:bg-paper hover:text-ink">
            Contact us
          </RouterLink>
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

useScrollReveal()

const showroomImage =
  'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1200'

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: String(yearsTrading.value), label: 'Years trading' },
  { value: `${dealer.rating.score}`, label: 'Average rating' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
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
