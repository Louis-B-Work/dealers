<template>
  <!-- A small on/off switch: Total Cost on the left, Monthly Cost on the right. -->
  <div class="inline-flex items-center gap-3 text-sm font-bold">
    <button
      type="button"
      class="hit-area transition-colors duration-300"
      :class="!isMonthly ? 'text-ink' : 'text-ink-muted hover:text-ink'"
      @click="priceMode = 'total'"
    >
      Total Cost
    </button>

    <button
      type="button"
      role="switch"
      :aria-checked="isMonthly"
      aria-label="Show monthly cost instead of total cost"
      class="hit-area relative h-7 w-12 shrink-0 rounded-full border shadow-soft transition-colors duration-300"
      :class="isMonthly ? 'border-accent bg-accent' : 'border-line bg-surface'"
      @click="priceMode = isMonthly ? 'total' : 'monthly'"
    >
      <span
        class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform duration-300 ease-premium"
        :class="isMonthly ? 'translate-x-5 bg-white' : 'translate-x-0 bg-accent'"
      ></span>
    </button>

    <button
      type="button"
      class="hit-area transition-colors duration-300"
      :class="isMonthly ? 'text-ink' : 'text-ink-muted hover:text-ink'"
      @click="priceMode = 'monthly'"
    >
      Monthly Cost
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePriceMode } from '../../composables/usePriceMode'

const { priceMode } = usePriceMode()
const isMonthly = computed(() => priceMode.value === 'monthly')
</script>
