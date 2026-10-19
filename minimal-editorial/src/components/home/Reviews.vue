<template>
  <section class="u-gutter w-full py-20 md:py-28">
    <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <SectionHeading eyebrow="What our customers say" title="Trusted by hundreds of drivers" />
      <div class="flex shrink-0 items-center gap-3" data-reveal>
        <span class="flex text-ink">
          <AppIcon v-for="n in 5" :key="n" name="star" :size="14" filled />
        </span>
        <p class="text-[0.62rem] uppercase tracking-micro text-ink-muted">
          <span class="text-ink">{{ dealer.rating.score }}/5</span>
          from {{ dealer.rating.count }}
        </p>
      </div>
    </div>

    <!-- Quotes are set on rules rather than in bordered cards: a review is
         editorial content, so it's laid out like type on a page.
         Below `sm` the three run as one horizontally scrolling row instead of
         stacking, so the section stays a band rather than a long column. Each
         card is a snap point and sits at 80% width, so the next one always
         peeks and the row announces itself as scrollable without arrows. -->
    <div
      class="reviews-row mt-12 flex snap-x snap-mandatory overflow-x-auto border-l border-t border-line sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3"
    >
      <figure
        v-for="(review, i) in reviews"
        :key="review.author"
        class="flex w-4/5 shrink-0 snap-start flex-col gap-6 border-b border-r border-line bg-paper p-8 transition-colors duration-500 ease-premium hover:bg-paper-soft sm:w-auto sm:shrink"
        data-reveal
        :data-reveal-delay="i * 90"
      >
        <span class="flex text-ink">
          <AppIcon v-for="n in 5" :key="n" name="star" :size="12" filled />
        </span>

        <blockquote class="flex-1 text-sm leading-relaxed text-ink-soft">
          {{ review.body }}
        </blockquote>

        <figcaption class="flex flex-col gap-1.5 border-t border-line pt-5">
          <p class="u-display-caps truncate text-[0.72rem]">{{ review.author }}</p>
          <p class="truncate text-xs text-ink-muted">{{ review.car }}</p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dealer } from '../../data/dealer'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const reviews = [
  {
    body: 'From first enquiry to collection the whole experience was seamless. No pressure, no jargon, just genuinely helpful people and a beautifully presented car.',
    author: 'James Harrington',
    car: 'Porsche 911 Carrera 4S',
  },
  {
    body: 'The finance was sorted in a single afternoon at a rate that beat my bank. They even delivered the car to my door, fully valeted. Faultless.',
    author: 'Priya Nair',
    car: 'Range Rover Autobiography',
  },
  {
    body: 'Part-exchanged my old estate and drove away in something far nicer. The valuation was fair and completely transparent. I’ll be back.',
    author: 'Daniel Okafor',
    car: 'Audi RS6 Avant',
  },
]
</script>

<style scoped>
/* The peeking next card is the affordance, so the scrollbar is hidden rather
   than left to sit under the row on desktop browsers at narrow widths. */
.reviews-row {
  scrollbar-width: none;
}

.reviews-row::-webkit-scrollbar {
  display: none;
}

/* The reveal is written for a grid, where every card is on screen and the
   stagger is visible. In the scrolling row the later cards are clipped, so
   they stay at opacity 0 until they are scrolled to and then fade in late —
   a card that looks blank for a moment as you swipe onto it. The row opts out
   and shows its cards outright; the grid keeps the staggered reveal. */
@media (max-width: 639px) {
  .reviews-row > [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
