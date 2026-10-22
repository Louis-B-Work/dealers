<template>
  <section class="bg-paper py-20 md:py-28">
    <!-- Full-bleed, aligned to the same edges as the nav and card grid. -->
    <div class="u-gutter grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div class="relative" data-reveal>
        <div class="overflow-hidden rounded-panel shadow-lift">
          <VehiclePlaceholder
            :gradient="['30 41 59', '100 116 139']"
            label="Dealership Name showroom"
            :silhouette-size="160"
            class="aspect-square w-full"
          />
        </div>
        <!-- floating stat card -->
        <div
          class="absolute -bottom-6 -right-4 flex flex-col gap-1 rounded-panel border border-line bg-white px-6 py-5 shadow-lift sm:right-6"
        >
          <span class="font-display text-3xl text-ink">{{ yearsTrading }} yrs</span>
          <span class="text-xs uppercase tracking-wider text-ink-muted">of trusted trading</span>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <SectionHeading
          title="A different kind of dealership"
          subtitle="We've built our reputation on one simple idea: treat every customer the way we'd want to be treated ourselves."
        />
        <p class="max-w-prose text-ink-soft" data-reveal data-reveal-delay="120">
          We hand-select every car in our collection, prepare it to an exacting standard and price
          it honestly. No pushy sales tactics, no hidden fees, just a considered, personal service
          from a team who genuinely love cars.
        </p>

        <div class="grid gap-6 pt-2 sm:grid-cols-3" data-reveal data-reveal-delay="180">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1">
            <span class="font-display text-2xl text-ink">{{ stat.value }}</span>
            <span class="text-sm text-ink-soft">{{ stat.label }}</span>
          </div>
        </div>

        <div class="pt-2" data-reveal data-reveal-delay="220">
          <RouterLink to="/contact" class="btn-primary">
            Visit our showroom
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
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

const stats = [
  { value: '4.9★', label: 'Average rating' },
  { value: '3,200+', label: 'Cars delivered' },
  { value: '98%', label: 'Would recommend' },
]
</script>
