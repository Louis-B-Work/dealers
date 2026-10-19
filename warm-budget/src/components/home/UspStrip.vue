<template>
  <!-- Inverted against the cream page so the reassurance row reads as a band
       rather than four more pale cards on a pale background. The card surface
       is a lift off the slab rather than another colour, which keeps it
       legible without introducing a third tone. -->
  <section class="bg-paper-dark py-12 sm:py-14">
    <div class="u-gutter w-full">
      <ul class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <li
          v-for="usp in usps"
          :key="usp.title"
          class="flex flex-col gap-2.5 rounded-panel border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-start sm:gap-3.5"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-white/10 text-accent-soft"
          >
            <AppIcon :name="usp.icon" :size="21" />
          </span>
          <div class="min-w-0">
            <h3 class="font-display text-sm font-semibold text-ink-inverse">{{ usp.title }}</h3>
            <p class="mt-0.5 text-sm leading-relaxed text-ink-inverse/70">{{ usp.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../shared/AppIcon.vue'

const usps = [
  {
    icon: 'check-circle',
    title: '120-point check',
    body: 'Every car inspected and prepared before it goes on sale.',
  },
  {
    icon: 'shield',
    title: 'Warranty included',
    body: 'Cover as standard on every car, with extended plans available.',
  },
  {
    icon: 'wallet',
    title: 'Finance in minutes',
    body: 'A decision usually within the hour. All credit histories considered.',
  },
  {
    icon: 'handshake',
    title: 'Part-exchange welcome',
    body: 'We will value your old car and settle any outstanding finance.',
  },
]
</script>
