<template>
  <div class="bg-paper pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-4 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>About {{ dealer.name }}</h1>
        <p class="max-w-prose text-ink-soft sm:text-lg" data-intro>
          Years of finding good, honest used cars and selling them at fair prices.
        </p>
      </div>
    </div>

    <!-- figures: four tiles, each its own colour weight -->
    <section class="pt-8 md:pt-10">
      <div class="container">
        <dl class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="flex flex-col justify-between gap-6 rounded-panel p-6"
            :class="tileClasses[i]"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <dd class="font-display text-4xl font-extrabold sm:text-5xl">{{ stat.value }}</dd>
            <dt class="text-xs font-bold uppercase tracking-micro opacity-70">{{ stat.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- story: photo tile beside the copy tile -->
    <section class="py-16 md:py-24">
      <div class="container grid gap-4 lg:grid-cols-5">
        <div class="aspect-[4/3] overflow-hidden rounded-panel bg-paper-sink shadow-soft lg:col-span-3 lg:aspect-auto lg:min-h-[26rem]" data-reveal>
          <VehiclePlaceholder
            :gradient="['15 23 42', '51 65 85']"
            label="Dealership Name forecourt"
            :image="forecourtImage"
            class="h-full w-full"
          />
        </div>

        <div class="flex flex-col justify-between gap-8 rounded-panel bg-ink p-8 text-paper lg:col-span-2" data-reveal data-reveal-delay="80">
          <div class="flex flex-col gap-5">
            <h2 class="u-display text-3xl !text-paper sm:text-4xl">A family-run dealership</h2>
            <p class="text-paper/80">
              We built our reputation on one simple idea: treat every customer the way we'd want to be treated
              ourselves. We hand-select every car in our collection, prepare it properly and price it honestly.
            </p>
            <p class="text-paper/80">
              Whether you are buying, part-exchanging or just want advice, you will always speak to someone who
              knows the car and takes the time to explain your options.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/vehicles" class="btn-accent">
              Browse our cars
              <AppIcon name="arrow" :size="16" />
            </RouterLink>
            <RouterLink to="/contact" class="btn bg-paper/10 text-paper hover:bg-paper/20">Contact us</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- values -->
    <section class="border-y border-line bg-paper-soft py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading title="What you can expect from us" center />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(value, i) in values"
            :key="value.title"
            class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <span class="flex h-12 w-12 items-center justify-center rounded-control bg-paper-sink text-accent">
              <AppIcon :name="value.icon" :size="22" />
            </span>
            <h3 class="font-display text-lg font-extrabold text-ink">{{ value.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ value.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- invitation -->
    <section class="py-16 md:py-24">
      <div class="container">
        <div class="flex flex-col items-start justify-between gap-8 rounded-panel bg-accent p-8 text-accent-ink md:flex-row md:items-center md:p-12" data-reveal>
          <div class="max-w-xl">
            <h2 class="u-display text-3xl !text-accent-ink sm:text-4xl">Come and say hello</h2>
            <p class="mt-3 text-accent-ink/85">
              Browse the cars online, or pop into the showroom and talk it through with the team.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/vehicles" class="btn bg-surface text-accent hover:-translate-y-0.5 hover:shadow-lift">View all stock</RouterLink>
            <RouterLink to="/contact" class="btn bg-white/15 text-accent-ink hover:bg-white/25">Contact us</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { dealer } from '../data/dealer'
import SectionHeading from '../components/shared/SectionHeading.vue'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'
import AppIcon from '../components/shared/AppIcon.vue'

useScrollReveal()

const forecourtImage =
  'https://images.pexels.com/photos/39993004/pexels-photo-39993004.jpeg?auto=compress&cs=tinysrgb&w=1200'

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: String(yearsTrading.value), label: 'Years trading' },
  { value: `${dealer.rating.score}★`, label: 'Average rating' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
])

// Yellow is reserved for prices in this template, so the stat tiles use blue, ink and neutrals.
const tileClasses = [
  'bg-accent text-accent-ink',
  'border border-line bg-surface text-ink shadow-soft',
  'bg-ink text-paper',
  'bg-paper-sink text-ink',
]

const values = [
  { icon: 'check', title: 'Handpicked stock', body: 'Every car is chosen by our team, checked thoroughly and prepared before it reaches the forecourt.' },
  { icon: 'pound', title: 'Honest pricing', body: 'Clear prices and no hidden fees, so you know exactly what you are paying for.' },
  { icon: 'shield', title: 'Peace of mind', body: 'Warranty cover and breakdown assistance come with your car, with support after you drive away.' },
  { icon: 'key', title: 'Personal service', body: 'A friendly, no-pressure experience from your first enquiry through to handover and beyond.' },
]
</script>
