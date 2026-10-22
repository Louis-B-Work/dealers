<template>
  <section id="eligibility" class="relative overflow-hidden bg-ink py-20 text-white md:py-28">
    <!-- decorative accent glow -->
    <div
      class="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full opacity-30"
      style="background: radial-gradient(circle, rgb(var(--c-accent-soft) / 0.55), transparent 65%)"
    ></div>

    <div class="container relative flex flex-col items-center gap-8 text-center">
      <h2 class="u-display text-3xl text-white sm:text-4xl md:text-5xl" data-reveal>
        Check your eligibility
      </h2>
      <p class="max-w-prose text-white/75" data-reveal data-reveal-delay="80">
        See your chance of approval and a personalised rate in minutes. Checking is a soft search
        and won’t affect your credit score. Going on to apply triggers a hard search, which may.
      </p>

      <ul class="flex flex-wrap justify-center gap-x-8 gap-y-3" data-reveal data-reveal-delay="140">
        <li v-for="point in points" :key="point" class="flex items-center gap-3 text-white/90">
          <AppIcon name="check" :size="18" class="shrink-0 text-accent-soft" />
          {{ point }}
        </li>
      </ul>

      <div data-reveal data-reveal-delay="200">
        <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-accent">
          Check eligibility
          <AppIcon name="arrow" :size="16" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ELIGIBILITY_URL } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'

const points = ['Decision in minutes', 'No impact on your credit score to check', '£0 deposit options available']
</script>
