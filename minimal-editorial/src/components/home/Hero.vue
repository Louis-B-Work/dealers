<template>
  <section class="relative bg-paper">
    <!-- Full-bleed still. A photograph rather than template 02's video: the
         page is carried by whitespace, and motion above the fold would be the
         loudest thing on it. -->
    <div class="relative h-[74svh] min-h-[540px] overflow-hidden bg-ink">
      <div ref="mediaEl" class="absolute inset-0 will-change-transform">
        <img
          :src="heroImage"
          alt=""
          aria-hidden="true"
          class="h-full w-full object-cover"
          style="object-position: center 54%"
          @error="onImageError"
        />
      </div>

      <!-- The showroom shot is already dark, so the type reverses out of it
           rather than sitting behind a white veil. The scrim is kept as light
           as legibility allows: a faint flat tint across the frame, a gradient
           weighted to top and bottom, and a soft pool behind the copy block
           itself — which is the only place the contrast actually has to hold,
           and where the photograph is at its brightest. -->
      <div class="absolute inset-0 bg-ink/18"></div>
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 0.4) 0%,
            rgba(10, 10, 10, 0.1) 40%,
            rgba(10, 10, 10, 0.26) 72%,
            rgba(10, 10, 10, 0.46) 100%
          );
        "
      ></div>
      <div
        class="absolute inset-0"
        style="
          background: radial-gradient(
            64% 42% at 50% 34%,
            rgba(10, 10, 10, 0.62) 0%,
            rgba(10, 10, 10, 0.34) 52%,
            transparent 78%
          );
        "
      ></div>

      <!-- Copy sits high in the frame, leaving the lower third of the
           photograph clear before the search bar crosses it. -->
      <div
        class="u-gutter absolute inset-x-0 top-0 z-10 flex flex-col items-center pt-[calc(var(--nav-h)+5vh)] text-center sm:pt-[calc(var(--nav-h)+8vh)]"
      >
        <p class="u-eyebrow text-paper/75" data-intro="fade" style="--intro-delay: 120ms">
          Established {{ dealer.established }}
        </p>

        <!-- Explicitly two lines: left to wrap on its own the headline drops a
             single orphaned word onto the second line at most widths. -->
        <h1
          class="u-display mt-8 text-[2.1rem] text-paper sm:text-[2.8rem] lg:text-[3.4rem]"
          data-intro
          style="--intro-delay: 220ms"
        >
          <span class="block">Exceptional cars,</span>
          <span class="block">exceptionally presented</span>
        </h1>

        <p
          class="mt-8 max-w-prose text-sm leading-relaxed text-paper/85 sm:text-base"
          data-intro
          style="--intro-delay: 320ms"
        >
          A handpicked collection of premium and performance vehicles, each meticulously prepared,
          honestly priced and ready to drive away.
        </p>
      </div>
    </div>

    <!-- The search bar runs the full width of the page and straddles the foot
         of the photograph, so it belongs to both the image and the page. -->
    <div class="u-gutter relative z-20 -mt-14 w-full sm:-mt-16">
      <div data-intro="fade" style="--intro-delay: 440ms">
        <SearchWizard />
      </div>
    </div>

    <div
      class="u-gutter mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-16 text-center md:pb-20"
      data-intro="fade"
      style="--intro-delay: 560ms"
    >
      <div class="flex items-center gap-2.5 text-[0.66rem] uppercase tracking-micro text-ink-muted">
        <span class="flex text-ink">
          <AppIcon v-for="n in 5" :key="n" name="star" :size="13" filled />
        </span>
        <span class="text-ink">{{ dealer.rating.score }}</span>
        <span>from {{ dealer.rating.count }} {{ dealer.rating.source }}</span>
      </div>
      <span class="hidden h-3 w-px bg-line sm:block"></span>
      <p class="text-[0.66rem] uppercase tracking-micro text-ink-muted">
        <span class="tabular-nums text-ink">{{ total }}</span> vehicles in stock today
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { dealer } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import SearchWizard from './SearchWizard.vue'

const mediaEl = ref<HTMLElement | null>(null)
const total = vehicles.length

// Hotlinked Pexels still (CC0), requested at hero width. Swap for a local
// /public asset if the CDN dependency ever needs removing.
const heroImage =
  'https://images.pexels.com/photos/20428028/pexels-photo-20428028.jpeg?auto=compress&cs=tinysrgb&w=2400'

// If the CDN is unreachable the poster stands in, so the hero is never an
// empty box behind the headline.
function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.src.endsWith('/hero-poster.svg')) return
  img.src = `${import.meta.env.BASE_URL}hero-poster.svg`
}

let raf = 0
let reduced = false

function onScroll() {
  if (reduced || !mediaEl.value) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY, window.innerHeight)
    mediaEl.value!.style.transform = `translate3d(0, ${offset * 0.14}px, 0) scale(1.08)`
  })
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (mediaEl.value && !reduced) mediaEl.value.style.transform = 'scale(1.08)'
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>
