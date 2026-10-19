<template>
  <div
    class="relative overflow-hidden"
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
    />

    <template v-else>
      <!-- subtle studio light sweep -->
      <div
        class="pointer-events-none absolute inset-0 opacity-70"
        style="
          background: radial-gradient(120% 80% at 50% 0%, rgba(255, 255, 255, 0.22), transparent 60%);
        "
      ></div>
      <!-- reflective floor -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 0.28), transparent)"
      ></div>

      <div class="absolute inset-0 flex items-center justify-center">
        <AppIcon name="car" :size="silhouetteSize" class="text-white/85 drop-shadow-lg" />
      </div>
    </template>

    <span
      v-if="badge"
      class="absolute left-4 top-4 rounded-control bg-white/95 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ink shadow-soft"
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
  }>(),
  // Every vehicle currently shares one image URL, so deferring it saves nothing
  // (one request, then cache) and only risks empty cards. Switch to 'lazy' per
  // usage once real per-vehicle photography lands.
  { silhouetteSize: 108, loading: 'eager' },
)
</script>
