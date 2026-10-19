<template>
  <section
    ref="heroEl"
    class="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-paper text-ink"
  >
    <!-- Full-bleed background media (parallax) -->
    <div ref="mediaEl" class="absolute inset-0 will-change-transform">
      <video
        class="h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        :poster="heroPoster"
      >
        <source :src="heroVideoSrc" type="video/mp4" />
      </video>
    </div>

    <!-- Legibility scrims. The content is anchored bottom-left to continue the
         reading line established by the sidebar, so the gradients are weighted
         to the bottom and left rather than flat across the frame. On narrow
         screens the copy fills most of the frame, so the flat scrim is
         stronger and the gradient's mid-band lighter stop is pulled up. -->
    <div class="absolute inset-0 bg-paper/20 lg:bg-paper/10"></div>
    <div
      class="absolute inset-0"
      style="
        background:
          linear-gradient(to top, rgba(9, 10, 12, 0.6) 0%, rgba(9, 10, 12, 0.32) 45%, rgba(9, 10, 12, 0.05) 78%, rgba(9, 10, 12, 0.2) 100%);
      "
    ></div>
    <div
      class="absolute inset-0 hidden lg:block"
      style="background: linear-gradient(to right, rgba(9, 10, 12, 0.32), transparent 55%)"
    ></div>

    <div class="u-gutter relative z-10 w-full pb-10 pt-[calc(var(--nav-h)+3rem)] lg:pb-12 lg:pt-32">
      <div class="flex w-full flex-col gap-7">
        <h1
          class="u-display w-max max-w-full text-[2.4rem] leading-[1.02] sm:text-[2.9rem] lg:whitespace-nowrap lg:text-[3.4rem] xl:text-[3.9rem]"
          data-intro
          style="--intro-delay: 150ms"
        >
          The finest cars, exceptionally presented.
        </h1>

        <p class="max-w-2xl text-base text-ink-soft sm:text-lg" data-intro style="--intro-delay: 280ms">
          A handpicked collection of premium and performance vehicles, each meticulously prepared,
          honestly priced and ready to drive away.
        </p>

        <div class="flex flex-wrap items-center gap-5" data-intro style="--intro-delay: 380ms">
          <div class="flex items-center gap-2 text-sm text-ink-soft">
            <span class="flex text-accent">
              <AppIcon v-for="n in 5" :key="n" name="star" :size="15" filled />
            </span>
            <span class="font-semibold text-ink">{{ dealer.rating.score }}</span>
            <span class="text-ink-muted"
              >from {{ dealer.rating.count }} {{ dealer.rating.source }}</span
            >
          </div>
          <span class="hidden h-4 w-px bg-line sm:block"></span>
          <p class="text-sm text-ink-muted">{{ total }} vehicles in stock today</p>
        </div>

        <div class="mt-3 w-full" data-intro="plain" style="--intro-delay: 500ms">
          <SearchBar />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { dealer } from '../../data/dealer'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import SearchBar from './SearchBar.vue'

const heroEl = ref<HTMLElement | null>(null)
const mediaEl = ref<HTMLElement | null>(null)
const total = vehicles.length
const heroPoster = `${import.meta.env.BASE_URL}hero-poster.svg`

// Hotlinked Pexels clip (CC0), resolved from the /download/video/20156198
// share link. Swap for a local /public asset if the CDN dependency ever needs
// removing. The poster covers load/failure states.
const heroVideoSrc =
  'https://videos.pexels.com/video-files/20156198/20156198-uhd_4096_2160_24fps.mp4'

let raf = 0
let reduced = false

function onScroll() {
  if (reduced || !mediaEl.value) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY, window.innerHeight)
    mediaEl.value!.style.transform = `translate3d(0, ${offset * 0.18}px, 0) scale(1.06)`
  })
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (mediaEl.value && !reduced) mediaEl.value.style.transform = 'scale(1.06)'
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>
