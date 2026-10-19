<template>
  <!-- The dark block is the template's page-opening device: the same
       rounded-bottom slab the homepage hero uses, at a third of the height. -->
  <header class="bg-paper">
    <div class="rounded-b-block bg-paper-dark">
      <div class="u-gutter flex w-full flex-col items-start py-12 sm:py-16 lg:py-20">
        <h1 class="u-display max-w-3xl text-[1.9rem] text-ink-inverse sm:text-[2.35rem] md:text-[2.75rem]">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-4 max-w-prose text-sm leading-relaxed text-ink-inverse/75 sm:text-base">
          {{ subtitle }}
        </p>
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
