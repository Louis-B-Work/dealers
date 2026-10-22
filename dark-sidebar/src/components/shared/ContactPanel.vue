<template>
  <section class="u-rule bg-paper py-20 md:py-28">
    <div class="u-gutter flex w-full flex-col gap-12">
      <SectionHeading title="Prefer to talk it through?" center />

      <div class="grid gap-5 lg:grid-cols-3">
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="panel panel-hover group flex items-center gap-4 p-6"
          data-reveal
        >
          <AppIcon name="phone" :size="20" class="shrink-0 text-accent" />
          <div>
            <p class="text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted">Call us</p>
            <p class="mt-1 font-display text-xl text-ink">{{ dealer.phone }}</p>
          </div>
        </a>

        <a
          :href="`mailto:${dealer.email}`"
          class="panel panel-hover group flex items-center gap-4 p-6"
          data-reveal
          data-reveal-delay="80"
        >
          <AppIcon name="mail" :size="20" class="shrink-0 text-accent" />
          <div class="min-w-0">
            <p class="text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted">Email us</p>
            <p class="mt-1 truncate font-display text-xl text-ink">{{ dealer.email }}</p>
          </div>
        </a>

        <div class="panel flex items-start gap-4 p-6" data-reveal data-reveal-delay="160">
          <AppIcon name="pin" :size="20" class="mt-0.5 shrink-0 text-accent" />
          <div>
            <p class="text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted">Visit us</p>
            <p class="mt-1 text-ink">{{ dealer.address.line1 }}, {{ dealer.address.line2 }}</p>
            <p class="text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
          </div>
        </div>
      </div>

      <div class="panel mx-auto w-full max-w-xl p-6" data-reveal>
        <div class="mb-4 flex items-center gap-2">
          <AppIcon name="clock" :size="17" class="text-accent" />
          <p class="text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted">Opening hours</p>
        </div>
        <ul class="flex flex-col divide-y divide-line border-y border-line text-sm">
          <li
            v-for="oh in dealer.openingHours"
            :key="oh.day"
            class="flex items-center justify-between py-3"
          >
            <span class="text-ink-muted">{{ oh.day }}</span>
            <span class="text-ink">{{ oh.hours }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dealer } from '../../data/dealer'
import SectionHeading from './SectionHeading.vue'
import AppIcon from './AppIcon.vue'
</script>
