<template>
  <div
    class="relative overflow-hidden bg-paper-sink"
    :style="{
      background: `linear-gradient(135deg, rgb(${gradient[0]}) 0%, rgb(${gradient[1]}) 100%)`,
    }"
    :role="image ? undefined : 'img'"
    :aria-label="image ? undefined : label"
  >
    <!-- Real photo when supplied; the gradient stays behind it as the load colour. -->
    <img
      v-if="image"
      :src="image"
      :alt="label"
      :loading="loading"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover"
      :style="{ objectPosition }"
    />

    <template v-else>
      <!-- subtle studio light sweep -->
      <div
        class="pointer-events-none absolute inset-0 opacity-70"
        style="
          background: radial-gradient(120% 80% at 50% 0%, rgba(217, 192, 140, 0.16), transparent 62%);
        "
      ></div>
      <!-- reflective floor -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent)"
      ></div>

      <div class="absolute inset-0 flex items-center justify-center">
        <AppIcon name="car" :size="silhouetteSize" class="text-white/70" />
      </div>
    </template>

    <!-- Dark tint over every photo so overlaid labels stay legible and the
         imagery sits in the same key as the rest of the template. -->
    <div class="pointer-events-none absolute inset-0 bg-paper/25"></div>

    <span
      v-if="badge"
      class="absolute left-3 top-3 border border-accent/50 bg-paper/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-micro text-accent backdrop-blur"
    >
      {{ badge }}
    </span>

    <slot />
  </div>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    gradient: [string, string]
    label: string
    badge?: string
    silhouetteSize?: number
    image?: string
    loading?: 'eager' | 'lazy'
    /** Lets callers re-centre the crop when the subject sits low in frame. */
    objectPosition?: string
  }>(),
  // Every vehicle currently shares one image URL, so deferring it saves nothing
  // (one request, then cache) and only risks empty cards. Switch to 'lazy' per
  // usage once real per-vehicle photography lands.
  { silhouetteSize: 108, loading: 'eager', objectPosition: 'center' },
)
</script>
