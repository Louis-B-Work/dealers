<template>
  <!-- A small on/off switch: Total Cost on the left, Monthly Cost on the right. -->
  <div class="inline-flex items-center gap-3 text-sm font-semibold">
    <button
      type="button"
      class="transition-colors duration-150"
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
      class="relative h-7 w-12 shrink-0 rounded-full border shadow-card transition-colors duration-150"
      :class="isMonthly ? 'border-accent bg-accent' : 'border-line bg-paper-soft'"
      @click="priceMode = isMonthly ? 'total' : 'monthly'"
    >
      <span
        class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform duration-150"
        :class="isMonthly ? 'translate-x-5 bg-white' : 'translate-x-0 bg-accent'"
      ></span>
    </button>

    <button
      type="button"
      class="transition-colors duration-150"
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
