<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b bg-paper transition-[height,border-color] duration-500 ease-premium"
    :class="scrolled ? 'border-line' : 'border-transparent'"
  >
    <div
      class="u-gutter grid w-full grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ease-premium"
      :class="scrolled ? 'h-[var(--nav-h-scrolled)]' : 'h-[var(--nav-h)]'"
    >
      <!-- Left: half the links on desktop, the menu toggle below that.
           The split breaks at xl rather than lg: two link groups plus a
           centred wordmark and a phone number need ~1280px before they stop
           crowding each other. -->
      <nav class="hidden items-center gap-7 justify-self-start xl:flex 2xl:gap-10">
        <RouterLink
          v-for="(link, i) in leftLinks"
          :key="link.label"
          :to="link.to"
          active-class="is-current"
          class="nav-link group"
          data-intro-nav
          :style="{ '--intro-delay': `${140 + i * 70}ms` }"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-2 left-0 h-px w-0 bg-ink transition-all duration-300 ease-premium group-hover:w-full group-[.is-current]:h-[2px] group-[.is-current]:w-full"
          ></span>
        </RouterLink>
      </nav>

      <button
        type="button"
        class="-ml-2 flex h-10 w-10 items-center justify-center justify-self-start text-ink xl:hidden"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        data-intro-nav
        @click="menuOpen = !menuOpen"
      >
        <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="22" />
      </button>

      <!-- Centre: the wordmark, which is the anchor the whole bar is built
           around. It sits in its own grid column so the two link groups can
           be uneven without shifting it off centre. -->
      <RouterLink
        to="/"
        class="justify-self-center px-4"
        aria-label="Home"
        data-intro="track"
        @click="closeMenu"
      >
        <BrandMark :size="scrolled ? 'sm' : 'md'" />
      </RouterLink>

      <!-- Right: the remaining links plus the phone number. -->
      <div class="flex items-center gap-7 justify-self-end 2xl:gap-10">
        <nav class="hidden items-center gap-7 xl:flex 2xl:gap-10">
          <template v-for="(link, i) in rightLinks" :key="link.label">
            <NavDropdown
              v-if="link.children"
              :label="link.label"
              :items="link.children"
              data-intro-nav
              :style="{ '--intro-delay': `${140 + (leftLinks.length + i) * 70}ms` }"
            />
            <RouterLink
              v-else
              :to="link.to!"
              active-class="is-current"
          class="nav-link group"
              data-intro-nav
              :style="{ '--intro-delay': `${140 + (leftLinks.length + i) * 70}ms` }"
            >
              {{ link.label }}
              <span
                class="absolute -bottom-2 left-0 h-px w-0 bg-ink transition-all duration-300 ease-premium group-hover:w-full group-[.is-current]:h-[2px] group-[.is-current]:w-full"
              ></span>
            </RouterLink>
          </template>
        </nav>

        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="flex items-center gap-2.5 whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-micro text-ink transition-opacity duration-300 hover:opacity-60"
          data-intro-nav
          style="--intro-delay: 560ms"
        >
          <AppIcon name="phone" :size="15" />
          <span class="hidden sm:inline">{{ dealer.phone }}</span>
        </a>
      </div>
    </div>

    <!-- Mobile drawer -->
    <transition
      enter-active-class="transition duration-300 ease-premium"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-premium"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="border-t border-line bg-paper xl:hidden">
        <div class="u-gutter flex max-h-[70vh] w-full flex-col overflow-y-auto py-2">
          <template v-for="link in allLinks" :key="link.label">
            <!-- Grouped items become an accordion; a flyout has nowhere to go here. -->
            <div v-if="link.children" class="flex flex-col border-b border-line">
              <button
                type="button"
                class="drawer-link flex items-center justify-between"
                :aria-expanded="openGroup === link.label"
                @click="toggleGroup(link.label)"
              >
                {{ link.label }}
                <AppIcon
                  name="chevron"
                  :size="14"
                  class="transition-transform duration-200 ease-premium"
                  :class="{ 'rotate-180': openGroup === link.label }"
                />
              </button>
              <div v-if="openGroup === link.label" class="flex flex-col pb-2 pl-5">
                <RouterLink
                  v-for="child in link.children"
                  :key="child.to"
                  :to="child.to"
                  class="drawer-link py-3 text-ink-muted"
                  @click="closeMenu"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </div>
            <RouterLink
              v-else
              :to="link.to!"
              class="drawer-link border-b border-line"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </template>

          <RouterLink to="/vehicles" class="btn-primary my-5" @click="closeMenu">
            View all stock
          </RouterLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dealer } from '../../data/dealer'
import { useStickyNav } from '../../composables/useStickyNav'
import AppIcon from '../shared/AppIcon.vue'
import BrandMark from './BrandMark.vue'
import NavDropdown from './NavDropdown.vue'

interface NavLink {
  label: string
  to?: string
  children?: { label: string; to: string }[]
}

// Split either side of the centred wordmark: stock and money on the left,
// aftercare and the dealership itself on the right. Aftercare is grouped so
// the right-hand side stays to three items and the mark stays centred.
const leftLinks: { label: string; to: string }[] = [
  { label: 'Current Stock', to: '/vehicles' },
  { label: 'Finance', to: '/finance' },
  { label: 'Sell Your Car', to: '/sell' },
]

const rightLinks: NavLink[] = [
  {
    label: 'Services',
    children: [
      { label: 'MOT', to: '/mot' },
      { label: 'Warranty', to: '/warranty' },
      { label: 'Body Shop', to: '/body-shop' },
      { label: 'Breakdown', to: '/breakdown' },
    ],
  },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const allLinks: NavLink[] = [...leftLinks, ...rightLinks]

// The bar is solid white at every scroll position — the hero is light, so
// there is no transparent-over-dark state to manage. Scrolling only condenses
// the bar and brings in the bottom hairline.
const { scrolled } = useStickyNav()
const route = useRoute()
const menuOpen = ref(false)
const openGroup = ref<string | null>(null)

function toggleGroup(label: string) {
  openGroup.value = openGroup.value === label ? null : label
}

function closeMenu() {
  menuOpen.value = false
  openGroup.value = null
}

watch(() => route.fullPath, closeMenu)
</script>

<style scoped>
.nav-link {
  @apply relative flex items-center whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-micro text-ink-soft transition-colors duration-300 ease-premium hover:text-ink;
}

/* The current page: darker, heavier, and a drawn 2px rule (see the span in the template). */
.nav-link.is-current {
  @apply font-semibold text-ink;
}

.drawer-link {
  @apply relative py-4 text-[0.7rem] font-medium uppercase tracking-micro text-ink-muted transition-colors duration-200;
}

.drawer-link.router-link-exact-active {
  @apply pl-4 font-semibold text-ink;
}

.drawer-link.router-link-exact-active::before {
  content: '';
  @apply absolute bottom-3 left-0 top-3 w-0.5 bg-ink;
}
</style>
