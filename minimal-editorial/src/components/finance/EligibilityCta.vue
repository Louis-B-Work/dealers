<template>
  <section id="eligibility" class="bg-ink py-24 text-paper md:py-32">
    <div class="u-gutter flex w-full flex-col items-center gap-10 text-center">
      <h2 class="u-display-caps max-w-3xl text-2xl !text-paper sm:text-3xl" data-reveal>Check your eligibility</h2>
      <p class="max-w-prose text-paper/70" data-reveal data-reveal-delay="80">
        See your chance of approval and a personalised rate in minutes. Checking is a soft search and won’t affect
        your credit score. Going on to apply triggers a hard search, which may.
      </p>

      <ul class="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[0.68rem] uppercase tracking-micro text-paper/80" data-reveal data-reveal-delay="140">
        <li v-for="point in points" :key="point" class="flex items-center gap-3">
          <AppIcon name="check" :size="13" class="shrink-0" />
          {{ point }}
        </li>
      </ul>

      <div data-reveal data-reveal-delay="200">
        <a
          :href="ELIGIBILITY_URL"
          target="_blank"
          rel="noopener"
          class="btn border border-paper bg-paper text-ink hover:bg-transparent hover:text-paper"
        >
          Check eligibility
          <AppIcon name="arrow" :size="14" />
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
