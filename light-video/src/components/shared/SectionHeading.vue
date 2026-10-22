<template>
  <div :class="['flex flex-col gap-4', center ? 'items-center text-center' : 'items-start']">
    <h2
      class="u-display text-3xl sm:text-4xl md:text-[2.75rem]"
      :class="center ? 'max-w-2xl' : 'max-w-xl'"
      data-reveal
      data-reveal-delay="60"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="max-w-prose text-base leading-relaxed text-ink-soft"
      data-reveal
      data-reveal-delay="120"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    center?: boolean
  }>(),
  { center: false },
)
</script>
