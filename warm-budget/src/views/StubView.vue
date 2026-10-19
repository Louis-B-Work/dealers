<template>
  <div class="bg-paper pb-20">
    <PageHeader :title="heading" :subtitle="intro" />

    <div class="u-gutter w-full pt-12">
      <div class="card flex flex-col items-center gap-6 px-6 py-16 text-center md:px-12">
        <span
          class="flex h-14 w-14 items-center justify-center rounded-full bg-accent-wash text-accent"
        >
          <AppIcon name="spanner" :size="24" />
        </span>
        <div class="flex max-w-prose flex-col gap-2">
          <h2 class="u-display text-xl">Content coming soon</h2>
          <p class="text-sm leading-relaxed text-ink-soft">
            This page is scaffolded so the navigation is complete. The full
            {{ heading.toLowerCase() }} content is still to be written.
          </p>
        </div>
        <div class="mt-1 flex flex-wrap justify-center gap-3">
          <RouterLink to="/vehicles" class="btn-primary">Browse our cars</RouterLink>
          <RouterLink to="/contact" class="btn-ghost">Talk to us</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PageHeader from '../components/shared/PageHeader.vue'
import AppIcon from '../components/shared/AppIcon.vue'

const route = useRoute()

const heading = computed(() => (route.meta.heading as string) ?? 'Page')
const intro = computed(() => (route.meta.intro as string) ?? '')
</script>
