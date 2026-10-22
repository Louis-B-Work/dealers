<template>
  <div>
    <SpotlightHero />

    <!-- Statement -->
    <section class="u-gutter grid gap-12 py-24 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:py-32" aria-labelledby="intro-title">
      <div v-reveal>
        <h2 id="intro-title" class="font-display text-3xl !leading-[1.15] sm:text-4xl lg:text-5xl">
          A private collection of exceptional cars, <em class="not-italic text-accent">each one chosen</em>, inspected and shown by
          appointment.
        </h2>
      </div>
      <dl v-reveal="150" class="grid grid-cols-3 gap-6 border-t border-line pt-8">
        <div v-for="stat in stats" :key="stat.label">
          <dt class="text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">{{ stat.label }}</dt>
          <dd class="tabular mt-3 font-display text-4xl sm:text-5xl">{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- Catalogue -->
    <section class="u-gutter pb-24 lg:pb-32" aria-labelledby="collection-title">
      <div v-reveal class="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="collection-title" class="u-h2">The Collection</h2>
        </div>
        <RouterLink to="/vehicles" class="btn-ghost">
          View all {{ vehicles.length }} cars
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
      </div>
      <CatalogueList v-reveal :cars="catalogue" />
    </section>

    <!-- Experience -->
    <section class="border-y border-line bg-paper-soft" aria-labelledby="experience-title">
      <div class="u-gutter grid gap-12 py-24 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-32">
        <div v-reveal class="relative overflow-hidden rounded-panel">
          <img :src="experienceCar.image" :alt="`${experienceCar.make} ${experienceCar.model} in ${experienceCar.colour}`" class="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]" loading="lazy" width="1600" height="1067" />
          <p class="absolute bottom-0 left-0 bg-paper px-5 py-4 text-[0.65rem] uppercase tracking-[0.24em] text-ink-soft">
            {{ experienceCar.make }} {{ experienceCar.model }}
          </p>
        </div>
        <div>
          <h2 v-reveal id="experience-title" class="u-h2">Buying a car this special should feel unhurried.</h2>
          <ol class="mt-12 grid gap-10">
            <li v-for="(pillar, index) in pillars" :key="pillar.title" v-reveal="index * 120" class="border-t border-line pt-8">
              <div>
                <h3 class="font-display text-2xl">{{ pillar.title }}</h3>
                <p class="mt-2 leading-relaxed text-ink-soft">{{ pillar.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Finance and selling -->
    <section class="u-gutter py-px" aria-label="Finance and selling your car">
      <div class="grid gap-px overflow-hidden rounded-panel border border-line bg-line lg:grid-cols-2">
      <div v-reveal class="flex flex-col bg-paper p-8 sm:p-12 lg:p-16">
        <h2 class="u-h2">Ownership, arranged quietly.</h2>
        <p class="mt-5 max-w-md leading-relaxed text-ink-soft">
          Hire purchase and balanced payment options, explained in plain English and arranged discreetly. Model your
          own figures before you speak to anyone.
        </p>
        <p class="mt-10">
          <span class="block text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">The {{ financeCar.model }}, from</span>
          <span class="tabular font-display text-5xl text-accent">{{ formatCurrency(financeCar.monthlyFrom) }}</span>
          <span class="text-ink-soft"> a month*</span>
        </p>
        <RouterLink to="/finance" class="btn-accent mt-10 self-start">
          Model your payments
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
        <p class="mt-auto pt-10 text-xs leading-relaxed text-ink-muted">*{{ representativeExample }} {{ brokerDisclosure }}</p>
      </div>
      <div v-reveal="120" class="relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden bg-paper p-8 sm:p-12 lg:p-16">
        <img :src="sellCar.image" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" loading="lazy" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/70 to-transparent"></div>
        <h2 class="u-h2">Moving a car on?</h2>
        <p class="mt-5 max-w-md leading-relaxed text-ink-soft">
          We buy exceptional cars outright, or take them in part-exchange. A real valuation needs an inspection, so
          there are no instant online prices here.
        </p>
        <RouterLink to="/sell" class="btn-ghost mt-10 self-start bg-black/20">
          Request a valuation
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
      </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section class="u-gutter py-24 text-center lg:py-32" aria-label="What customers say">
      <figure v-reveal class="mx-auto mt-10 max-w-4xl">
        <blockquote :key="quote" class="font-display text-2xl leading-snug sm:text-3xl lg:text-4xl motion-safe:animate-[spotlight-in_0.8s_ease_both]">
          “{{ reviews[quote].text }}”
        </blockquote>
        <figcaption class="mt-8 text-sm text-ink-soft">
          <span class="text-ink">{{ reviews[quote].name }}</span>
          <span class="mx-2 text-ink-muted">·</span>
          {{ reviews[quote].detail }}
        </figcaption>
      </figure>
      <div class="mt-10 flex justify-center gap-3" role="group" aria-label="Choose a review">
        <button
          v-for="(review, index) in reviews"
          :key="review.name"
          type="button"
          class="w-12 py-3 before:block before:h-px before:w-full before:transition"
          :class="index === quote ? 'before:bg-accent' : 'before:bg-ink/25 hover:before:bg-ink/60'"
          :aria-pressed="index === quote"
          @click="quote = index"
        >
          <span class="sr-only">Review from {{ review.name }}</span>
        </button>
      </div>
      <p class="mt-8 text-xs text-ink-muted">Illustrative reviews for this design preview.</p>
    </section>

    <!-- Visit -->
    <section class="border-t border-line bg-paper-sink" aria-labelledby="visit-title">
      <div class="u-gutter grid gap-12 py-24 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div v-reveal>
          <h2 id="visit-title" class="u-h2">Viewings by appointment.</h2>
          <p class="mt-5 max-w-lg leading-relaxed text-ink-soft">
            Every car is prepared and waiting when you arrive, with time set aside to look, sit and drive. Evening and
            weekend appointments on request.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <RouterLink :to="{ path: '/contact', query: { subject: 'Vehicle viewing' } }" class="btn-accent">
              Arrange a viewing
              <AppIcon name="arrow" :size="15" />
            </RouterLink>
            <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-ghost tabular">{{ dealer.phone }}</a>
          </div>
        </div>
        <div v-reveal="120">
          <address class="not-italic text-ink-soft">
            {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
            {{ dealer.address.city }}, {{ dealer.address.postcode }}
          </address>
          <ul class="mt-6 divide-y divide-line border-y border-line text-sm">
            <li v-for="hours in dealer.openingHours" :key="hours.day" class="flex justify-between py-3.5">
              <span class="text-ink-muted">{{ hours.day }}</span>
              <span class="tabular">{{ hours.hours }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import SpotlightHero from '../components/home/SpotlightHero.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import CatalogueList from '../components/shared/CatalogueList.vue'
import { formatCurrency, sortVehicles } from '../composables/useCollectionSearch'
import { reviews } from '../data/content'
import { brokerDisclosure, dealer, representativeExample } from '../data/dealer'
import { getVehicleById, vehicles } from '../data/vehicles'

const catalogue = sortVehicles(vehicles, 'featured').slice(0, 8)
const byId = (id: string) => getVehicleById(id) ?? vehicles[0]
const experienceCar = byId('bentley-continental-2020')
const financeCar = byId('porsche-911-2021')
const sellCar = byId('audi-rs6-2021')

const stats = [
  { label: 'In the collection', value: String(vehicles.length) },
  { label: 'Established', value: dealer.established },
  { label: dealer.rating.source, value: String(dealer.rating.score) },
]

const pillars = [
  {
    title: 'Chosen, then inspected',
    text: 'Every car is selected for its specification, history and condition, then inspected and prepared before it joins the collection.',
  },
  {
    title: 'Shown in private',
    text: 'Viewings are by appointment, with the car prepared under the lights and time set aside for a proper test drive.',
  },
  {
    title: 'Delivered with care',
    text: 'Handover at the showroom or enclosed delivery to your door, with every document explained before you sign.',
  },
]

const quote = ref(0)
</script>
