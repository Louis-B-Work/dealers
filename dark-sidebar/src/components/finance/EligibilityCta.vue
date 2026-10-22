<template>
  <section id="eligibility" class="relative overflow-hidden bg-paper py-20 md:py-28">
    <div
      class="pointer-events-none absolute -right-40 top-1/2 h-[620px] w-[620px] -translate-y-1/2 opacity-60"
      style="background: radial-gradient(circle, rgb(var(--c-accent) / 0.12), transparent 62%)"
    ></div>

    <div class="u-gutter relative flex w-full flex-col items-center gap-8 text-center">
      <SectionHeading
        title="Check your eligibility"
        subtitle="See your chance of approval and a personalised rate in minutes. Checking is a soft search and won’t affect your credit score. Going on to apply triggers a hard search, which may."
        center
      />

      <ul class="flex flex-wrap justify-center gap-x-8 gap-y-3" data-reveal data-reveal-delay="140">
        <li v-for="point in points" :key="point" class="flex items-center gap-3 text-sm text-ink-soft">
          <AppIcon name="check" :size="15" class="shrink-0 text-accent" />
          {{ point }}
        </li>
      </ul>

      <div data-reveal data-reveal-delay="200">
        <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-primary">
          Check eligibility
          <AppIcon name="arrow" :size="16" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ELIGIBILITY_URL } from '../../data/dealer'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const points = ['Decision in minutes', 'No impact on your credit score to check', '£0 deposit options available']
</script>
