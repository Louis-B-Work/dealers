<template>
  <div class="bg-paper pb-24">
    <PageHeader
      eyebrow="Get in touch"
      title="We’d love to help"
      subtitle="Whether you’re enquiring about a specific car, arranging a viewing or just have a question, our team is here and happy to help."
    />

    <div class="u-gutter grid w-full gap-14 pt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <!-- details -->
      <div class="flex flex-col gap-6">
        <div class="grid gap-6 sm:grid-cols-2">
          <a
            :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
            class="group flex flex-col gap-5 border border-line bg-paper p-6 transition duration-500 ease-premium hover:border-ink hover:bg-ink"
          >
            <AppIcon name="phone" :size="19" class="text-ink group-hover:text-paper" />
            <div>
              <p class="text-[0.58rem] uppercase tracking-micro text-ink-muted group-hover:text-paper/60">
                Call us
              </p>
              <p class="mt-2 font-display text-lg text-ink group-hover:text-paper">
                {{ dealer.phone }}
              </p>
            </div>
          </a>
          <a
            :href="`mailto:${dealer.email}`"
            class="group flex flex-col gap-5 border border-line bg-paper p-6 transition duration-500 ease-premium hover:border-ink hover:bg-ink"
          >
            <AppIcon name="mail" :size="19" class="text-ink group-hover:text-paper" />
            <div>
              <p class="text-[0.58rem] uppercase tracking-micro text-ink-muted group-hover:text-paper/60">
                Email us
              </p>
              <p class="mt-2 truncate font-display text-lg text-ink group-hover:text-paper">
                {{ dealer.email }}
              </p>
            </div>
          </a>
        </div>

        <div class="flex flex-col border border-line">
          <div class="flex items-start gap-3.5 p-6">
            <AppIcon name="pin" :size="18" class="mt-0.5 shrink-0 text-ink" />
            <div>
              <p class="text-[0.58rem] uppercase tracking-micro text-ink-muted">
                Visit the showroom
              </p>
              <p class="mt-2 text-ink">{{ dealer.address.line1 }}, {{ dealer.address.line2 }}</p>
              <p class="text-ink-soft">{{ dealer.address.city }}, {{ dealer.address.postcode }}</p>
            </div>
          </div>

          <div class="border-t border-line p-6">
            <div class="mb-5 flex items-center gap-2.5">
              <AppIcon name="clock" :size="16" class="text-ink" />
              <p class="text-[0.58rem] uppercase tracking-micro text-ink-muted">Opening hours</p>
            </div>
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

        <!-- map placeholder -->
        <div
          class="relative flex aspect-[16/9] items-center justify-center overflow-hidden border border-line"
          style="
            background: repeating-linear-gradient(
              45deg,
              rgb(250, 250, 250) 0 14px,
              rgb(244, 244, 244) 14px 28px
            );
          "
          role="img"
          aria-label="Map placeholder showing showroom location"
        >
          <div class="flex flex-col items-center gap-2.5 text-ink-muted">
            <AppIcon name="pin" :size="26" class="text-ink" />
            <p class="text-sm text-ink-soft">{{ dealer.address.city }}</p>
            <p class="text-xs">Interactive map placeholder</p>
          </div>
        </div>
      </div>

      <!-- form -->
      <div class="border border-line p-7 md:p-9">
        <h2 class="u-display-caps text-base">Send us a message</h2>
        <p class="mb-8 mt-3 text-sm text-ink-soft">
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
import PageHeader from '../components/shared/PageHeader.vue'
import AppIcon from '../components/shared/AppIcon.vue'
</script>
