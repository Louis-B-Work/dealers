<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium"
    :class="solid ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-transparent'"
  >
    <div
      class="u-gutter flex w-full items-center justify-between transition-all duration-500 ease-premium"
      :class="solid ? 'h-[68px]' : 'h-[84px]'"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-2.5"
        :class="onDark ? 'text-white' : 'text-ink'"
        data-intro-nav
        @click="closeMenu"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-control font-display text-lg"
          :class="onDark ? 'bg-white text-ink' : 'bg-ink text-white'"
          >D</span
        >
        <span class="flex flex-col leading-none">
          <span class="font-display text-lg tracking-tight">Dealership</span>
          <span class="text-[0.6rem] font-semibold uppercase tracking-micro opacity-70">Name</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-8 lg:flex xl:gap-12">
        <template v-for="(link, i) in links" :key="link.label">
          <NavDropdown
            v-if="link.children"
            :label="link.label"
            :items="link.children"
            :on-dark="onDark"
            data-intro-nav
            :style="{ '--intro-delay': `${120 + i * 70}ms` }"
          />
          <RouterLink
            v-else
            :to="link.to!"
            class="group relative text-sm font-medium transition-colors"
            :class="onDark ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-ink'"
            data-intro-nav
            :style="{ '--intro-delay': `${120 + i * 70}ms` }"
          >
            {{ link.label }}
            <span
              class="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 ease-premium group-hover:w-full"
            ></span>
          </RouterLink>
        </template>
      </nav>

      <div class="flex items-center gap-3">
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="hidden items-center gap-2 text-sm font-semibold sm:flex"
          :class="onDark ? 'text-white' : 'text-ink'"
          data-intro-nav
          style="--intro-delay: 480ms"
        >
          <AppIcon name="phone" :size="17" />
          {{ dealer.phone }}
        </a>
        <RouterLink
          to="/vehicles"
          class="hidden btn-accent px-5 py-2.5 md:inline-flex"
          data-intro-nav
          style="--intro-delay: 560ms"
        >
          Browse
        </RouterLink>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-control lg:hidden"
          :class="onDark ? 'text-white' : 'text-ink'"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          data-intro-nav
          style="--intro-delay: 240ms"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <transition
      enter-active-class="transition duration-300 ease-premium"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-premium"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="border-t border-line bg-white lg:hidden">
        <div class="u-gutter flex w-full flex-col gap-1 py-4">
          <template v-for="link in links" :key="link.label">
            <!-- Grouped items become an accordion; a flyout has nowhere to go here. -->
            <div v-if="link.children" class="flex flex-col">
              <button
                type="button"
                class="flex items-center justify-between rounded-control px-3 py-3 text-base font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink"
                :aria-expanded="openGroup === link.label"
                @click="toggleGroup(link.label)"
              >
                {{ link.label }}
                <AppIcon
                  name="chevron"
                  :size="16"
                  class="transition-transform duration-200 ease-premium"
                  :class="{ 'rotate-180': openGroup === link.label }"
                />
              </button>
              <div v-if="openGroup === link.label" class="flex flex-col gap-1 pb-1 pl-3">
                <RouterLink
                  v-for="child in link.children"
                  :key="child.to"
                  :to="child.to"
                  class="rounded-control px-3 py-2.5 text-[0.95rem] text-ink-soft transition hover:bg-paper-soft hover:text-ink"
                  @click="closeMenu"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </div>
            <RouterLink
              v-else
              :to="link.to!"
              class="rounded-control px-3 py-3 text-base font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </template>
          <RouterLink to="/vehicles" class="btn-accent mt-2 md:hidden" @click="closeMenu">
            Browse
          </RouterLink>
          <a
            :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
            class="mt-2 flex items-center gap-2 rounded-control px-3 py-3 text-base font-semibold text-ink"
          >
            <AppIcon name="phone" :size="18" />{{ dealer.phone }}
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dealer } from '../../data/dealer'
import { useStickyNav } from '../../composables/useStickyNav'
import AppIcon from '../shared/AppIcon.vue'
import NavDropdown from './NavDropdown.vue'

interface NavLink {
  label: string
  to?: string
  children?: { label: string; to: string }[]
}

// The VLP is deliberately absent; the "Browse" CTA is its entry point.
// Aftercare is grouped so eleven destinations fit as six top-level items.
const links: NavLink[] = [
  { label: 'Finance', to: '/finance' },
  { label: 'Sell Your Car', to: '/sell' },
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

const { scrolled } = useStickyNav()
const route = useRoute()
const menuOpen = ref(false)
const openGroup = ref<string | null>(null)

// Only the home page has a dark hero behind a transparent nav.
const hasDarkHero = computed(() => route.name === 'home')
const solid = computed(() => scrolled.value || menuOpen.value || !hasDarkHero.value)
const onDark = computed(() => hasDarkHero.value && !solid.value)

function toggleGroup(label: string) {
  openGroup.value = openGroup.value === label ? null : label
}

function closeMenu() {
  menuOpen.value = false
  openGroup.value = null
}

watch(() => route.fullPath, closeMenu)
</script>
