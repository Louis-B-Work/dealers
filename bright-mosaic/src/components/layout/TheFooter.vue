<template>
  <footer class="bg-ink text-white/70">
    <!-- Full-bleed, aligned to the same edges as the nav and card grid. -->
    <div class="u-gutter w-full py-16 md:py-20">
      <!-- Five content columns: brand, Explore, Services, Get in touch,
           Opening hours. The track list must match, or the last block wraps
           to a second row and leaves the right side empty. -->
      <div class="grid gap-x-8 gap-y-12 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr_1.1fr]">
        <!-- Brand -->
        <div class="flex flex-col gap-5">
          <RouterLink to="/" class="flex items-center gap-2.5 text-white">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-control bg-white font-display text-lg text-ink"
              >D</span
            >
            <span class="flex flex-col leading-none">
              <span class="font-display text-lg tracking-tight">Dealership</span>
              <span class="text-[0.6rem] font-semibold uppercase tracking-micro opacity-70"
                >Name</span
              >
            </span>
          </RouterLink>
          <p class="max-w-xs text-sm leading-relaxed">
            {{ dealer.tagline }} Established {{ dealer.established }}.
          </p>
          <div class="flex gap-3">
            <a
              v-for="s in dealer.socials"
              :key="s.label"
              :href="s.href"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 transition hover:border-deal hover:bg-deal hover:text-deal-ink"
              :aria-label="s.label"
            >
              <AppIcon v-if="socialIcon(s.label)" :name="socialIcon(s.label)!" :size="16" />
              <span v-else>{{ s.label.charAt(0) }}</span>
            </a>
          </div>
        </div>

        <!-- Explore -->
        <nav class="flex flex-col gap-3.5">
          <h3 class="text-xs font-semibold uppercase tracking-micro text-white">Explore</h3>
          <RouterLink v-for="l in exploreLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Services -->
        <nav class="flex flex-col gap-3.5">
          <h3 class="text-xs font-semibold uppercase tracking-micro text-white">Services</h3>
          <RouterLink v-for="l in serviceLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Contact -->
        <div class="flex flex-col gap-3.5">
          <h3 class="text-xs font-semibold uppercase tracking-micro text-white">Get in touch</h3>
          <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="footer-link flex items-center gap-2.5">
            <AppIcon name="phone" :size="16" />{{ dealer.phone }}
          </a>
          <a :href="`mailto:${dealer.email}`" class="footer-link flex items-center gap-2.5">
            <AppIcon name="mail" :size="16" />{{ dealer.email }}
          </a>
          <p class="flex items-start gap-2.5 text-sm">
            <AppIcon name="pin" :size="16" class="mt-0.5 shrink-0" />
            <span>
              {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
              {{ dealer.address.city }}, {{ dealer.address.postcode }}
            </span>
          </p>
        </div>

        <!-- Hours -->
        <div class="flex flex-col gap-3.5">
          <h3 class="text-xs font-semibold uppercase tracking-micro text-white">Opening hours</h3>
          <ul class="flex flex-col gap-2 text-sm">
            <li
              v-for="oh in dealer.openingHours"
              :key="oh.day"
              class="flex items-center justify-between gap-4 border-b border-white/10 pb-2"
            >
              <span>{{ oh.day }}</span>
              <span class="text-white/90">{{ oh.hours }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row"
      >
        <p>© {{ year }} {{ dealer.name }}. All rights reserved.</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#" class="footer-link underline underline-offset-2">Privacy Policy</a>
          <a href="#" class="footer-link">Terms &amp; Conditions</a>
          <a href="#" class="footer-link">Cookie Preferences</a>
        </div>
        <p class="text-white/40">
          {{ brokerDisclosure }} Finance subject to status.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { dealer, brokerDisclosure } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'

const year = new Date().getFullYear()

// Social labels are free text in the dealer record, so match them case-insensitively.
const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  youtube: 'youtube',
  linkedin: 'linkedin',
  tiktok: 'tiktok',
  x: 'x',
  twitter: 'x',
}

function socialIcon(label: string): string | undefined {
  return SOCIAL_ICONS[label.trim().toLowerCase()]
}

const exploreLinks = [
  { label: 'Browse all vehicles', to: '/vehicles' },
  { label: 'Finance', to: '/finance' },
  { label: 'Sell your car', to: '/sell' },
  { label: 'About us', to: '/about' },
  { label: 'Contact us', to: '/contact' },
]

const serviceLinks = [
  { label: 'MOT', to: '/mot' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Body Shop', to: '/body-shop' },
  { label: 'Breakdown', to: '/breakdown' },
]
</script>

<style scoped>
.footer-link {
  @apply text-sm text-white/70 transition-colors duration-300 hover:text-deal;
}
</style>
