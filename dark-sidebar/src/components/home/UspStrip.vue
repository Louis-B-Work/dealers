<template>
  <!-- An asymmetric split rather than 01's even four-up card row: a pitch on
       the left, a divided list of promises on the right that borrows the
       same hover-rule language as the side nav links. -->
  <section class="border-y border-line bg-paper-soft py-20 md:py-28">
    <div class="u-gutter grid w-full gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div class="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
        <SectionHeading
          eyebrow="Why buy from us"
          title="Built around confidence, not just cars."
          subtitle="Every part of the process is designed to remove risk and friction, so you can focus on the drive home."
        />
      </div>

      <ul class="flex flex-col divide-y divide-line border-y border-line">
        <li
          v-for="(usp, i) in usps"
          :key="usp.title"
          class="usp-row group relative flex items-start gap-5 py-7 lg:gap-7 lg:py-8"
          data-reveal
          :data-reveal-delay="i * 80"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 ease-premium group-hover:border-white group-hover:text-white"
          >
            <AppIcon :name="usp.icon" :size="18" />
          </span>

          <div class="flex flex-1 flex-col gap-1.5 pt-1">
            <h3 class="font-display text-lg text-ink">{{ usp.title }}</h3>
            <p class="max-w-md text-sm leading-relaxed text-ink-soft">{{ usp.body }}</p>
          </div>

          <AppIcon
            name="arrow"
            :size="18"
            class="mt-2 shrink-0 -translate-x-2 text-ink-muted opacity-0 transition-all duration-300 ease-premium group-hover:translate-x-0 group-hover:text-white group-hover:opacity-100"
          />

          <span
            class="pointer-events-none absolute left-0 top-0 h-px w-0 bg-white transition-all duration-300 ease-premium group-hover:w-full"
          ></span>
        </li>
      </ul>
    </div>
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
