<template>
  <!-- Unlike 01's side-by-side image/text grid, the story runs top-to-
       bottom: a full-bleed showroom band with the pitch overlaid bottom-left
       (echoing the hero), then a wide two-column foot with the narrative on
       one side and the stats run as an inline, undivided rail on the other. -->
  <section class="border-b border-line bg-paper-soft">
    <div class="relative aspect-[21/9] w-full overflow-hidden" data-reveal>
      <VehiclePlaceholder
        :gradient="['22 25 30', '48 53 61']"
        image="https://images.pexels.com/photos/20428028/pexels-photo-20428028.jpeg"
        label="Dealership Name showroom"
        :silhouette-size="170"
        class="h-full w-full"
      />
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(to top, rgba(9, 10, 12, 0.92) 0%, rgba(9, 10, 12, 0.35) 55%, transparent 85%);
        "
      ></div>
      <div class="u-gutter absolute inset-x-0 bottom-0 w-full pb-8 md:pb-10">
        <SectionHeading eyebrow="Our story" title="A different kind of dealership" />
      </div>
    </div>

    <div class="u-gutter grid w-full gap-12 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-16">
      <div class="flex flex-col gap-6" data-reveal>
        <p class="max-w-prose text-lg leading-relaxed text-ink-soft">
          We've built our reputation on one simple idea: treat every customer the way we'd want
          to be treated ourselves. We hand-select every car in our collection, prepare it to an
          exacting standard and price it honestly. No pushy sales tactics, no hidden fees, just a
          considered, personal service from a team who genuinely love cars.
        </p>

        <div>
          <RouterLink to="/contact" class="btn-ghost">
            Visit our showroom
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </div>
      </div>

      <div class="flex gap-8 border-t border-line pt-6 lg:gap-10" data-reveal data-reveal-delay="120">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1">
          <dd class="u-display text-4xl text-ink lg:text-5xl">{{ stat.value }}</dd>
          <dt class="text-[0.68rem] uppercase tracking-micro text-ink-muted">{{ stat.label }}</dt>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../../data/dealer'
import SectionHeading from '../shared/SectionHeading.vue'
import VehiclePlaceholder from '../shared/VehiclePlaceholder.vue'
import AppIcon from '../shared/AppIcon.vue'

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: `${yearsTrading.value}`, label: 'Years trading' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
])
</script>
