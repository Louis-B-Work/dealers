<template>
  <footer class="mt-20 bg-ink text-paper">
    <div class="u-gutter grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <p class="text-lg font-bold">{{ dealer.name }}</p>
        <p class="mt-3 max-w-xs text-sm text-paper/70">{{ dealer.tagline }}</p>
        <ul class="mt-5 flex gap-2">
          <li v-for="social in dealer.socials" :key="social.label">
            <a
              :href="social.href"
              class="flex h-9 w-9 items-center justify-center rounded-control border border-paper/20 hover:border-paper/60"
            >
              <AppIcon :name="social.label.toLowerCase()" :size="16" />
              <span class="sr-only">{{ social.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xs font-semibold uppercase tracking-micro text-paper/60">Buy</h2>
        <ul class="mt-4 grid gap-2.5 text-sm">
          <li><RouterLink to="/vehicles" class="hover:text-orange-300">All used cars</RouterLink></li>
          <li><RouterLink to="/finance" class="hover:text-orange-300">Finance</RouterLink></li>
          <li><RouterLink to="/sell" class="hover:text-orange-300">Sell or part-exchange</RouterLink></li>
        </ul>
      </div>

      <div>
        <h2 class="text-xs font-semibold uppercase tracking-micro text-paper/60">Care</h2>
        <ul class="mt-4 grid gap-2.5 text-sm">
          <li v-for="service in servicePages" :key="service.slug">
            <RouterLink :to="service.path" class="hover:text-orange-300">{{ service.navLabel }}</RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xs font-semibold uppercase tracking-micro text-paper/60">Visit us</h2>
        <address class="mt-4 grid gap-2.5 text-sm not-italic text-paper/80">
          <span>
            {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
            {{ dealer.address.city }}, {{ dealer.address.postcode }}
          </span>
          <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="hover:text-orange-300">{{ dealer.phone }}</a>
          <a :href="`mailto:${dealer.email}`" class="hover:text-orange-300">{{ dealer.email }}</a>
        </address>
      </div>
    </div>

    <div class="border-t border-paper/15">
      <div class="u-gutter flex flex-col gap-2 py-5 text-xs text-paper/60 sm:flex-row sm:justify-between">
        <p>© 2026 {{ dealer.name }}. A design preview, not a live dealership.</p>
        <p>
          {{ brokerDisclosure }}
          <RouterLink to="/privacy" class="underline underline-offset-2 hover:text-paper">Privacy</RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { brokerDisclosure, dealer } from '../../data/dealer'
import { servicePages } from '../../data/content'
import AppIcon from '../shared/AppIcon.vue'
</script>
