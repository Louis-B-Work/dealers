<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper-soft transition-shadow duration-150 ease-out"
    :class="scrolled ? 'shadow-bar' : ''"
  >
    <!-- One fixed height, and a brand mark that does not resize. The bar used
         to condense on scroll, but the swap fired 24px down the page and
         snapped the brand between two sizes, which read as a jump. Only the
         shadow reacts to scroll. -->
    <div class="u-gutter-wide flex h-[var(--nav-h)] items-center justify-between gap-4">
      <RouterLink to="/" class="shrink-0" aria-label="Go to the homepage">
        <BrandMark />
      </RouterLink>

      <!-- Full link row needs about 1024px before it starts crowding the
           phone button, so the drawer takes over below `lg`. -->
      <nav class="hidden items-center gap-0.5 lg:flex" aria-label="Main">
        <RouterLink v-for="link in primaryLinks" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </RouterLink>

        <NavDropdown label="Servicing" :items="serviceLinks" />

        <RouterLink v-for="link in trailingLinks" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex shrink-0 items-center gap-2">
        <!-- Icon only until there is room for the number: on a phone the
             label was squeezing the brand mark. -->
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          :aria-label="`Call us on ${dealer.phone}`"
          class="btn-primary !px-3 sm:!px-5"
        >
          <AppIcon name="phone" :size="16" />
          <span class="hidden sm:inline">{{ dealer.phone }}</span>
        </a>

        <button
          type="button"
          class="btn-ghost !px-3 lg:hidden"
          :aria-expanded="drawerOpen"
          aria-controls="mobile-menu"
          :aria-label="drawerOpen ? 'Close menu' : 'Open menu'"
          @click="drawerOpen = !drawerOpen"
        >
          <AppIcon :name="drawerOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <!-- Drawer. Rendered in its final state rather than slid in: the template
         has no entrance animation anywhere. -->
    <div
      v-if="drawerOpen"
      id="mobile-menu"
      class="max-h-[calc(100vh-var(--nav-h))] overflow-y-auto border-t border-line bg-paper-soft lg:hidden"
    >
      <nav class="u-gutter-wide flex flex-col py-4" aria-label="Main (mobile)">
        <RouterLink
          v-for="link in [...primaryLinks, ...serviceLinks, ...trailingLinks]"
          :key="link.to"
          :to="link.to"
          class="drawer-link"
        >
          {{ link.label }}
        </RouterLink>

        <a :href="`mailto:${dealer.email}`" class="drawer-link">{{ dealer.email }}</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { dealer } from '../../data/dealer'
import { useStickyNav } from '../../composables/useStickyNav'
import AppIcon from '../shared/AppIcon.vue'
import BrandMark from './BrandMark.vue'
import NavDropdown from './NavDropdown.vue'

const route = useRoute()
const { scrolled } = useStickyNav()
const drawerOpen = ref(false)

const primaryLinks = [
  { label: 'Used cars', to: '/vehicles' },
  { label: 'Car finance', to: '/finance' },
  { label: 'Sell your car', to: '/sell' },
]

const serviceLinks = [
  { label: 'MOT & servicing', to: '/mot' },
  { label: 'Body shop', to: '/body-shop' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Breakdown cover', to: '/breakdown' },
]

const trailingLinks = [
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)
</script>

<style scoped>
.nav-link {
  @apply whitespace-nowrap rounded-control px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 ease-out hover:bg-paper-sink hover:text-ink;
}

.nav-link.router-link-active {
  @apply text-accent;
}

.drawer-link {
  @apply rounded-tile px-3 py-3 text-sm font-medium text-ink-soft transition-colors duration-150 ease-out hover:bg-paper-sink hover:text-ink;
}

.drawer-link.router-link-active {
  @apply text-accent;
}
</style>
