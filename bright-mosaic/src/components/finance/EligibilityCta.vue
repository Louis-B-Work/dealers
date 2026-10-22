<template>
  <section id="eligibility" class="py-16 md:py-24">
    <div class="container">
      <!-- A three-tile strip: the pitch, then the two reassurances, then the action. -->
      <div class="grid gap-4 md:grid-cols-3" data-reveal>
        <div class="flex flex-col justify-between gap-6 rounded-panel bg-ink p-8 text-paper md:col-span-2 md:row-span-2">
          <div class="flex flex-col gap-4">
            <h2 class="u-display text-3xl !text-paper sm:text-4xl md:text-[2.75rem]">Check your eligibility</h2>
            <p class="max-w-prose text-lg text-paper/75">
              See your chance of approval and a personalised rate in minutes. Checking is a soft search and won’t
              affect your credit score. Going on to apply triggers a hard search, which may.
            </p>
          </div>
          <div>
            <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn bg-accent text-accent-ink hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-lift">
              Check eligibility
              <AppIcon name="arrow" :size="16" />
            </a>
          </div>
        </div>

        <div
          v-for="(point, i) in points"
          :key="point"
          class="flex items-center gap-4 rounded-panel p-6"
          :class="i === 0 ? 'bg-paper-sink' : 'border border-line bg-surface shadow-soft'"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
            <AppIcon name="check" :size="20" />
          </span>
          <p class="font-display text-base font-extrabold text-ink">{{ point }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ELIGIBILITY_URL } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'

const points = ['Decision in minutes', 'No impact on your credit score to check', '£0 deposit options available']
</script>
