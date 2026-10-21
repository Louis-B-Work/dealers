<template>
  <header class="border-b border-line bg-surface">
    <div class="u-gutter py-10 lg:py-14">
      <nav aria-label="Breadcrumb" class="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <RouterLink to="/" class="hover:text-ink">Home</RouterLink>
        <span aria-hidden="true">/</span>
        <template v-for="crumb in crumbs" :key="crumb.label">
          <RouterLink v-if="crumb.to" :to="crumb.to" class="hover:text-ink">{{ crumb.label }}</RouterLink>
          <span aria-hidden="true" v-if="crumb.to">/</span>
        </template>
        <span aria-current="page" class="text-ink">{{ current }}</span>
      </nav>
      <p v-if="eyebrow" class="u-eyebrow mb-3">{{ eyebrow }}</p>
      <h1 class="u-h1 max-w-3xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">{{ subtitle }}</p>
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    title: string
    /** Last breadcrumb, which is the page itself. */
    current: string
    eyebrow?: string
    subtitle?: string
    crumbs?: { label: string; to?: RouteLocationRaw }[]
  }>(),
  { eyebrow: '', subtitle: '', crumbs: () => [] },
)
</script>
