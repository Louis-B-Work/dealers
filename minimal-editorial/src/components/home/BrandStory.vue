<template>
  <section class="py-16 md:py-20">
    <SectionHeading eyebrow="Our story" title="A different kind of dealership" size="sm" />

    <div class="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-paper-sink" data-reveal>
      <img
        :src="showroomImage"
        alt="Our showroom"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover grayscale"
        @error="onImageError"
      />
    </div>

    <p class="mt-10 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base" data-reveal>
      We've built our reputation on one simple idea: treat every customer the way we'd want to be
      treated ourselves. We hand-select every car in our collection, prepare it to an exacting
      standard and price it honestly. No pushy sales tactics, no hidden fees, just a considered,
      personal service from a team who genuinely love cars.
    </p>

    <!-- Stats run as a plain rail on a single rule, not as cards — the
         figures are the design. The figure steps down on mobile: at the
         desktop size "3,200+" is wider than a third of a phone screen, and it
         has no break opportunity, so it spills into the next stat rather than
         wrapping. -->
    <dl
      class="mt-10 grid grid-cols-3 gap-x-4 gap-y-6 border-t border-line pt-8 sm:gap-6"
      data-reveal
      data-reveal-delay="120"
    >
      <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-2">
        <dd class="u-display text-[clamp(1.125rem,5.2vw,1.375rem)] tabular-nums sm:text-3xl lg:text-4xl">
          {{ stat.value }}
        </dd>
        <dt class="text-[0.6rem] uppercase tracking-micro text-ink-muted">{{ stat.label }}</dt>
      </div>
    </dl>

    <div class="mt-10" data-reveal data-reveal-delay="180">
      <RouterLink to="/contact" class="btn-ghost">
        Visit our showroom
        <AppIcon name="arrow" :size="15" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../../data/dealer'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const showroomImage =
  'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1600'

function onImageError(event: Event) {
  ;(event.target as HTMLImageElement).style.display = 'none'
}

// Derived so the headline figure can't drift from the dealer record.
const yearsTrading = computed(() => new Date().getFullYear() - Number(dealer.established))

const stats = computed(() => [
  { value: `${yearsTrading.value}`, label: 'Years trading' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
])
</script>
