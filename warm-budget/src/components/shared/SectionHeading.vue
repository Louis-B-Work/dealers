<template>
  <div :class="['flex flex-col', center ? 'items-center text-center' : 'items-start']">
    <h2 class="u-display" :class="[sizeClass, center ? 'max-w-3xl' : 'max-w-2xl']">
      {{ title }}
    </h2>

    <p v-if="subtitle" class="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    center?: boolean
    size?: 'sm' | 'md'
  }>(),
  { center: false, size: 'md' },
)

const sizeClass = computed(() =>
  props.size === 'sm'
    ? 'text-xl sm:text-2xl'
    : 'text-[1.65rem] sm:text-[2rem] md:text-[2.35rem]',
)
</script>
