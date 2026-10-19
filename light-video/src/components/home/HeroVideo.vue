<template>
  <section
    ref="heroEl"
    class="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-white"
  >
    <!-- Full-bleed background media (parallax) -->
    <div ref="mediaEl" class="absolute inset-0 will-change-transform">
      <video
        class="h-full w-full object-cover"
        autoplay
        muted
        playsinline
        preload="auto"
        :poster="heroPoster"
      >
        <source :src="heroVideoSrc" type="video/mp4" />
      </video>
    </div>

    <!-- Legibility overlay: flat scrim for the centred content, plus a softer
         vertical gradient so the nav and scroll cue stay readable. -->
    <div class="absolute inset-0 bg-ink/55"></div>
    <div
      class="absolute inset-0"
      style="
        background:
          linear-gradient(to bottom, rgba(10, 13, 16, 0.55) 0%, rgba(10, 13, 16, 0.1) 35%, rgba(10, 13, 16, 0.1) 65%, rgba(10, 13, 16, 0.6) 100%);
      "
    ></div>

    <!-- Own padding rather than `.container` so the search bar can exceed the
         1280px container cap while the copy keeps its own narrower measure. -->
    <div class="u-gutter relative z-10 w-full pb-24 pt-[calc(var(--nav-h)+2.5rem)]">
      <div class="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-6 text-center">
        <h1
          class="u-display max-w-3xl text-3xl text-white sm:text-4xl md:text-5xl"
          data-intro
          style="--intro-delay: 150ms"
        >
          The finest cars,<br />
          exceptionally presented.
        </h1>

        <p
          class="mx-auto max-w-xl text-lg text-white/80"
          data-intro
          style="--intro-delay: 280ms"
        >
          A handpicked collection of premium and performance vehicles, each meticulously
          prepared, honestly priced and ready to drive away.
        </p>

        <div
          class="flex flex-wrap items-center justify-center gap-4 pt-1"
          data-intro
          style="--intro-delay: 400ms"
        >
          <div class="flex items-center gap-2 text-sm text-white/85">
            <div class="flex text-accent-soft">
              <AppIcon v-for="n in 5" :key="n" name="star" :size="16" filled />
            </div>
            <span class="font-semibold text-white">{{ dealer.rating.score }}</span>
            <span class="text-white/60"
              >from {{ dealer.rating.count }} {{ dealer.rating.source }}</span
            >
          </div>
        </div>

        <div
          class="mt-6 w-full text-left"
          data-intro="plain"
          style="--intro-delay: 520ms"
        >
          <SearchBar />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import SearchBar from './SearchBar.vue'

const heroEl = ref<HTMLElement | null>(null)
const mediaEl = ref<HTMLElement | null>(null)
const heroPoster = `${import.meta.env.BASE_URL}hero-poster.svg`
// Hotlinked Pexels clip (CC0). Swap for a local /public asset if the CDN
// dependency ever needs removing. The poster covers load/failure states.
// No `loop`: it plays through once and rests on its final frame.
const heroVideoSrc =
  'https://videos.pexels.com/video-files/26542243/11957140_1920_1080_60fps.mp4'

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
