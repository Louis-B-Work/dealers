<template>
  <section class="u-gutter w-full u-section">
    <ul class="grid gap-4 lg:grid-cols-3">
      <li
        v-for="promise in promises"
        :key="promise.title"
        class="flex flex-col rounded-panel p-7 sm:p-8"
        :class="promise.surface"
      >
        <span
          class="flex h-12 w-12 items-center justify-center rounded-tile"
          :class="promise.badge"
        >
          <AppIcon :name="promise.icon" :size="24" />
        </span>

        <h3 class="mt-6 font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
          {{ promise.title }}
        </h3>
        <p class="mt-3 text-sm leading-relaxed" :class="promise.bodyTone">
          {{ promise.body }}
        </p>

        <RouterLink :to="promise.to" class="mt-6 self-start" :class="promise.cta">
          {{ promise.ctaLabel }}
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '../shared/AppIcon.vue'

/**
 * The reassurance row. Flat blocks of colour rather than photography under a
 * gradient: colour does the work of being friendly here, so nothing has to
 * move, scale or fade to hold attention.
 */
const promises = [
  {
    icon: 'check-circle',
    title: '120-point check on every car',
    body: 'Mechanical inspection, HPI check and a fresh MOT before any car goes on the forecourt, and you get the report.',
    to: '/about',
    ctaLabel: 'How we prepare cars',
    surface: 'bg-accent text-accent-ink',
    badge: 'bg-white/15 text-accent-ink',
    bodyTone: 'text-accent-ink/80',
    cta: 'btn bg-white text-accent hover:-translate-y-px hover:bg-white/90',
  },
  {
    icon: 'shield',
    title: '12 months warranty included',
    body: 'Parts and labour cover as standard on every car we sell, usable at any VAT-registered garage in the country.',
    to: '/warranty',
    ctaLabel: 'What is covered',
    surface: 'bg-highlight-wash text-highlight-ink',
    badge: 'bg-highlight/15 text-highlight-ink',
    bodyTone: 'text-highlight-ink/80',
    cta: 'btn bg-highlight-ink text-highlight-wash hover:-translate-y-px hover:bg-highlight-ink/90',
  },
  {
    icon: 'handshake',
    title: 'We will settle your finance',
    body: 'Bring your old car whatever you owe on it. We pay the settlement figure direct to your lender and take it off the price.',
    to: '/sell',
    ctaLabel: 'Value my car',
    surface: 'bg-paper-dark text-ink-inverse',
    badge: 'bg-white/10 text-accent-soft',
    bodyTone: 'text-ink-inverse/70',
    cta: 'btn bg-accent text-accent-ink hover:-translate-y-px hover:bg-accent-strong',
  },
]
</script>
