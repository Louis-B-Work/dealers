<template>
  <span class="inline-flex items-center gap-2.5">
    <span
      class="flex items-center justify-center rounded-tile bg-accent text-accent-ink"
      :class="markSize"
      aria-hidden="true"
    >
      <AppIcon name="car" :size="iconSize" />
    </span>
    <span class="flex flex-col leading-none">
      <span class="font-display font-semibold tracking-[-0.02em]" :class="[wordSize, toneClass]">
        {{ dealer.name }}
      </span>
      <span
        v-if="showStrapline"
        class="mt-1 text-[0.625rem] font-medium uppercase tracking-wider"
        :class="tone === 'dark' ? 'text-ink-inverse/55' : 'text-ink-muted'"
      >
        Est. {{ dealer.established }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    /** `dark` is for the hero block and the footer, where the page inverts. */
    tone?: 'light' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    showStrapline?: boolean
  }>(),
  { tone: 'light', size: 'md', showStrapline: true },
)

const toneClass = computed(() => (props.tone === 'dark' ? 'text-ink-inverse' : 'text-ink'))

const markSize = computed(
  () => ({ sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' })[props.size],
)

const iconSize = computed(() => ({ sm: 18, md: 22, lg: 26 })[props.size])

const wordSize = computed(
  () => ({ sm: 'text-sm', md: 'text-base', lg: 'text-lg' })[props.size],
)
</script>
