<template>
  <section class="u-section">
    <div class="u-gutter flex flex-col gap-10">
      <SectionHeading title="Prefer to talk it through?" center />

      <div class="grid gap-4 lg:grid-cols-3">
        <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="card card-hover flex items-center gap-4 p-6">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
            <AppIcon name="phone" :size="20" />
          </span>
          <div>
            <p class="text-xs font-semibold text-ink-muted">Call us</p>
            <p class="font-display text-lg font-semibold text-ink">{{ dealer.phone }}</p>
          </div>
        </a>

        <a :href="`mailto:${dealer.email}`" class="card card-hover flex items-center gap-4 p-6">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
            <AppIcon name="mail" :size="20" />
          </span>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-ink-muted">Email us</p>
            <p class="truncate font-display text-lg font-semibold text-ink">{{ dealer.email }}</p>
          </div>
        </a>

        <div class="card flex items-start gap-4 p-6">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
            <AppIcon name="pin" :size="20" />
          </span>
          <div>
            <p class="text-xs font-semibold text-ink-muted">Visit us</p>
            <p class="font-medium text-ink">{{ dealer.address.line1 }}, {{ dealer.address.line2 }}</p>
            <p class="text-sm text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
          </div>
        </div>
      </div>

      <div class="card mx-auto w-full max-w-xl p-6">
        <div class="mb-3 flex items-center gap-2.5">
          <AppIcon name="clock" :size="18" class="text-accent" />
          <p class="font-display text-sm font-semibold">Opening hours</p>
        </div>
        <ul class="flex flex-col divide-y divide-line text-sm">
          <li v-for="oh in dealer.openingHours" :key="oh.day" class="flex items-center justify-between py-2.5">
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
import SectionHeading from './SectionHeading.vue'
import AppIcon from './AppIcon.vue'
</script>
