<template>
  <section class="py-16 md:py-24">
    <div class="container flex flex-col gap-10">
      <SectionHeading title="Prefer to talk it through?" center />

      <!-- Four tiles of different weights, locked into one rectangle. -->
      <div class="grid gap-4 md:grid-cols-4">
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="card-hover flex flex-col justify-between gap-8 rounded-panel bg-accent p-6 text-accent-ink shadow-soft md:col-span-2"
          data-reveal
        >
          <AppIcon name="phone" :size="26" />
          <div>
            <p class="text-xs font-bold uppercase tracking-micro text-accent-ink/70">Call us</p>
            <p class="font-display text-3xl font-extrabold">{{ dealer.phone }}</p>
          </div>
        </a>

        <a
          :href="`mailto:${dealer.email}`"
          class="card-hover flex flex-col justify-between gap-8 rounded-panel border border-line bg-surface p-6 shadow-soft md:col-span-2"
          data-reveal
          data-reveal-delay="80"
        >
          <AppIcon name="mail" :size="26" class="text-accent" />
          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-micro text-ink-muted">Email us</p>
            <p class="truncate font-display text-xl font-extrabold text-ink">{{ dealer.email }}</p>
          </div>
        </a>

        <div class="flex flex-col justify-between gap-6 rounded-panel bg-paper-sink p-6 md:col-span-2" data-reveal data-reveal-delay="120">
          <AppIcon name="pin" :size="26" class="text-accent" />
          <div>
            <p class="text-xs font-bold uppercase tracking-micro text-ink-muted">Visit us</p>
            <p class="font-display text-lg font-extrabold text-ink">{{ dealer.address.line1 }}, {{ dealer.address.line2 }}</p>
            <p class="text-sm text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
          </div>
        </div>

        <div class="rounded-panel border border-line bg-surface p-6 shadow-soft md:col-span-2" data-reveal data-reveal-delay="160">
          <div class="mb-3 flex items-center gap-2">
            <AppIcon name="clock" :size="18" class="text-accent" />
            <p class="text-xs font-bold uppercase tracking-micro text-ink-muted">Opening hours</p>
          </div>
          <ul class="flex flex-col divide-y divide-line text-sm">
            <li v-for="oh in dealer.openingHours" :key="oh.day" class="flex items-center justify-between py-2">
              <span class="text-ink-soft">{{ oh.day }}</span>
              <span class="font-semibold text-ink">{{ oh.hours }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dealer } from '../../data/dealer'
import SectionHeading from './SectionHeading.vue'
import AppIcon from './AppIcon.vue'
</script>
