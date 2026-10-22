<template>
  <div class="bg-paper pb-24 pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-3 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl">We’d love to help</h1>
        <p class="max-w-prose text-ink-soft">
          Whether you’re enquiring about a specific car, arranging a viewing or just have a
          question, our team is here and happy to help.
        </p>
      </div>
    </div>

    <div class="container grid gap-12 pt-12 lg:grid-cols-[1fr_1.1fr]">
      <!-- details -->
      <div class="flex flex-col gap-8">
        <div class="grid gap-4 sm:grid-cols-2">
          <a
            :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
            class="card-hover flex flex-col gap-3 rounded-panel border border-line bg-white p-6 shadow-soft"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-control bg-paper-soft text-accent">
              <AppIcon name="phone" :size="20" />
            </span>
            <div>
              <p class="text-xs uppercase tracking-wider text-ink-muted">Call us</p>
              <p class="font-semibold text-ink">{{ dealer.phone }}</p>
            </div>
          </a>
          <a
            :href="`mailto:${dealer.email}`"
            class="card-hover flex flex-col gap-3 rounded-panel border border-line bg-white p-6 shadow-soft"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-control bg-paper-soft text-accent">
              <AppIcon name="mail" :size="20" />
            </span>
            <div>
              <p class="text-xs uppercase tracking-wider text-ink-muted">Email us</p>
              <p class="font-semibold text-ink">{{ dealer.email }}</p>
            </div>
          </a>
        </div>

        <div class="flex flex-col gap-4 rounded-panel border border-line bg-white p-6 shadow-soft">
          <div class="flex items-start gap-3">
            <AppIcon name="pin" :size="20" class="mt-0.5 text-accent" />
            <div>
              <p class="text-xs uppercase tracking-wider text-ink-muted">Visit the showroom</p>
              <p class="font-semibold text-ink">
                {{ dealer.address.line1 }}, {{ dealer.address.line2 }}
              </p>
              <p class="text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
            </div>
          </div>

          <div class="border-t border-line pt-4">
            <div class="mb-3 flex items-center gap-2">
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

        <!-- map placeholder -->
        <div
          class="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-panel border border-line"
          style="
            background:
              repeating-linear-gradient(45deg, #f0eee9 0 14px, #f8f7f4 14px 28px);
          "
          role="img"
          aria-label="Map placeholder showing showroom location"
        >
          <div class="flex flex-col items-center gap-2 text-ink-muted">
            <AppIcon name="pin" :size="30" class="text-accent" />
            <p class="text-sm font-medium">{{ dealer.address.city }}</p>
            <p class="text-xs">Interactive map placeholder</p>
          </div>
        </div>
      </div>

      <!-- form -->
      <div class="rounded-panel border border-line bg-white p-7 shadow-soft md:p-9">
        <h2 class="font-display text-2xl text-ink">Send us a message</h2>
        <p class="mb-6 mt-1 text-sm text-ink-soft">
          Fill in the form below and a member of our team will get back to you shortly.
        </p>
        <EnquiryForm submit-label="Send message" message-placeholder="How can we help you today?" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dealer } from '../data/dealer'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import AppIcon from '../components/shared/AppIcon.vue'
</script>
