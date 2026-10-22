<template>
  <section id="eligibility" class="u-section">
    <div class="u-gutter-wide">
      <!-- The pitch on the left, the reassurances and the action on the right. -->
      <div class="grid items-center gap-10 rounded-block bg-paper-dark px-6 py-12 text-ink-inverse sm:px-12 md:py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div class="flex flex-col items-start gap-5">
          <h2 class="u-display text-[1.65rem] !text-ink-inverse sm:text-[2rem] md:text-[2.35rem]">
            Check your eligibility
          </h2>
          <p class="max-w-prose text-ink-inverse/75">
            See your chance of approval and a personalised rate in minutes. Checking is a soft search and won’t
            affect your credit score. Going on to apply triggers a hard search, which may.
          </p>
        </div>

        <div class="flex flex-col items-start gap-4">
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="point in points"
              :key="point"
              class="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2.5 text-sm text-ink-inverse"
            >
              <AppIcon name="check" :size="14" class="text-accent-soft" />
              {{ point }}
            </li>
          </ul>

          <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-primary mt-2">
            Check eligibility
            <AppIcon name="arrow" :size="16" />
          </a>
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
