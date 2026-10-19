<template>
  <header class="border-b border-line bg-paper-soft">
    <div class="u-gutter flex w-full flex-col gap-4 py-12 md:py-16">
      <p v-if="eyebrow" class="u-eyebrow">{{ eyebrow }}</p>
      <h1 class="u-display text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem]">{{ title }}</h1>
      <p v-if="subtitle" class="max-w-prose text-ink-soft">{{ subtitle }}</p>
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
