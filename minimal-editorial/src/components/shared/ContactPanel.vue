<template>
  <section class="border-t border-line py-20 md:py-28">
    <div class="u-gutter flex w-full flex-col gap-14">
      <SectionHeading title="Prefer to talk it through?" center />

      <dl class="grid border-y border-ink md:grid-cols-3 md:divide-x md:divide-line">
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="group flex flex-col gap-3 border-b border-line p-8 transition-colors duration-500 ease-premium hover:bg-ink md:border-b-0"
          data-reveal
        >
          <dt class="text-[0.58rem] uppercase tracking-micro text-ink-muted group-hover:text-paper/60">Call us</dt>
          <dd class="font-display text-xl font-light text-ink group-hover:text-paper">{{ dealer.phone }}</dd>
        </a>
        <a
          :href="`mailto:${dealer.email}`"
          class="group flex flex-col gap-3 border-b border-line p-8 transition-colors duration-500 ease-premium hover:bg-ink md:border-b-0"
          data-reveal
          data-reveal-delay="80"
        >
          <dt class="text-[0.58rem] uppercase tracking-micro text-ink-muted group-hover:text-paper/60">Email us</dt>
          <dd class="truncate font-display text-xl font-light text-ink group-hover:text-paper">{{ dealer.email }}</dd>
        </a>
        <div class="flex flex-col gap-3 p-8" data-reveal data-reveal-delay="160">
          <dt class="text-[0.58rem] uppercase tracking-micro text-ink-muted">Visit us</dt>
          <dd class="text-ink">
            {{ dealer.address.line1 }}, {{ dealer.address.line2 }}
            <span class="block text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</span>
          </dd>
        </div>
      </dl>

      <div class="mx-auto w-full max-w-xl" data-reveal>
        <p class="mb-4 text-center text-[0.58rem] uppercase tracking-micro text-ink-muted">Opening hours</p>
        <ul class="flex flex-col border-t border-line text-sm">
          <li
            v-for="oh in dealer.openingHours"
            :key="oh.day"
            class="flex items-baseline justify-between border-b border-line py-3"
          >
            <span class="text-ink-muted">{{ oh.day }}</span>
            <span class="tabular-nums text-ink">{{ oh.hours }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dealer } from '../../data/dealer'
import SectionHeading from './SectionHeading.vue'
</script>
