<template>
  <!-- Mobile/tablet: the column collapses to a bar, and the same panel slides
       in from the left rather than dropping from the top. -->
  <header
    class="fixed inset-x-0 top-0 z-40 flex h-[var(--nav-h)] items-center justify-between border-b border-line bg-paper/85 px-5 backdrop-blur-md lg:hidden"
  >
    <RouterLink to="/" class="flex items-center gap-3" @click="close">
      <BrandMark />
    </RouterLink>
    <div class="flex items-center gap-1">
      <a
        :href="telHref"
        class="flex h-10 w-10 items-center justify-center text-ink-soft transition hover:text-accent"
        :aria-label="`Call ${dealer.phone}`"
      >
        <AppIcon name="phone" :size="19" />
      </a>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center text-ink transition hover:text-accent"
        :aria-expanded="open"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'menu'" :size="22" />
      </button>
    </div>
  </header>

  <transition
    enter-active-class="transition-opacity duration-300 ease-premium"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200 ease-premium"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
      @click="close"
    ></div>
  </transition>

  <!-- The column itself. Fixed at every size; only its transform changes, so
       there is a single markup path for desktop and the mobile drawer. -->
  <aside
    class="group fixed inset-y-0 left-0 z-50 w-[var(--nav-w)] max-w-[86vw] overflow-hidden bg-paper-soft transition-[transform,width] duration-500 ease-premium lg:z-30 lg:w-[var(--nav-w-collapsed)] lg:translate-x-0 lg:hover:w-[var(--nav-w)] lg:hover:shadow-lift lg:focus-within:w-[var(--nav-w)] lg:focus-within:shadow-lift"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Collapsed-state affordance: on large screens, at rest the sidebar is
         just this edge tab with a bright arrow, hinting there is more to
         reveal. Fades out on expand. -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 hidden w-8 items-center justify-center opacity-100 transition-opacity duration-300 ease-premium lg:flex lg:group-hover:opacity-0 lg:group-focus-within:opacity-0"
    >
      <AppIcon
        name="chevron"
        :size="14"
        class="-rotate-90 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.85)]"
      />
    </div>

    <!-- Outer edge hairline: a track for the rail's border plus a scroll-
         position fill, so at rest it doubles as a page-progress cue. Once
         the rail is hovered/focused open, a second full-height glow layer
         fades in over it — while browsing the open nav the line reads as a
         constant "active" indicator rather than tracking scroll, then
         reverts to the scroll cue when the rail closes again. -->
    <div class="pointer-events-none absolute inset-y-0 right-0 w-px bg-line">
      <div
        class="absolute inset-x-0 top-0 bg-white/50 transition-[height] duration-300 ease-premium"
        :style="{ height: `${scrollProgress * 100}%` }"
      ></div>
      <div
        class="absolute inset-0 bg-white opacity-0 shadow-[0_0_10px_1px_rgba(255,255,255,0.7)] transition-opacity duration-300 ease-premium lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
      ></div>
    </div>

    <!-- Fixed-width inner column: content never reflows or wraps as the
         aside itself widens/narrows on hover. At rest on large screens it is
         hidden (the aside is clipped down to the edge tab above), then
         fades in as the rail expands to reveal it. -->
    <div
      class="flex h-full w-[var(--nav-w)] flex-col opacity-100 transition-opacity duration-300 ease-premium lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
    >
    <!-- Brand -->
    <div class="border-b border-line px-6 py-6">
      <RouterLink to="/" class="flex items-center gap-3" data-intro-nav @click="close">
        <BrandMark />
      </RouterLink>
    </div>

    <!-- Primary navigation -->
    <nav class="flex-1 overflow-y-auto overscroll-contain px-4 py-7">
      <p class="u-index mb-4 px-6">Menu</p>
      <ul class="flex flex-col gap-0.5">
        <li
          v-for="(link, i) in links"
          :key="link.label"
          data-intro-nav
          :style="{ '--intro-delay': `${120 + i * 60}ms` }"
        >
          <!-- Grouped destinations become an inline accordion. A sidebar has
               the vertical room for it, so no flyout is needed. -->
          <template v-if="link.children">
            <button
              type="button"
              class="nav-link w-full"
              :class="{ 'is-active': groupActive(link) }"
              :aria-expanded="openGroup === link.label"
              @click="toggleGroup(link.label)"
            >
              <span class="flex-1 text-left">{{ link.label }}</span>
              <AppIcon
                name="chevron"
                :size="14"
                class="shrink-0 opacity-60 transition-transform duration-300 ease-premium"
                :class="{ 'rotate-180': openGroup === link.label }"
              />
            </button>
            <transition
              enter-active-class="grid transition-[grid-template-rows,opacity] duration-300 ease-premium"
              enter-from-class="grid-rows-[0fr] opacity-0"
              enter-to-class="grid-rows-[1fr] opacity-100"
              leave-active-class="grid transition-[grid-template-rows,opacity] duration-200 ease-premium"
              leave-from-class="grid-rows-[1fr] opacity-100"
              leave-to-class="grid-rows-[0fr] opacity-0"
            >
              <!-- No base `grid-rows-*` here: the transition classes own it,
                   and once they are removed the row sizes back to `auto`. -->
              <div v-if="openGroup === link.label" class="grid">
                <ul class="overflow-hidden">
                  <li v-for="child in link.children" :key="child.to">
                    <RouterLink
                      :to="child.to"
                      class="nav-sublink"
                      :class="{ 'is-active': route.path === child.to }"
                      @click="close"
                    >
                      {{ child.label }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </transition>
          </template>

          <RouterLink
            v-else
            :to="link.to!"
            class="nav-link"
            :class="{ 'is-active': route.path === link.to }"
            @click="close"
          >
            <span class="flex-1">{{ link.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Footer of the column: the stock CTA, then how to reach us. -->
    <div class="flex flex-col gap-5 border-t border-line px-6 py-6" data-intro-nav style="--intro-delay: 520ms">
      <RouterLink to="/vehicles" class="btn-primary w-full" @click="close">
        <AppIcon name="search" :size="16" />
        Browse stock
      </RouterLink>

      <div class="flex flex-col gap-2">
        <p class="u-index">Sales</p>
        <a :href="telHref" class="font-display text-xl text-ink transition hover:text-accent">
          {{ dealer.phone }}
        </a>
        <p class="flex items-center gap-2 text-xs text-ink-muted">
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="isOpenNow ? 'bg-accent' : 'bg-ink-muted'"
          ></span>
          {{ isOpenNow ? 'Open now' : 'Closed' }} · {{ todayHours }}
        </p>
      </div>
    </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import BrandMark from './BrandMark.vue'

interface NavLink {
  label: string
  to?: string
  children?: { label: string; to: string }[]
}

// The VLP is deliberately absent; the "Browse stock" CTA at the foot of the
// column is its entry point. Aftercare is grouped so eleven destinations fit
// as five top-level items.
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

const route = useRoute()
const open = ref(false)
const openGroup = ref<string | null>(null)

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

function groupActive(link: NavLink) {
  return !!link.children?.some((c) => c.to === route.path)
}

function toggleGroup(label: string) {
  openGroup.value = openGroup.value === label ? null : label
}

function close() {
  open.value = false
}

// A group containing the current page opens itself, so the active child is
// visible as soon as the column renders.
watch(
  () => route.path,
  () => {
    const group = links.find((l) => groupActive(l))
    openGroup.value = group?.label ?? null
    close()
  },
  { immediate: true },
)

// The drawer overlays the page on small screens; the page behind it must not
// scroll underneath.
watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

/* Opening hours are stored as display strings ("09:00 – 18:00"), so the live
   indicator parses them rather than duplicating the times as numbers. */
const todayEntry = computed(() => {
  const day = new Date().getDay()
  const hours = dealer.openingHours
  if (day === 0) return hours.find((h) => h.day.startsWith('Sunday')) ?? hours[0]
  if (day === 6) return hours.find((h) => h.day.startsWith('Saturday')) ?? hours[0]
  return hours[0]
})

const todayHours = computed(() => todayEntry.value?.hours ?? '')

const isOpenNow = computed(() => {
  const match = todayHours.value.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/)
  if (!match) return false
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const from = Number(match[1]) * 60 + Number(match[2])
  const to = Number(match[3]) * 60 + Number(match[4])
  return minutes >= from && minutes < to
})

// The hairline on the rail's outer edge doubles as a scroll-position
// indicator: its fill height tracks how far down the page the user is.
const scrollProgress = ref(0)

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
}

onMounted(() => {
  updateScrollProgress()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})
</script>

<style scoped>
/* A hairline grows in from the left edge on hover and stays out for the
   current page — the column's equivalent of template 01's underline. */
.nav-link {
  @apply relative flex items-center gap-3 rounded-control py-2.5 pl-6 pr-3 text-sm font-medium text-ink-soft transition-colors duration-300 ease-premium hover:text-ink;
}

.nav-link::before {
  content: '';
  @apply absolute left-0 top-1/2 h-px w-0 -translate-y-1/2 bg-accent transition-all duration-300 ease-premium;
}

.nav-link:hover::before,
.nav-link.is-active::before {
  @apply w-3.5;
}

.nav-link.is-active {
  @apply text-accent;
}

.nav-sublink {
  @apply block rounded-control py-2 pl-9 pr-3 text-[0.82rem] text-ink-muted transition-colors duration-300 ease-premium hover:text-ink;
}

.nav-sublink.is-active {
  @apply text-accent;
}
</style>
