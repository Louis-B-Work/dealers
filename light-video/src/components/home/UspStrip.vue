<template>
  <section class="border-y border-line bg-paper-soft py-16">
    <div class="container">
      <div class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(usp, i) in usps"
          :key="usp.title"
          class="flex flex-col gap-3"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <span
            class="flex h-12 w-12 items-center justify-center rounded-control bg-white text-accent shadow-soft"
          >
            <AppIcon :name="usp.icon" :size="22" />
          </span>
          <h3 class="font-display text-lg text-ink">{{ usp.title }}</h3>
          <p class="text-sm leading-relaxed text-ink-soft">{{ usp.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../shared/AppIcon.vue'

const usps = [
  {
    icon: 'shield',
    title: 'Quality assured',
    body: 'Every vehicle is multi-point inspected and comes with a comprehensive warranty for total peace of mind.',
  },
  {
    icon: 'spark',
    title: 'Tailored finance',
    body: 'Flexible, competitive finance packages arranged in-house to suit your circumstances.',
  },
  {
    icon: 'key',
    title: 'Part exchange',
    body: 'A fair, transparent valuation for your current car, settled and handled for you.',
  },
  {
    icon: 'car',
    title: 'Nationwide delivery',
    body: 'Prefer to buy from home? We deliver, fully valeted, to your door anywhere in the UK.',
  },
]
</script>
