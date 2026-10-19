<template>
  <div
    class="relative overflow-hidden bg-paper-sink"
    :role="shownImage ? undefined : 'img'"
    :aria-label="shownImage ? undefined : label"
  >
    <img
      v-if="shownImage"
      :src="shownImage"
      :alt="label"
      :loading="loading"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover"
      :style="{ objectPosition }"
      @error="failed = true"
    />

    <template v-else>
      <!-- Fallback well, also used when the photo fails to load. The vehicle's
           own `gradient` pair tints it, so a grid of missing photos still
           reads as a grid of different cars rather than one repeated box. -->
      <div
        class="pointer-events-none absolute inset-0"
        :style="{
          background: `linear-gradient(145deg, rgb(${gradient?.[1] ?? '226 228 230'} / 0.55), rgb(${gradient?.[0] ?? '182 186 190'} / 0.45))`,
        }"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <AppIcon name="car" :size="silhouetteSize" class="text-ink/20" />
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    gradient?: [string, string]
    label: string
    silhouetteSize?: number
    image?: string
    loading?: 'eager' | 'lazy'
    /** Lets callers re-centre the crop when the subject sits low in frame. */
    objectPosition?: string
  }>(),
  // Every vehicle currently shares one image URL, so deferring it saves nothing
  // (one request, then cache) and only risks empty cards. Switch to 'lazy' per
  // usage once real per-vehicle photography lands.
  { silhouetteSize: 96, loading: 'eager', objectPosition: 'center' },
)

const failed = ref(false)

// A broken photo drops back to the tinted well rather than leaving an empty
// box, which is what an unreachable image CDN would otherwise produce.
const shownImage = computed(() => (failed.value ? undefined : props.image))

watch(
  () => props.image,
  () => {
    failed.value = false
  },
)
</script>
