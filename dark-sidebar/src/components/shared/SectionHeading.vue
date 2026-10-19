<template>
  <div :class="['flex flex-col gap-5', center ? 'items-center text-center' : 'items-start']">
    <!-- Eyebrow only — no leading rule. -->
    <p v-if="eyebrow" class="u-eyebrow" data-reveal>{{ eyebrow }}</p>

    <h2
      class="u-display text-[2.1rem] sm:text-[2.6rem] md:text-[3rem]"
      :class="center ? 'max-w-3xl' : 'max-w-2xl'"
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
    eyebrow?: string
    title: string
    subtitle?: string
    center?: boolean
  }>(),
  { center: false },
)
</script>
