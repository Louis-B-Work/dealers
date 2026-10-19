<template>
  <form
    class="search-form group"
    :class="{ 'is-active': hasSelection }"
    @submit.prevent="onSearch"
  >
    <SelectMenu
      :model-value="make"
      :child-value="model"
      icon="car"
      label="Make"
      :options="makeSelectOptions"
      @update:model-value="onMakeSelect"
    />

    <SelectMenu
      v-model="model"
      icon="tag"
      label="Model"
      :options="modelSelectOptions"
      :disabled="!make"
    />

    <!-- Search spans the second row in the hero's narrow column; the clear
         control sits in flow beside it and collapses away when unused. -->
    <div class="relative flex items-center sm:col-span-2">
      <transition name="clear">
        <button
          v-if="hasSelection"
          type="button"
          class="clear-btn mr-2"
          aria-label="Clear all filters"
          title="Clear all filters"
          @click="clearAll"
        >
          <AppIcon name="close" :size="18" />
        </button>
      </transition>

      <button
        type="submit"
        class="btn-accent h-full min-h-[48px] flex-1 rounded-control px-8 tabular-nums"
      >
        <AppIcon name="search" :size="18" />
        <span>Search{{ matchCount ? ` ${matchCount}` : '' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import SelectMenu from '../shared/SelectMenu.vue'

const router = useRouter()
const make = ref<string | number>('')
const model = ref<string | number>('')

const makeOptions = computed(() =>
  Array.from(new Set(vehicles.map((v) => v.make))).sort((a, b) => a.localeCompare(b)),
)

const modelOptions = computed(() =>
  Array.from(
    new Set(vehicles.filter((v) => v.make === make.value).map((v) => v.model)),
  ).sort((a, b) => a.localeCompare(b)),
)

const modelsByMake = computed(() => {
  const map = new Map<string, string[]>()
  for (const v of vehicles) {
    const list = map.get(v.make) ?? []
    if (!list.includes(v.model)) list.push(v.model)
    map.set(v.make, list)
  }
  for (const list of map.values()) list.sort((a, b) => a.localeCompare(b))
  return map
})

const makeSelectOptions = computed(() => [
  { value: '', label: 'Any make' },
  ...makeOptions.value.map((m) => {
    const models = modelsByMake.value.get(m) ?? []
    return {
      value: m,
      label: m,
      ...(models.length
        ? { children: models.map((name) => ({ value: name, label: name })) }
        : {}),
    }
  }),
])

const modelSelectOptions = computed(() => [
  { value: '', label: make.value ? 'Any model' : 'Select make first' },
  ...modelOptions.value.map((m) => ({ value: m, label: m })),
])

// Once any filter is set the bar holds its solid state, so active criteria
// stay legible without needing hover or focus. The same condition reveals the
// clear button.
const hasSelection = computed(() => make.value !== '' || model.value !== '')

const matchCount = computed(
  () =>
    vehicles.filter((v) => {
      if (make.value && v.make !== make.value) return false
      if (model.value && v.model !== model.value) return false
      return true
    }).length,
)

// A branch pick sets make and model together; a plain make pick clears model.
function onMakeSelect(value: string | number, child?: string | number) {
  make.value = value
  model.value = child ?? ''
}

// Offered as soon as anything is set, so a selection is always one click to undo.
function clearAll() {
  make.value = ''
  model.value = ''
}

function onSearch() {
  router.push({
    name: 'vehicles',
    query: {
      ...(make.value ? { make: String(make.value) } : {}),
    },
  })
}
</script>

<style scoped>
/* Glass by default; resolves to a solid surface panel as soon as it is
   hovered or anything inside gains focus. Cell, trigger and
   menu styling lives in SelectMenu.vue and keys off this `.group`. */
.search-form {
  @apply grid gap-2 rounded-panel border border-line bg-surface p-2 shadow-soft text-left backdrop-blur-xl transition duration-700 ease-premium sm:grid-cols-2;
}
.search-form:focus-within {
  @apply border-line bg-surface shadow-lift;
}
.search-form:hover {
  @apply border-line bg-surface shadow-lift;
}
/* Bare icon, no border or fill; the 48px box is just the hit area. */
.clear-btn {
  @apply flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-control text-ink-muted transition duration-300 ease-premium hover:text-accent;
}
.clear-enter-active,
.clear-leave-active {
  overflow: hidden;
  transition:
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-right 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.clear-enter-from,
.clear-leave-to {
  opacity: 0;
}

/* The clear control always sits in flow, so its footprint collapses as well
   and the Search button grows/shrinks with it instead of snapping. */
.clear-enter-from,
.clear-leave-to {
  width: 0;
  margin-right: 0;
}

@media (prefers-reduced-motion: reduce) {
  .clear-enter-active,
  .clear-leave-active {
    transition: none;
  }
}
.search-form.is-active {
  @apply border-line bg-surface shadow-lift;
}
</style>
