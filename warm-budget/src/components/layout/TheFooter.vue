<template>
  <footer class="bg-paper pt-8">
    <div class="rounded-t-block bg-paper-dark text-ink-inverse">
      <div class="u-gutter-wide py-14 lg:py-16">
        <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <BrandMark tone="dark" size="lg" />
            <p class="mt-4 max-w-xs text-sm leading-relaxed text-ink-inverse/70">
              {{ dealer.tagline }} Friendly, no-pressure service since {{ dealer.established }}.
            </p>

            <p class="mt-5 flex items-center gap-2 text-sm">
              <AppIcon name="star" :size="16" filled class="text-highlight" />
              <span class="font-semibold">{{ dealer.rating.score }} out of 5</span>
              <span class="text-ink-inverse/60">
                from {{ dealer.rating.count.toLocaleString('en-GB') }} {{ dealer.rating.source }}
              </span>
            </p>

            <ul class="mt-5 flex flex-wrap gap-2">
              <li v-for="social in dealer.socials" :key="social.label">
                <a :href="social.href" class="social-link">{{ social.label }}</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-heading">Browse</h2>
            <ul class="mt-4 flex flex-col gap-2.5">
              <li v-for="link in browseLinks" :key="link.to">
                <RouterLink :to="link.to" class="footer-link">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-heading">Servicing</h2>
            <ul class="mt-4 flex flex-col gap-2.5">
              <li v-for="link in serviceLinks" :key="link.to">
                <RouterLink :to="link.to" class="footer-link">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-heading">Come and see us</h2>
            <address class="mt-4 not-italic text-sm leading-relaxed text-ink-inverse/70">
              {{ dealer.address.line1 }}<br />
              {{ dealer.address.line2 }}<br />
              {{ dealer.address.city }}<br />
              {{ dealer.address.postcode }}
            </address>

            <ul class="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="footer-link inline-flex items-center gap-2">
                  <AppIcon name="phone" :size="15" />
                  {{ dealer.phone }}
                </a>
              </li>
              <li>
                <a :href="`mailto:${dealer.email}`" class="footer-link inline-flex items-center gap-2">
                  <AppIcon name="mail" :size="15" />
                  {{ dealer.email }}
                </a>
              </li>
            </ul>

            <dl class="mt-5 flex flex-col gap-1.5 text-sm text-ink-inverse/70">
              <div v-for="slot in dealer.openingHours" :key="slot.day" class="flex justify-between gap-4">
                <dt>{{ slot.day }}</dt>
                <dd class="shrink-0 font-medium text-ink-inverse/90">{{ slot.hours }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Regulated wording sitewide: broker disclosure, the limited panel
             statement and the representative example, all from one source so
             they can never drift from the calculator or the cards. -->
        <div class="mt-12 border-t border-white/10 pt-8">
          <div class="flex flex-col gap-3 text-[0.6875rem] leading-relaxed text-ink-inverse/55">
            <p>{{ brokerDisclosure }} {{ lenderPanelDisclosure }}</p>
            <p>{{ representativeExample }}</p>
          </div>

          <div
            class="mt-8 flex flex-col gap-3 text-xs text-ink-inverse/55 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>© {{ year }} {{ dealer.name }}. All rights reserved.</p>
            <RouterLink to="/privacy" class="footer-link">Privacy policy</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  brokerDisclosure,
  dealer,
  lenderPanelDisclosure,
  representativeExample,
} from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import BrandMark from './BrandMark.vue'

const year = new Date().getFullYear()

const browseLinks = [
  { label: 'Used cars', to: '/vehicles' },
  { label: 'Car finance', to: '/finance' },
  { label: 'Sell your car', to: '/sell' },
  { label: 'About us', to: '/about' },
  { label: 'Contact us', to: '/contact' },
]

const serviceLinks = [
  { label: 'MOT & servicing', to: '/mot' },
  { label: 'Body shop', to: '/body-shop' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Breakdown cover', to: '/breakdown' },
]
</script>

<style scoped>
.footer-heading {
  @apply text-xs font-semibold uppercase tracking-wide text-accent-soft;
}

.footer-link {
  @apply text-sm text-ink-inverse/70 transition-colors duration-150 ease-out hover:text-ink-inverse;
}

.social-link {
  @apply inline-flex rounded-control border border-white/20 px-3 py-1.5 text-xs font-medium text-ink-inverse/75 transition-colors duration-150 ease-out hover:border-white/50 hover:text-ink-inverse;
}
</style>
