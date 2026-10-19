<template>
  <footer class="border-t border-line bg-paper text-ink-soft">
    <!-- The mark is centred and given room of its own above the columns,
         echoing the nav rather than sitting in a brand column like 01/02. -->
    <div class="u-gutter w-full border-b border-line py-16 text-center md:py-20">
      <RouterLink to="/" class="inline-block" aria-label="Home">
        <BrandMark size="lg" />
      </RouterLink>
      <p class="mx-auto mt-8 max-w-prose text-sm leading-relaxed text-ink-soft">
        {{ dealer.tagline }} Established {{ dealer.established }}.
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <a
          v-for="s in dealer.socials"
          :key="s.label"
          :href="s.href"
          class="flex h-10 w-10 items-center justify-center border border-line text-[0.65rem] font-medium uppercase tracking-wider text-ink-soft transition duration-300 ease-premium hover:border-ink hover:bg-ink hover:text-paper"
          :aria-label="s.label"
        >
          <!-- The mark where we have one, the initial where we do not, so a
               platform we have not drawn yet is never an empty square. -->
          <AppIcon v-if="socialIcon(s.label)" :name="socialIcon(s.label)!" :size="17" />
          <span v-else>{{ s.label.charAt(0) }}</span>
        </a>
      </div>
    </div>

    <div class="u-gutter w-full py-16 md:py-20">
      <div class="grid gap-x-12 gap-y-12 md:grid-cols-3">
        <!-- Explore -->
        <nav class="flex flex-col gap-4">
          <h3 class="u-eyebrow">Explore</h3>
          <RouterLink v-for="l in exploreLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Services -->
        <nav class="flex flex-col gap-4">
          <h3 class="u-eyebrow">Services</h3>
          <RouterLink v-for="l in serviceLinks" :key="l.to" :to="l.to" class="footer-link">
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- Visit & contact -->
        <div class="flex flex-col gap-4">
          <h3 class="u-eyebrow">Visit us</h3>
          <a
            :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
            class="footer-link flex items-center gap-2.5"
          >
            <AppIcon name="phone" :size="15" />{{ dealer.phone }}
          </a>
          <a :href="`mailto:${dealer.email}`" class="footer-link flex items-center gap-2.5">
            <AppIcon name="mail" :size="15" />{{ dealer.email }}
          </a>
          <p class="flex items-start gap-2.5 text-sm leading-relaxed">
            <AppIcon name="pin" :size="15" class="mt-1 shrink-0" />
            <span>
              {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
              {{ dealer.address.city }}, {{ dealer.address.postcode }}
            </span>
          </p>
          <ul class="mt-2 flex flex-col gap-2.5 text-sm">
            <li
              v-for="oh in dealer.openingHours"
              :key="oh.day"
              class="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 last:border-0"
            >
              <span class="text-ink-muted">{{ oh.day }}</span>
              <span class="tabular-nums">{{ oh.hours }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Regulated disclosure block. Kept whole and above the legal strip so
           it reads as a statement rather than small print in a link row. -->
      <div
        class="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs leading-relaxed text-ink-muted"
      >
        <p class="max-w-4xl">
          {{ brokerDisclosure }} We can introduce you to a limited number of lenders who may be able
          to offer you finance facilities for your purchase. Finance is subject to status. Terms and
          conditions apply. Applicants must be 18 or over.
        </p>
        <p class="max-w-4xl">{{ representativeExample }}</p>
      </div>

      <div
        class="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-muted sm:flex-row sm:items-center"
      >
        <p>© {{ year }} {{ dealer.name }}. All rights reserved.</p>
        <div class="flex flex-wrap items-center gap-x-8 gap-y-2">
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

/**
 * Social labels come from the dealer record as free text, so they are matched
 * case-insensitively to an icon name rather than assumed to be a key.
 */
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
  @apply text-sm text-ink-soft transition-colors duration-300 hover:text-ink;
}
</style>
