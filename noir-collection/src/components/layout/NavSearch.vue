<template>
  <form
    role="search"
    aria-label="Search the collection"
    class="flex h-9 w-full min-w-0 items-stretch overflow-hidden rounded-control border border-line bg-paper-soft"
    @submit.prevent="submit"
  >
    <!-- Native arrows are hidden so the text and chevron sit on matching padding on both sides. -->
    <div class="relative min-w-0 flex-1 border-r border-line">
      <label class="sr-only" for="nav-make">Marque</label>
      <select
        id="nav-make"
        v-model="make"
        class="nav-select"
        @change="model = ''"
      >
        <option value="">Any marque</option>
        <option v-for="option in makes" :key="option" :value="option">{{ option }}</option>
      </select>
      <AppIcon name="chevron" :size="14" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>

    <div class="relative min-w-0 flex-1">
      <label class="sr-only" for="nav-model">Model</label>
      <select
        id="nav-model"
        v-model="model"
        class="nav-select disabled:cursor-not-allowed disabled:text-ink-muted"
        :disabled="!make"
      >
        <option value="">Any model</option>
        <option v-for="option in models" :key="option" :value="option">{{ option }}</option>
      </select>
      <AppIcon name="chevron" :size="14" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>

    <button
      type="submit"
      class="flex shrink-0 items-center justify-center gap-2.5 bg-accent px-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-ink transition hover:bg-accent-hover sm:px-6"
    >
      <AppIcon name="search" :size="14" />
      <span class="hidden sm:inline">Search</span>
      <span class="tabular">{{ count }}</span>
      <span class="sr-only">{{ count === 1 ? 'car' : 'cars' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { makesInStock, modelsFor } from '../../composables/useCollectionSearch'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const makes = makesInStock()
const make = ref('')
const model = ref('')
const models = computed(() => modelsFor(make.value))

// On the collection page the bar mirrors the current filters, so it never contradicts them.
watch(
  () => [route.path, route.query.make, route.query.model],
  () => {
    if (route.path !== '/vehicles') return
    const queryMake = typeof route.query.make === 'string' ? route.query.make : ''
    const queryModel = typeof route.query.model === 'string' ? route.query.model : ''
    make.value = makes.includes(queryMake) ? queryMake : ''
    model.value = modelsFor(make.value).includes(queryModel) ? queryModel : ''
  },
  { immediate: true },
)

const count = computed(
  () => vehicles.filter((v) => (!make.value || v.make === make.value) && (!model.value || v.model === model.value)).length,
)

function submit() {
  const query: Record<string, string> = {}
  if (make.value) query.make = make.value
  if (model.value) query.model = model.value
  router.push({ path: '/vehicles', query })
}
</script>

<style scoped>
.nav-select {
  @apply h-full w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pl-4 pr-10 text-sm text-ink focus:outline-none focus-visible:bg-surface;
}
</style>
