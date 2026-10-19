<template>
  <header class="sticky top-0 z-50">
    <div class="bg-ink text-paper">
      <div class="u-gutter flex items-center justify-between gap-4 py-2 text-xs">
        <p class="hidden items-center gap-2 sm:flex">
          <AppIcon name="clock" :size="14" />
          Open today 09:00 – 18:00
        </p>
        <p class="flex items-center gap-1.5">
          <AppIcon name="star" :size="13" filled class="text-orange-400" />
          <span class="tabular font-semibold">{{ dealer.rating.score }}</span>
          <span class="text-paper/70">from {{ dealer.rating.count }} {{ dealer.rating.source }}</span>
        </p>
        <a :href="phoneHref" class="flex items-center gap-1.5 font-semibold hover:text-orange-300">
          <AppIcon name="phone" :size="14" />
          {{ dealer.phone }}
        </a>
      </div>
    </div>

    <nav class="border-b border-line bg-surface/95 backdrop-blur" aria-label="Main">
      <div class="u-gutter flex h-[var(--nav-h)] items-center justify-between gap-6">
        <RouterLink to="/" class="flex items-center gap-2.5" aria-label="Dealership Name home">
          <span class="flex h-9 w-9 items-center justify-center rounded-control bg-ink text-lg font-bold text-orange-400">
            D
          </span>
          <span class="text-lg font-bold tracking-tight">{{ dealer.name }}</span>
        </RouterLink>

        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="link in links" :key="link.label">
            <RouterLink :to="link.to" class="nav-link">
              {{ link.label }}
            </RouterLink>
          </li>
          <li ref="servicesRoot" class="relative">
            <button
              type="button"
              class="nav-link inline-flex items-center gap-1"
              :aria-expanded="servicesOpen"
              aria-haspopup="true"
              @click="servicesOpen = !servicesOpen"
            >
              Services
              <AppIcon name="chevron" :size="14" />
            </button>
            <ul
              v-if="servicesOpen"
              class="absolute right-0 top-full mt-2 w-60 rounded-panel border border-line bg-surface p-2 shadow-lift"
            >
              <li v-for="service in servicePages" :key="service.slug">
                <RouterLink
                  :to="service.path"
                  class="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm hover:bg-paper-soft"
                >
                  <AppIcon :name="service.icon" :size="16" class="text-accent" />
                  {{ service.navLabel }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>

        <div class="flex items-center gap-3">
          <RouterLink to="/vehicles" class="btn-accent hidden sm:inline-flex">
            <AppIcon name="search" :size="16" />
            Browse stock
          </RouterLink>
          <button
            type="button"
            class="btn-ghost px-3 py-2.5 lg:hidden"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            @click="menuOpen = !menuOpen"
          >
            <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
            <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
          </button>
        </div>
      </div>

      <div v-if="menuOpen" id="mobile-menu" class="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-line bg-surface lg:hidden">
        <ul class="u-gutter py-3">
          <li v-for="link in [...links, ...serviceLinks]" :key="link.label">
            <RouterLink :to="link.to" class="block border-b border-line py-3 text-base font-medium">
              {{ link.label }}
            </RouterLink>
          </li>
          <li class="pt-4">
            <RouterLink to="/vehicles" class="btn-accent w-full">Browse stock</RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { dealer } from '../../data/dealer'
import { servicePages } from '../../data/content'
import AppIcon from '../shared/AppIcon.vue'

const links = [
  { label: 'Used cars', to: '/vehicles' },
  { label: 'Finance', to: '/finance' },
  { label: 'Sell your car', to: '/sell' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
const serviceLinks = servicePages.map((service) => ({ label: service.navLabel, to: service.path }))
const phoneHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const menuOpen = ref(false)
const servicesOpen = ref(false)
const servicesRoot = ref<HTMLElement | null>(null)
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    servicesOpen.value = false
  },
)

const onPointerDown = (event: PointerEvent) => {
  if (servicesOpen.value && !servicesRoot.value?.contains(event.target as Node)) servicesOpen.value = false
}
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    servicesOpen.value = false
    menuOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.nav-link {
  @apply rounded-control px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink;
}
.nav-link.router-link-active {
  @apply text-ink;
}
</style>
