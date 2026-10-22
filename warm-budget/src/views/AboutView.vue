<template>
  <div class="bg-paper">
    <PageHeader
      :title="`About ${dealer.name}`"
      subtitle="A family-run forecourt selling honest used cars to the same town for over twenty-five years."
    />

    <!-- figures: four soft cards that overlap the foot of the dark slab -->
    <section class="relative z-10 -mt-10">
      <div class="u-gutter">
        <dl class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div v-for="stat in stats" :key="stat.label" class="card flex flex-col items-center gap-1 px-4 py-6 text-center">
            <dd class="font-display text-3xl font-semibold text-accent sm:text-4xl">{{ stat.value }}</dd>
            <dt class="text-sm font-medium text-ink-soft">{{ stat.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- story -->
    <section class="u-section">
      <div class="u-gutter grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="aspect-[4/3] overflow-hidden rounded-block bg-paper-sink shadow-card">
          <VehiclePlaceholder label="Dealership Name forecourt" :image="forecourtImage" class="h-full w-full" />
        </div>

        <div class="flex flex-col gap-5">
          <SectionHeading
            title="A friendly, family-run dealership"
            subtitle="We built our reputation on one simple idea: treat every customer the way we'd want to be treated ourselves."
          />
          <p class="u-lead">
            We hand-select every car on our forecourt, prepare it properly and price it honestly. No pushy sales
            tactics and no hidden fees, just a friendly, personal service from a team who love cars.
          </p>
          <p class="u-lead">
            Whether you are buying, part-exchanging or just want advice, you will always speak to someone who knows
            the car and takes the time to explain your options.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <RouterLink to="/vehicles" class="btn-primary">
              Browse our cars
              <AppIcon name="arrow" :size="16" />
            </RouterLink>
            <RouterLink to="/contact" class="btn-ghost">Contact us</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- values -->
    <section class="u-section border-y border-line bg-paper-sink/50">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="What you can expect from us" center />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="value in values" :key="value.title" class="card flex flex-col gap-4 p-6">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-accent-wash text-accent">
              <AppIcon :name="value.icon" :size="22" />
            </span>
            <h3 class="font-display text-lg font-semibold text-ink">{{ value.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ value.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- invitation -->
    <section class="u-section">
      <div class="u-gutter">
        <div class="rounded-block bg-paper-dark px-6 py-14 text-center text-ink-inverse sm:px-12 md:py-20">
          <div class="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 class="u-display text-[1.65rem] !text-ink-inverse sm:text-[2rem] md:text-[2.35rem]">Come and say hello</h2>
            <p class="text-ink-inverse/75">
              Browse the cars online, or pop into the showroom and talk it through with the team.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <RouterLink to="/vehicles" class="btn-primary">View all stock</RouterLink>
              <RouterLink to="/contact" class="btn-on-dark">Contact us</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'
import AppIcon from '../components/shared/AppIcon.vue'

const forecourtImage =
  'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1200'

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: String(yearsTrading.value), label: 'Years trading' },
  { value: `${dealer.rating.score}★`, label: 'Average rating' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
])

const values = [
  { icon: 'check', title: 'Handpicked stock', body: 'Every car is chosen by our team, checked thoroughly and prepared before it reaches the forecourt.' },
  { icon: 'pound', title: 'Honest pricing', body: 'Clear prices and no hidden fees, so you know exactly what you are paying for.' },
  { icon: 'shield', title: 'Peace of mind', body: 'Warranty cover and breakdown assistance come with your car, with support after you drive away.' },
  { icon: 'handshake', title: 'Personal service', body: 'A friendly, no-pressure experience from your first enquiry through to handover and beyond.' },
]
</script>
