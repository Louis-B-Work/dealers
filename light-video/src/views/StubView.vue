<template>
  <div class="pb-24 pt-[calc(var(--nav-h)+4rem)]">
    <div class="container flex flex-col gap-10">
      <header class="flex max-w-prose flex-col gap-4">
        <span class="u-eyebrow">
          {{ eyebrow }}
        </span>
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-reveal>{{ heading }}</h1>
        <p class="text-lg text-ink-soft" data-reveal data-reveal-delay="80">{{ intro }}</p>
      </header>

      <div
        class="flex flex-col items-start gap-5 rounded-panel border border-dashed border-line bg-paper-soft px-6 py-12 md:px-10"
        data-reveal
        data-reveal-delay="160"
      >
        <span
          class="flex h-12 w-12 items-center justify-center rounded-control bg-white text-accent shadow-soft"
        >
          <AppIcon name="spark" :size="22" />
        </span>
        <div class="flex max-w-prose flex-col gap-2">
          <h2 class="u-display text-xl">Content coming soon</h2>
          <p class="text-sm text-ink-soft">
            This page is scaffolded so the navigation is complete. The full
            {{ heading.toLowerCase() }} content is still to be designed.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/vehicles" class="btn-primary">Browse cars</RouterLink>
          <RouterLink to="/contact" class="btn-ghost">Talk to us</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const route = useRoute()

const heading = computed(() => (route.meta.heading as string) ?? 'Page')
const intro = computed(() => (route.meta.intro as string) ?? '')
const eyebrow = computed(() => (route.meta.eyebrow as string) ?? 'Dealership Name')

useScrollReveal()
</script>
