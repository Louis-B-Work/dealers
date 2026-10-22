<template>
  <section class="relative overflow-hidden bg-ink pt-[calc(var(--nav-h)+3rem)] text-white">
    <img
      src="/hero-poster.svg"
      alt=""
      class="absolute inset-0 h-full w-full object-cover opacity-40"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/80"></div>

    <div class="container relative flex flex-col items-center gap-8 pb-16 text-center md:pb-24">
      <h1
        class="u-display text-3xl !text-white sm:text-4xl md:text-5xl lg:whitespace-nowrap"
        data-intro
      >
        {{ title }}
      </h1>
      <p v-if="intro" class="max-w-prose text-lg text-white/80" data-intro>{{ intro }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; intro?: string }>()
</script>
