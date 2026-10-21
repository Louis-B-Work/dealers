<template>
  <section
    ref="root"
    class="bg-paper pt-[var(--nav-h)]"
    aria-roledescription="carousel"
    aria-label="Spotlight on the collection"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="focused = true"
    @focusout="onFocusOut"
  >
    <div class="u-gutter pb-12 pt-6 lg:pb-16 lg:pt-8">
      <div>
        <h2 class="u-eyebrow mb-3">Search the collection</h2>
        <HeroSearch />
      </div>

      <div class="mt-10 grid items-center gap-8 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <!-- The photograph sits in a frame beside the text rather than behind it. Photos
             cross-fade; only the active one is exposed to assistive tech, and only cars already
             shown, plus the next one, are rendered so the stock is not downloaded up front. -->
        <figure class="relative overflow-hidden rounded-panel border border-line bg-paper-sink lg:order-2">
          <div class="relative aspect-[16/10]">
            <template v-for="(car, index) in cars" :key="car.id">
              <img
                v-if="rendered.has(index)"
                :src="car.image"
                :alt="index === active ? `${car.year} ${car.make} ${car.model} in ${car.colour}` : ''"
                :aria-hidden="index !== active"
                class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-premium"
                :class="index === active ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'"
                :style="{ objectPosition: FOCUS[car.id] ?? '50% 50%' }"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
                width="1600"
                height="1000"
              />
            </template>
          </div>
          <figcaption class="absolute bottom-3 right-3 rounded-control bg-paper/85 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-ink-soft backdrop-blur-sm">
            {{ current.colour }}
          </figcaption>
        </figure>

        <div
          id="spot-panel"
          :key="current.id"
          role="tabpanel"
          :aria-labelledby="`spot-tab-${active}`"
          :aria-live="running ? 'off' : 'polite'"
          class="min-w-0 motion-safe:animate-[spotlight-in_1s_cubic-bezier(0.22,1,0.36,1)_both]"
        >
          <p class="u-eyebrow">
            <span class="tabular">{{ pad(active + 1) }}</span>
            <span class="mx-3 text-ink-muted">/</span>
            {{ current.badge ?? 'In the collection' }}
          </p>
          <h1 class="mt-5 font-display">
            <span class="block text-sm font-medium uppercase tracking-[0.32em] text-ink-soft sm:text-base">{{ current.make }}</span>
            <span class="mt-3 block text-5xl font-extralight leading-[0.95] tracking-[-0.04em] sm:text-6xl xl:text-7xl">{{ current.model }}</span>
          </h1>
          <p class="mt-5 text-sm text-ink-soft sm:text-base">
            {{ current.variant }}
            <span class="mx-2 text-ink-muted">·</span>
            <span class="tabular">{{ current.year }}</span>
            <span class="mx-2 text-ink-muted">·</span>
            <span class="tabular">{{ formatMileage(current.mileage) }}</span>
            <span class="hidden sm:inline">
              <span class="mx-2 text-ink-muted">·</span>
              {{ current.power }}
            </span>
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <p>
              <span class="tabular block font-display text-3xl text-accent sm:text-4xl">{{ formatCurrency(current.price) }}</span>
              <span class="tabular text-xs uppercase tracking-[0.2em] text-ink-muted">or {{ formatCurrency(current.monthlyFrom) }} a month*</span>
            </p>
            <div class="flex flex-wrap gap-3">
              <RouterLink :to="{ name: 'vehicle', params: { id: current.id } }" class="btn-accent">
                View this car
                <AppIcon name="arrow" :size="15" />
              </RouterLink>
              <RouterLink
                :to="{ path: '/contact', query: { subject: 'Vehicle viewing', vehicle: current.id } }"
                class="btn-ghost bg-black/20 backdrop-blur-sm"
              >
                Arrange a viewing
              </RouterLink>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-10 border-t border-line pt-5">
        <div class="flex items-center gap-4 sm:gap-6">
          <p class="tabular shrink-0 text-xs text-ink-muted" aria-hidden="true">
            <span class="text-ink">{{ pad(active + 1) }}</span> / {{ pad(cars.length) }}
          </p>

          <!-- One segment per car in stock; each is a tab, so the whole stock can be reached directly. -->
          <div role="tablist" aria-label="Choose a car from the stock" class="flex min-w-0 flex-1 gap-1">
            <button
              v-for="(car, index) in cars"
              :id="`spot-tab-${index}`"
              :key="car.id"
              type="button"
              role="tab"
              aria-controls="spot-panel"
              :aria-selected="index === active"
              :aria-label="`${index + 1} of ${cars.length}: ${car.make} ${car.model}`"
              :title="`${car.make} ${car.model}`"
              :tabindex="index === active ? 0 : -1"
              class="group relative h-8 min-w-0 flex-1"
              @click="go(index)"
              @keydown="onTabKey($event, index)"
            >
              <span class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-ink/20 transition group-hover:bg-ink/40">
                <!-- Viewed cars stay full; the current one fills as its time runs down; later ones are empty. -->
                <span
                  class="absolute inset-y-0 left-0 rounded-full bg-accent"
                  :class="index < active && 'opacity-50'"
                  :style="{ width: `${index < active ? 100 : index === active ? progress * 100 : 0}%` }"
                ></span>
              </span>
            </button>
          </div>

          <div class="flex shrink-0 gap-2">
            <button type="button" class="spot-control" @click="step(-1)">
              <AppIcon name="arrow-left" :size="14" />
              <span class="sr-only">Previous car</span>
            </button>
            <button v-if="canAnimate" type="button" class="spot-control" @click="paused = !paused">
              <AppIcon :name="paused ? 'play' : 'pause'" :size="14" />
              <span class="sr-only">{{ paused ? 'Play spotlight' : 'Pause spotlight' }}</span>
            </button>
            <button type="button" class="spot-control" @click="step(1)">
              <AppIcon name="arrow" :size="14" />
              <span class="sr-only">Next car</span>
            </button>
          </div>
        </div>
        <p class="mt-1 hidden text-xs uppercase tracking-[0.16em] text-ink-muted sm:block" aria-hidden="true">
          Next: <span class="text-ink-soft">{{ upcoming.make }} {{ upcoming.model }}</span>
        </p>
      </div>

      <p class="mt-6 text-[0.65rem] text-ink-muted">
        *Representative {{ REPRESENTATIVE_APR }}% APR over {{ QUOTE_TERM_MONTHS }} months with no deposit. Subject to status.
        Photography is illustrative.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCurrency, formatMileage, sortVehicles } from '../../composables/useCollectionSearch'
