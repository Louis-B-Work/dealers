<template>
  <section class="bg-paper py-20 md:py-28">
    <div class="u-gutter w-full">
      <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="What our customers say"
          title="Trusted by hundreds of drivers"
        />
        <div class="flex items-center gap-3" data-reveal>
          <span class="flex text-accent">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="17" filled />
          </span>
          <p class="text-sm text-ink-muted">
            <span class="font-semibold text-ink">{{ dealer.rating.score }}/5</span>
            from {{ dealer.rating.count }} {{ dealer.rating.source }}
          </p>
        </div>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <figure
          v-for="(review, i) in reviews"
          :key="review.author"
          class="panel panel-hover flex flex-col gap-6 p-7"
          data-reveal
          :data-reveal-delay="i * 90"
        >
          <span class="font-display text-5xl leading-none text-accent/60" aria-hidden="true">“</span>
          <blockquote class="flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
            {{ review.body }}
          </blockquote>
          <figcaption class="flex items-end justify-between gap-4 border-t border-line pt-5">
            <div class="min-w-0">
              <p class="truncate font-display text-lg text-ink">{{ review.author }}</p>
              <p class="truncate text-xs text-ink-muted">{{ review.car }}</p>
            </div>
            <span class="flex shrink-0 text-accent">
              <AppIcon v-for="n in 5" :key="n" name="star" :size="12" filled />
            </span>
          </figcaption>
        </figure>
      </div>
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
