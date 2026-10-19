<template>
  <span class="flex flex-col items-center leading-none">
    <span
      class="font-display font-light uppercase text-ink transition-all duration-500 ease-premium"
      :class="markClass"
      >{{ dealer.name.split(' ')[0] }}</span
    >

    <!-- The sub-line is bracketed by hairlines that stop short of the text,
         the way a wordmark's rule does — not a full-width divider. -->
    <span class="mt-2 flex w-full items-center justify-center gap-3">
      <span class="h-px flex-1 bg-ink/25"></span>
      <span class="text-[0.56rem] font-medium uppercase tracking-micro text-ink-soft">
        {{ dealer.name.split(' ').slice(1).join(' ') || 'International' }}
      </span>
      <span class="h-px flex-1 bg-ink/25"></span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../../data/dealer'

const props = withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

// Tracking tightens as the mark grows, so the optical spacing stays even
// rather than the largest size looking blown apart. The negative right margin
// cancels the trailing letter-space, which would otherwise push the mark left
// of true centre.
const markClass = computed(
  () =>
    ({
      sm: 'text-base tracking-[0.34em] -mr-[0.34em]',
      md: 'text-xl tracking-[0.3em] -mr-[0.3em]',
      lg: 'text-3xl tracking-[0.26em] -mr-[0.26em] sm:text-4xl',
    })[props.size],
)
</script>
