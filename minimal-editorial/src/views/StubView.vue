<template>
  <div class="bg-paper pb-24">
    <PageHeader :eyebrow="eyebrow" :title="heading" :subtitle="intro" />

    <div class="u-gutter w-full pt-16">
      <div
        class="flex flex-col items-center gap-7 border border-line px-6 py-20 text-center md:px-12"
        data-reveal
      >
        <span class="flex h-12 w-12 items-center justify-center border border-line text-ink">
          <AppIcon name="spark" :size="20" />
        </span>
        <div class="flex max-w-prose flex-col gap-3">
          <h2 class="u-display-caps text-base">Content coming soon</h2>
          <p class="text-sm leading-relaxed text-ink-soft">
            This page is scaffolded so the navigation is complete. The full
            {{ heading.toLowerCase() }} content is still to be designed.
          </p>
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-4">
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
import PageHeader from '../components/shared/PageHeader.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const route = useRoute()

const heading = computed(() => (route.meta.heading as string) ?? 'Page')
const intro = computed(() => (route.meta.intro as string) ?? '')
const eyebrow = computed(() => (route.meta.eyebrow as string) ?? 'Dealership Name')

useScrollReveal()
</script>
