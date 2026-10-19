<template>
  <section class="py-16 md:py-20">
    <SectionHeading
      eyebrow="Why buy from us"
      title="Built around confidence, not just cars"
      subtitle="Every part of the process is designed to remove risk and friction, so you can focus on the drive home."
      size="sm"
    />

    <ul class="mt-10 flex flex-col border-t border-line">
      <li
        v-for="(usp, i) in usps"
        :key="usp.title"
        class="group relative flex items-start gap-5 border-b border-line py-7 lg:gap-7"
        data-reveal
        :data-reveal-delay="i * 80"
      >
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink transition duration-300 ease-premium group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
        >
          <AppIcon :name="usp.icon" :size="18" />
        </span>

        <div class="flex flex-1 flex-col gap-2 pt-1">
          <h3 class="u-display-caps text-[0.82rem]">{{ usp.title }}</h3>
          <p class="max-w-prose text-sm leading-relaxed text-ink-soft">{{ usp.body }}</p>
        </div>

        <!-- The rule draws across the top of the row on hover, the same move
             the nav links and the premium tiles use. -->
        <span
          class="pointer-events-none absolute left-0 top-0 h-px w-0 bg-ink transition-all duration-500 ease-premium group-hover:w-full"
        ></span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../shared/AppIcon.vue'
import SectionHeading from '../shared/SectionHeading.vue'

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
