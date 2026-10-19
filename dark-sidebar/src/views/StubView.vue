<template>
  <div class="bg-paper pb-24">
    <PageHeader :eyebrow="eyebrow" :title="heading" :subtitle="intro" />

    <div class="u-gutter w-full pt-12">
      <div
        class="flex flex-col items-start gap-6 border border-dashed border-line bg-paper-soft px-6 py-14 md:px-12"
        data-reveal
      >
        <span class="flex h-12 w-12 items-center justify-center border border-line text-accent">
          <AppIcon name="spark" :size="21" />
        </span>
        <div class="flex max-w-prose flex-col gap-2">
          <h2 class="u-display text-2xl">Content coming soon</h2>
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
import PageHeader from '../components/shared/PageHeader.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const route = useRoute()

const heading = computed(() => (route.meta.heading as string) ?? 'Page')
const intro = computed(() => (route.meta.intro as string) ?? '')
const eyebrow = computed(() => (route.meta.eyebrow as string) ?? 'Dealership Name')

useScrollReveal()
</script>
