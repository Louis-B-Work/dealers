<template>
  <section class="bg-paper">
    <!-- The rounded-bottom dark slab is the template's signature shape. It
         reappears at a third of this height as the page header on every inner
         page, so the whole site opens the same way. -->
    <div class="relative overflow-hidden rounded-b-block bg-paper-dark">
      <!-- A still photograph, not a video. The page is carried by the search
           bar, and motion above it would be the loudest thing on the page. -->
      <img
        :src="heroImage"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover opacity-30"
        @error="onImageError"
      />
      <div class="absolute inset-0 bg-paper-dark/45"></div>

      <div class="u-gutter relative flex w-full flex-col items-center py-16 text-center sm:py-20 lg:py-24">
        <p class="u-eyebrow text-accent-soft">
          <AppIcon name="check-circle" :size="15" />
          {{ stockCount }} cars in stock today
        </p>

        <h1 class="u-display mt-4 max-w-3xl text-[2.1rem] text-ink-inverse sm:text-[2.75rem] lg:text-[3.25rem]">
          Let's get you driving
        </h1>
        <p class="mt-4 max-w-xl text-base text-ink-inverse/75 sm:text-lg">
          Quality used cars from
          <span class="font-semibold text-ink-inverse">{{ cheapest }}</span>, or from
          <span class="font-semibold text-ink-inverse">{{ cheapestMonthly }} a month</span>
          on finance. Tell us your budget and we will do the rest.
        </p>

        <!-- The search bar belongs to the hero rather than to the page below
             it, so it lives in this slot and sits on the dark block. -->
        <div class="mt-8 w-full max-w-4xl text-left">
          <slot />
        </div>

        <ul class="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-inverse/70">
          <li class="flex items-center gap-2">
            <AppIcon name="star" :size="16" filled class="text-highlight" />
            <span class="font-semibold text-ink-inverse">{{ dealer.rating.score }}</span>
            from {{ dealer.rating.count.toLocaleString('en-GB') }} reviews
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { dealer } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import { formatCurrency } from '../../composables/useVehicleFilters'
import AppIcon from '../shared/AppIcon.vue'

const REMOTE_HERO =
  'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1920'

// If the CDN is unreachable the hero falls back to a local poster, so it is
// never an empty block behind the headline.
const heroImage = ref(REMOTE_HERO)

function onImageError() {
  heroImage.value = `${import.meta.env.BASE_URL}hero-poster.svg`
}

const stockCount = vehicles.length

const cheapest = computed(() =>
  formatCurrency(Math.min(...vehicles.filter((v) => v.price > 0).map((v) => v.price))),
)

const cheapestMonthly = computed(() =>
  formatCurrency(Math.min(...vehicles.filter((v) => v.monthlyFrom > 0).map((v) => v.monthlyFrom))),
)
</script>
