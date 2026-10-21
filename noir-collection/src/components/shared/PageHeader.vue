<template>
  <header class="relative isolate overflow-hidden border-b border-line pt-[var(--nav-h)]">
    <img v-if="image" :src="image" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
    <div v-if="image" class="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/85 to-paper/40"></div>
    <div class="u-gutter py-14 lg:py-20">
      <nav aria-label="Breadcrumb" class="mb-8 flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-muted">
        <RouterLink to="/" class="hover:text-ink">Home</RouterLink>
        <span aria-hidden="true">/</span>
        <template v-for="crumb in crumbs" :key="crumb.label">
          <RouterLink v-if="crumb.to" :to="crumb.to" class="hover:text-ink">{{ crumb.label }}</RouterLink>
          <span v-if="crumb.to" aria-hidden="true">/</span>
        </template>
        <span aria-current="page" class="text-ink-soft">{{ current }}</span>
      </nav>
      <p v-if="eyebrow" class="u-eyebrow mb-5">{{ eyebrow }}</p>
      <h1 class="u-h1 max-w-4xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{{ subtitle }}</p>
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
    /** Optional faint photograph behind the heading. */
    image?: string
    crumbs?: { label: string; to?: RouteLocationRaw }[]
  }>(),
  { eyebrow: '', subtitle: '', image: '', crumbs: () => [] },
)
</script>