import { QUOTE_TERM_MONTHS, REPRESENTATIVE_APR } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import HeroSearch from './HeroSearch.vue'

const INTERVAL = 7000
// The spotlight cycles through the whole stock. The strongest, calmest photographs lead;
// the rest follow in curated order.
const LEAD = ['aston-db11-2022', 'bentley-continental-2020', 'porsche-911-2021', 'range-rover-2023', 'mercedes-amg-gt-2022']
// Crop focus per photo, so the front of each car stays in frame at wide ratios.
const FOCUS: Record<string, string> = { 'aston-db11-2022': '85% 55%', 'range-rover-2023': '40% 60%' }
const rank = (id: string) => (LEAD.includes(id) ? LEAD.indexOf(id) : LEAD.length)
const cars = sortVehicles(vehicles, 'featured').sort((a, b) => rank(a.id) - rank(b.id))

const active = ref(0)
const current = computed(() => cars[active.value])
const upcoming = computed(() => cars[(active.value + 1) % cars.length])
const pad = (n: number) => String(n).padStart(2, '0')

// Photos render on first use and stay for the cross-fade; the next one is fetched ahead.
const rendered = reactive(new Set<number>([0, 1]))
watch(active, (index) => {
  rendered.add(index)
  rendered.add((index + 1) % cars.length)
})

const paused = ref(false)
const hovering = ref(false)
const focused = ref(false)
const canAnimate = ref(false)
const inView = ref(true)
// Advance only when the hero is on screen and nobody is reading or interacting,
// and never for reduced motion.
const running = computed(
  () => canAnimate.value && inView.value && !paused.value && !hovering.value && !focused.value,
)

// Time on the current car, from 0 to 1. A frame loop advances it only while running,
// so pausing freezes the bar where it is and resuming carries on from there.
const progress = ref(0)
let frame = 0
let last = 0
function tick(now: number) {
  if (running.value && last) {
    progress.value = Math.min(1, progress.value + (now - last) / INTERVAL)
    if (progress.value >= 1) step(1)
  }
  last = now
  frame = window.requestAnimationFrame(tick)
}
function go(index: number) {
  active.value = index
  // Without autoplay (reduced motion) there is no countdown, so the current bar shows full.
  progress.value = canAnimate.value ? 0 : 1
}
function step(delta: number) {
  go((active.value + delta + cars.length) % cars.length)
}

function onTabKey(event: KeyboardEvent, index: number) {
  const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: cars.length - 1 }
  if (!(event.key in keys)) return
  event.preventDefault()
  const next = (keys[event.key] + cars.length) % cars.length
  go(next)
  document.getElementById(`spot-tab-${next}`)?.focus()
}
function onFocusOut(event: FocusEvent) {
  const section = event.currentTarget as HTMLElement
  if (!section.contains(event.relatedTarget as Node)) focused.value = false
}

const root = ref<HTMLElement | null>(null)
let visibility: IntersectionObserver | undefined

onMounted(() => {
  canAnimate.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!canAnimate.value) progress.value = 1
  if (root.value && 'IntersectionObserver' in window) {
    visibility = new IntersectionObserver(([entry]) => {
      inView.value = entry.isIntersecting
    }, { threshold: 0.35 })
    visibility.observe(root.value)
  }
  if (canAnimate.value) frame = window.requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  window.cancelAnimationFrame(frame)
  visibility?.disconnect()
})
</script>

<style scoped>
.spot-control {
  @apply flex h-10 w-10 items-center justify-center rounded-control border border-ink/25 text-ink-soft transition hover:border-accent hover:text-accent;
}
</style>
