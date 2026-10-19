<template>
  <section class="border-y border-line bg-paper-soft py-20 md:py-28">
    <div class="container">
      <div class="flex flex-col items-center gap-4 text-center">
        <SectionHeading
          center
          eyebrow="What our customers say"
          title="Trusted by hundreds of drivers"
        />
        <div class="flex items-center gap-3" data-reveal>
          <div class="flex text-accent">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="20" />
          </div>
          <p class="text-sm text-ink-soft">
            <span class="font-semibold text-ink">{{ dealer.rating.score }}/5</span>
            from {{ dealer.rating.count }} {{ dealer.rating.source }}
          </p>
        </div>
      </div>

      <div class="mt-14 grid gap-6 md:grid-cols-3">
        <figure
          v-for="(review, i) in reviews"
          :key="review.author"
          class="card-hover flex flex-col gap-5 rounded-panel border border-line bg-white p-7 shadow-soft"
          data-reveal
          :data-reveal-delay="i * 90"
        >
          <AppIcon name="quote" :size="28" class="text-accent-soft" />
          <blockquote class="flex-1 text-[0.975rem] leading-relaxed text-ink-soft">
            "{{ review.body }}"
          </blockquote>
          <figcaption class="flex items-center justify-between border-t border-line pt-5">
            <div>
              <p class="font-semibold text-ink">{{ review.author }}</p>
              <p class="text-xs text-ink-muted">{{ review.car }}</p>
            </div>
            <div class="flex text-accent">
              <AppIcon v-for="n in 5" :key="n" name="star" :size="14" />
            </div>
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
