<template>
  <section class="bg-paper py-20 md:py-28">
    <div class="container flex flex-col gap-12">
      <SectionHeading title="Prefer to talk it through?" center />

      <div class="grid gap-6 lg:grid-cols-3">
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="card-hover flex items-center gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
          data-reveal
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
          >
            <AppIcon name="phone" :size="20" />
          </span>
          <div>
            <p class="text-xs uppercase tracking-wider text-ink-muted">Call us</p>
            <p class="font-semibold text-ink">{{ dealer.phone }}</p>
          </div>
        </a>

        <a
          :href="`mailto:${dealer.email}`"
          class="card-hover flex items-center gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
          data-reveal
          data-reveal-delay="90"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
          >
            <AppIcon name="mail" :size="20" />
          </span>
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-wider text-ink-muted">Email us</p>
            <p class="truncate font-semibold text-ink">{{ dealer.email }}</p>
          </div>
        </a>

        <div
          class="flex items-start gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
          data-reveal
          data-reveal-delay="180"
        >
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
          >
            <AppIcon name="pin" :size="20" />
          </span>
          <div>
            <p class="text-xs uppercase tracking-wider text-ink-muted">Visit us</p>
            <p class="font-semibold text-ink">
              {{ dealer.address.line1 }}, {{ dealer.address.line2 }}
            </p>
            <p class="text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
          </div>
        </div>
      </div>

      <div
        class="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-panel border border-line bg-paper-soft p-6"
        data-reveal
      >
        <div class="flex items-center gap-2">
          <AppIcon name="clock" :size="18" class="text-accent" />
          <p class="text-xs uppercase tracking-wider text-ink-muted">Opening hours</p>
        </div>
        <ul class="flex flex-col gap-2 text-sm">
          <li
            v-for="oh in dealer.openingHours"
            :key="oh.day"
            class="flex items-center justify-between border-b border-line pb-2 last:border-0"
          >
            <span class="text-ink-soft">{{ oh.day }}</span>
            <span class="font-medium text-ink">{{ oh.hours }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dealer } from '../../data/dealer'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'
</script>
