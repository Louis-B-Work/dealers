<template>
  <footer class="border-t border-line bg-paper-soft text-ink-soft">
    <!-- Full-bleed, aligned to the same edges as every section in the
         content column. -->
    <div class="u-gutter w-full py-16 md:py-20">
      <!-- Four content columns: brand, Explore, Services, Visit. Opening
           hours ride under the address so the track list stays even. -->
      <div class="grid gap-x-10 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <!-- Brand -->
        <div class="flex flex-col gap-5">
          <RouterLink to="/">
            <BrandMark />
          </RouterLink>
          <p class="max-w-xs text-sm leading-relaxed">
            {{ dealer.tagline }} Established {{ dealer.established }}.
          </p>
          <div class="flex gap-2">
            <a
              v-for="s in dealer.socials"
              :key="s.label"
              :href="s.href"
              class="flex h-9 w-9 items-center justify-center rounded-control border border-line text-xs font-semibold text-ink-soft transition hover:border-accent hover:text-accent"
              :aria-label="s.label"
            >
              <AppIcon v-if="socialIcon(s.label)" :name="socialIcon(s.label)!" :size="16" />
              <span v-else>{{ s.label.charAt(0) }}</span>
            </a>
          </div>
        </div>

        <!-- Explore -->
        <nav class="flex flex-col gap-3.5">
          <h3 class="u-index">Explore</h3>
          <RouterLink v-for="l in exploreLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Services -->
        <nav class="flex flex-col gap-3.5">
          <h3 class="u-index">Services</h3>
          <RouterLink v-for="l in serviceLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Visit & contact -->
        <div class="flex flex-col gap-3.5">
          <h3 class="u-index">Visit us</h3>
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
          <ul class="mt-2 flex flex-col gap-2 text-sm">
            <li
              v-for="oh in dealer.openingHours"
              :key="oh.day"
              class="flex items-center justify-between gap-4 border-b border-line pb-2 last:border-0"
            >
              <span class="text-ink-muted">{{ oh.day }}</span>
              <span>{{ oh.hours }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Regulated disclosure block. Kept whole and above the legal strip so
           it reads as a statement rather than small print in a link row. -->
      <div class="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-xs leading-relaxed text-ink-muted">
        <p class="max-w-4xl">
          {{ brokerDisclosure }} We can introduce you to a limited number of lenders who may be
          able to offer you finance facilities for your purchase. Finance is subject to status.
          Terms and conditions apply. Applicants must be 18 or over.
        </p>
        <p class="max-w-4xl">{{ representativeExample }}</p>
      </div>

      <div
        class="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-muted sm:flex-row sm:items-center"
      >
        <p>© {{ year }} {{ dealer.name }}. All rights reserved.</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <RouterLink to="/privacy" class="footer-link text-xs">Privacy Policy</RouterLink>
          <a href="#" class="footer-link text-xs">Terms &amp; Conditions</a>
          <a href="#" class="footer-link text-xs">Cookie Preferences</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { dealer, brokerDisclosure, representativeExample } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import BrandMark from './BrandMark.vue'

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
  @apply text-sm text-ink-soft transition-colors duration-300 hover:text-accent;
}
</style>
