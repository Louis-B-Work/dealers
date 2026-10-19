<template>
  <header class="border-b border-line bg-paper">
    <div class="u-gutter flex w-full flex-col items-center py-16 text-center md:py-24">
      <p v-if="eyebrow" class="u-eyebrow">{{ eyebrow }}</p>
      <h1 class="u-display-caps mt-6 max-w-3xl text-[1.5rem] sm:text-[1.9rem] md:text-[2.2rem]">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-6 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
        {{ subtitle }}
      </p>
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>
