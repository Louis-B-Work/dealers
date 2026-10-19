<template>
  <div
    class="relative overflow-hidden bg-paper-sink"
    :role="image ? undefined : 'img'"
    :aria-label="image ? undefined : label"
  >
    <!-- Real photo when supplied. The light well behind it is the load colour. -->
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
      <!-- Studio fallback: a light grey well with a soft overhead pool and a
           faint floor shadow, rather than template 02's coloured gradient. The
           vehicle's own `gradient` pair is deliberately unused — this template
           has no colour. -->
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background: radial-gradient(120% 80% at 50% 0%, rgba(255, 255, 255, 0.95), transparent 64%);
        "
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style="background: linear-gradient(to top, rgba(10, 10, 10, 0.06), transparent)"
      ></div>

      <div class="absolute inset-0 flex items-center justify-center">
        <AppIcon name="car" :size="silhouetteSize" class="text-ink/15" />
      </div>
    </template>

    <span
      v-if="badge"
      class="absolute left-0 top-0 bg-ink px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-micro text-paper"
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
    /** Kept for parity with the shared vehicle data; unused in this template. */
    gradient?: [string, string]
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
