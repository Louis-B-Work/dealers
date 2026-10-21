<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
    <nav class="u-bleed flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Main">
      <RouterLink to="/" class="group flex flex-col leading-none" aria-label="Dealership Name home">
        <span class="whitespace-nowrap text-[0.8rem] font-medium uppercase tracking-[0.24em] sm:text-base sm:tracking-[0.34em]">Dealership Name</span>
        <span class="mt-1.5 text-[0.58rem] uppercase tracking-[0.5em] text-accent">The Collection</span>
      </RouterLink>

      <ul class="hidden items-center gap-8 xl:flex 2xl:gap-12 min-[1700px]:gap-14">
        <li v-for="link in links" :key="link.label">
          <RouterLink :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
        </li>
        <li ref="servicesRoot" class="relative">
          <button
            type="button"
            class="nav-link inline-flex items-center gap-1.5"
            :aria-expanded="servicesOpen"
            aria-controls="services-menu"
            @click="servicesOpen = !servicesOpen"
          >
            Aftercare
            <AppIcon name="chevron" :size="13" class="transition" :class="servicesOpen && 'rotate-180'" />
          </button>
          <ul
            v-if="servicesOpen"
            id="services-menu"
            class="absolute right-0 top-full mt-5 w-64 overflow-hidden rounded-panel border border-line bg-paper-soft py-2 shadow-lift"
          >
            <li v-for="service in servicePages" :key="service.slug">
              <RouterLink :to="service.path" class="block px-5 py-3 text-sm text-ink-soft transition hover:bg-surface hover:text-ink">
                {{ service.navLabel }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>

      <div class="flex items-center gap-4">
        <!-- The number only joins the bar when there is room; it is always in the menu and footer. -->
        <a :href="phoneHref" class="tabular hidden whitespace-nowrap text-sm text-ink-soft transition hover:text-accent 2xl:inline">
          {{ dealer.phone }}
        </a>
        <RouterLink :to="{ path: '/contact', query: { subject: 'Vehicle viewing' } }" class="btn-ghost hidden whitespace-nowrap px-5 py-3 sm:inline-flex">
          Book a viewing
        </RouterLink>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-control border border-ink/25 transition hover:border-accent xl:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
          <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
        </button>
      </div>
    </nav>

    <!-- A thin search bar rides under the menu on every page, so search is always one step away. -->
    <div class="border-t border-line">
      <div class="u-bleed flex h-[var(--search-h)] items-center">
        <NavSearch />
      </div>
    </div>

    <div
      v-if="menuOpen"
      id="mobile-menu"
      class="h-[calc(100svh-var(--header-h))] overflow-y-auto border-t border-line bg-paper xl:hidden"
    >
      <ul class="u-bleed py-6">
        <li v-for="link in [...links, ...serviceLinks]" :key="link.label">
          <RouterLink :to="link.to" class="block border-b border-line py-4 font-display text-2xl">
            {{ link.label }}
          </RouterLink>
        </li>
        <li class="pt-8">
          <RouterLink :to="{ path: '/contact', query: { subject: 'Vehicle viewing' } }" class="btn-accent w-full">
            Book a private viewing
          </RouterLink>
        </li>
        <li class="pt-6 text-center">
          <a :href="phoneHref" class="tabular text-ink-soft">{{ dealer.phone }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { servicePages } from '../../data/content'
import { dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import NavSearch from './NavSearch.vue'

const links = [
  { label: 'Collection', to: '/vehicles' },
  { label: 'Finance', to: '/finance' },
  { label: 'Sell', to: '/sell' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
const serviceLinks = servicePages.map((service) => ({ label: service.navLabel, to: service.path }))
const phoneHref = `tel:${dealer.phone.replace(/\s/g, '')}`

const route = useRoute()
const menuOpen = ref(false)
const servicesOpen = ref(false)
const servicesRoot = ref<HTMLElement | null>(null)
const onPointerDown = (event: PointerEvent) => {
  if (servicesOpen.value && !servicesRoot.value?.contains(event.target as Node)) servicesOpen.value = false
}
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    servicesOpen.value = false
    menuOpen.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    servicesOpen.value = false
  },
)
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

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
  @apply whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink-soft transition hover:text-ink;
}
.nav-link.router-link-active {
  @apply text-accent;
}
</style>
