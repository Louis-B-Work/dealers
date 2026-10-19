<template>
  <div class="bg-paper pb-20">
    <PageHeader
      title="Come and say hello"
      subtitle="Pop in, give us a ring or send us a message, whichever suits. No appointment needed and the kettle is always on."
    />

    <div class="u-gutter grid w-full items-start gap-6 pt-10 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
      <div class="flex flex-col gap-5">
        <div class="card p-5 sm:p-7">
          <h2 class="font-display text-lg font-semibold">Where to find us</h2>

          <address class="mt-4 not-italic text-sm leading-relaxed text-ink-soft">
            {{ dealer.address.line1 }}<br />
            {{ dealer.address.line2 }}<br />
            {{ dealer.address.city }}<br />
            {{ dealer.address.postcode }}
          </address>

          <ul class="mt-5 flex flex-col gap-3">
            <li>
              <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="contact-row">
                <span class="contact-icon"><AppIcon name="phone" :size="18" /></span>
                <span>
                  <span class="block text-xs text-ink-muted">Call the sales team</span>
                  <span class="block font-semibold text-ink">{{ dealer.phone }}</span>
                </span>
              </a>
            </li>
            <li>
              <a :href="`mailto:${dealer.email}`" class="contact-row">
                <span class="contact-icon"><AppIcon name="mail" :size="18" /></span>
                <span>
                  <span class="block text-xs text-ink-muted">Email us</span>
                  <span class="block font-semibold text-ink">{{ dealer.email }}</span>
                </span>
              </a>
            </li>
          </ul>

          <!-- Map stand-in. A real embed needs an API key and a live address,
               neither of which a template has. -->
          <div
            class="mt-5 flex aspect-[16/9] items-center justify-center rounded-panel border border-line bg-paper-sink text-ink-muted"
            role="img"
            :aria-label="`Map showing ${dealer.name}`"
          >
            <span class="flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <AppIcon name="pin" :size="28" />
              {{ dealer.address.postcode }}
            </span>
          </div>
        </div>

        <div class="card p-5 sm:p-7">
          <h2 class="flex items-center gap-2 font-display text-lg font-semibold">
            <AppIcon name="clock" :size="19" class="text-accent" />
            Opening hours
          </h2>
          <dl class="mt-4 flex flex-col">
            <div
              v-for="slot in dealer.openingHours"
              :key="slot.day"
              class="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-b-0"
            >
              <dt class="text-ink-soft">{{ slot.day }}</dt>
              <dd class="font-semibold text-ink">{{ slot.hours }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="card p-5 sm:p-7">
        <h2 class="font-display text-lg font-semibold">Send us a message</h2>
        <p class="mt-1 text-sm text-ink-soft">
          Tell us what you are looking for and roughly what you want to spend, and we will come back
          with a shortlist.
        </p>
        <div class="mt-5">
          <EnquiryForm
            message-placeholder="I'm after a small automatic for around £150 a month…"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dealer } from '../data/dealer'
import AppIcon from '../components/shared/AppIcon.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import PageHeader from '../components/shared/PageHeader.vue'
</script>

<style scoped>
.contact-row {
  @apply flex items-center gap-3 rounded-tile border border-line px-4 py-3 text-sm transition-colors duration-150 ease-out hover:border-ink/25;
}

.contact-icon {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-accent-wash text-accent;
}
</style>
