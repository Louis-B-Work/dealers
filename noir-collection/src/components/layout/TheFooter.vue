<template>
  <footer class="border-t border-line bg-paper-sink">
    <div class="u-gutter grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
      <div>
        <p class="text-lg font-medium uppercase tracking-[0.34em]">Dealership Name</p>
        <p class="mt-2 text-[0.62rem] uppercase tracking-[0.42em] text-accent">The Collection</p>
        <p class="mt-6 max-w-xs text-sm leading-relaxed text-ink-muted">{{ dealer.tagline }} Viewings by appointment.</p>
        <ul class="mt-6 flex gap-2">
          <li v-for="social in dealer.socials" :key="social.label">
            <a :href="social.href" class="flex h-10 w-10 items-center justify-center rounded-control border border-line text-ink-soft transition hover:border-accent hover:text-accent">
              <AppIcon :name="social.label.toLowerCase()" :size="16" />
              <span class="sr-only">{{ social.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="u-eyebrow">The house</h2>
        <ul class="mt-5 grid gap-3 text-sm text-ink-soft">
          <li><RouterLink to="/vehicles" class="hover:text-ink">The Collection</RouterLink></li>
          <li><RouterLink to="/finance" class="hover:text-ink">Finance</RouterLink></li>
          <li><RouterLink to="/sell" class="hover:text-ink">Sell or part-exchange</RouterLink></li>
          <li><RouterLink to="/about" class="hover:text-ink">About</RouterLink></li>
        </ul>
      </div>

      <div>
        <h2 class="u-eyebrow">Aftercare</h2>
        <ul class="mt-5 grid gap-3 text-sm text-ink-soft">
          <li v-for="service in servicePages" :key="service.slug">
            <RouterLink :to="service.path" class="hover:text-ink">{{ service.navLabel }}</RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="u-eyebrow">The showroom</h2>
        <address class="mt-5 grid gap-3 text-sm not-italic text-ink-soft">
          <span>
            {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
            {{ dealer.address.city }}, {{ dealer.address.postcode }}
          </span>
          <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="tabular hover:text-ink">{{ dealer.phone }}</a>
          <a :href="`mailto:${dealer.email}`" class="hover:text-ink">{{ dealer.email }}</a>
        </address>
      </div>
    </div>

    <div class="border-t border-line">
      <div class="u-gutter flex flex-col gap-3 py-6 text-xs text-ink-muted md:flex-row md:justify-between">
        <p>© 2026 {{ dealer.name }}. A design preview, not a trading dealership.</p>
        <p class="flex flex-wrap gap-x-4 gap-y-1">
          <span>{{ brokerDisclosure }}</span>
          <RouterLink to="/privacy" class="underline underline-offset-4 hover:text-ink">Privacy</RouterLink>
          <a :href="creditsHref" class="underline underline-offset-4 hover:text-ink">Photo credits</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { servicePages } from '../../data/content'
import { brokerDisclosure, dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'

const creditsHref = `${import.meta.env.BASE_URL}cars/CREDITS.md`
</script>
