<template>
  <div>
    <PageHero
      :title="`About ${dealer.name}`"
      intro="Years of handpicking, preparing and presenting premium vehicles to an exacting standard."
    />

    <!-- stats -->
    <section class="border-b border-line bg-paper-soft py-14">
      <div class="container grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="flex flex-col gap-1"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <span class="font-display text-4xl text-ink">{{ stat.value }}</span>
          <span class="text-sm text-ink-soft">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- story -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div class="relative" data-reveal>
          <div class="overflow-hidden rounded-panel shadow-lift">
            <VehiclePlaceholder
              :gradient="['30 41 59', '100 116 139']"
              label="Dealership Name showroom"
              :silhouette-size="160"
              class="aspect-[4/3] w-full"
            />
          </div>
          <div
            class="absolute -bottom-6 -right-4 flex flex-col gap-1 rounded-panel border border-line bg-white px-6 py-5 shadow-lift sm:right-6"
          >
            <span class="font-display text-3xl text-ink">{{ yearsTrading }} yrs</span>
            <span class="text-xs uppercase tracking-wider text-ink-muted">of trusted trading</span>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <SectionHeading
            title="A family-run dealership"
            subtitle="We built our reputation on one simple idea: treat every customer the way we'd want to be treated ourselves."
          />
          <p class="max-w-prose text-ink-soft" data-reveal data-reveal-delay="120">
            We hand-select every car in our collection, prepare it to an exacting standard and price
            it honestly. No pushy sales tactics and no hidden fees, just a considered, personal
            service from a team who love cars.
          </p>
          <p class="max-w-prose text-ink-soft" data-reveal data-reveal-delay="160">
            Whether you are buying, part-exchanging or just want advice, you will always speak to
            someone who knows the car and takes the time to explain your options.
          </p>
        </div>
      </div>
    </section>

    <!-- values -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="What you can expect from us" center />

        <ul class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(value, i) in values"
            :key="value.title"
            class="flex flex-col gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="i * 80"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-control bg-paper-soft text-accent"
            >
              <AppIcon :name="value.icon" :size="22" />
            </span>
            <h3 class="font-display text-xl text-ink">{{ value.title }}</h3>
            <p class="text-ink-soft">{{ value.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <Reviews />

    <!-- cta -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col items-center gap-6 text-center">
        <SectionHeading
          title="Come and say hello"
          subtitle="Browse the collection online, or visit the showroom and talk it through with the team."
          center
        />
        <div class="flex flex-wrap justify-center gap-4" data-reveal data-reveal-delay="120">
          <RouterLink to="/vehicles" class="btn-accent">
            Browse cars
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
import PageHero from '../components/shared/PageHero.vue'
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

const values = [
  {
    icon: 'check',
    title: 'Handpicked stock',
    body: 'Every car is chosen by our team, checked thoroughly and prepared before it reaches the forecourt.',
  },
  {
    icon: 'pound',
    title: 'Honest pricing',
    body: 'Clear prices and no hidden fees, so you know exactly what you are paying for.',
  },
  {
    icon: 'shield',
    title: 'Peace of mind',
    body: 'Warranty cover and breakdown assistance come with your car, with support after you drive away.',
  },
  {
    icon: 'key',
    title: 'Personal service',
    body: 'A friendly, no-pressure experience from your first enquiry through to handover and beyond.',
  },
]
</script>
