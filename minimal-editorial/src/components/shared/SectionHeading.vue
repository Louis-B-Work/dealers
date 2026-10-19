<template>
  <div :class="['flex flex-col', center ? 'items-center text-center' : 'items-start']">
    <p v-if="eyebrow" class="u-eyebrow" data-reveal>{{ eyebrow }}</p>

    <h2
      class="u-display-caps mt-5"
      :class="[sizeClass, center ? 'max-w-3xl' : 'max-w-2xl']"
      data-reveal
      data-reveal-delay="60"
    >
      {{ title }}
    </h2>

    <p
      v-if="subtitle"
      class="mt-5 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base"
      data-reveal
      data-reveal-delay="120"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    center?: boolean
    /** `sm` is for headings inside the home page's narrower left column. */
    size?: 'sm' | 'md'
  }>(),
  { center: false, size: 'md' },
)

const sizeClass = computed(() =>
  props.size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-[1.75rem]',
)
</script>
