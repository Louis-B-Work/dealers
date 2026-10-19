<template>
  <div class="relative">
    <label v-if="label" :for="id" class="field-label">{{ label }}</label>

    <div class="relative">
      <select
        :id="id"
        class="field appearance-none pr-10"
        :class="[sizeClass, modelValue === '' ? 'text-ink-soft' : 'text-ink']"
        :value="modelValue"
        :aria-label="label ? undefined : ariaLabel"
        @change="onChange"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}<template v-if="opt.count !== undefined"> ({{ opt.count }})</template>
        </option>
      </select>

      <AppIcon
        name="chevron"
        :size="18"
        class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import AppIcon from './AppIcon.vue'

export interface SelectOption {
  value: string
  label: string
  /** Rendered in brackets after the label — "Ford (2)". */
  count?: number
}

/**
 * A native `<select>` in the template's clothing, rather than the hand-built
 * listbox the other drafts use. This template's buyers get the control they
 * already know: it opens natively on mobile, it needs no keyboard
 * handling of our own, and it cannot animate.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    options: SelectOption[]
    label?: string
    /** Accessible name when the control is labelled visually elsewhere. */
    ariaLabel?: string
    placeholder?: string
    size?: 'sm' | 'md'
  }>(),
  { placeholder: 'Any', size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const id = useId()

const sizeClass = computed(() => (props.size === 'sm' ? 'py-2.5 text-sm' : 'py-3 text-sm'))

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>
