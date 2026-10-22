<template>
  <section class="bg-paper py-20 md:py-28">
    <div class="container flex flex-col gap-12">
      <SectionHeading title="Three simple steps" center />

      <ol class="grid gap-6 md:grid-cols-3">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="flex flex-col gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
          data-reveal
          :data-reveal-delay="i * 90"
        >
          <div class="flex items-center gap-4">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
            >
              <AppIcon :name="step.icon" :size="22" />
            </span>
            <h3 class="font-display text-xl text-ink">{{ step.title }}</h3>
          </div>
          <p class="text-ink-soft">{{ step.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const steps = [
  {
    icon: 'search',
    title: 'Get a free valuation',
    body: 'Simply enter your car’s registration and mileage. It’s quick, easy and free.',
  },
  {
    icon: 'key',
    title: 'Sell or part-exchange',
    body: 'We buy cars outright and take part-exchanges, so funding your next vehicle is simple.',
  },
  {
    icon: 'pound',
    title: 'Reduce your next cost',
    body: 'Use the proceeds from your sale or part-exchange to reduce the cost of your new vehicle.',
  },
]
</script>
