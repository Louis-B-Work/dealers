<template>
  <div class="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18.5rem_minmax(0,1fr)]">
    <!-- Filters: a sticky sidebar from lg up, a full-screen drawer below. -->
    <aside
      :id="drawerId"
      class="lg:block"
      :class="
        open
          ? 'fixed inset-0 z-[60] flex flex-col bg-surface lg:static lg:z-auto lg:bg-transparent'
          : 'hidden'
      "
      :role="open ? 'dialog' : undefined"
      :aria-modal="open ? 'true' : undefined"
      aria-label="Filters"
      @keydown.esc="closeDrawer"
    >
      <div class="flex items-center justify-between border-b border-line px-5 py-4 lg:hidden">
        <h2 class="text-base font-semibold">Filters</h2>
        <button ref="closeButton" type="button" class="btn-ghost px-3 py-2" @click="closeDrawer">
          <AppIcon name="close" :size="16" />
          <span class="sr-only">Close filters</span>
        </button>
      </div>
      <div
        class="flex-1 overflow-y-auto p-5 lg:sticky lg:top-[calc(var(--nav-h)+1rem)] lg:max-h-[calc(100vh-var(--nav-h)-2rem)] lg:rounded-panel lg:border lg:border-line lg:bg-surface"
      >
        <h2 class="mb-4 hidden text-sm font-semibold uppercase tracking-wide text-ink-muted lg:block">
          Filter the stock
        </h2>
        <StockFilters :search="search" />
      </div>
      <div class="border-t border-line p-4 lg:hidden">
        <button type="button" class="btn-accent w-full" @click="closeDrawer">
          Show {{ search.results.value.length }}
          {{ search.results.value.length === 1 ? 'car' : 'cars' }}
        </button>
      </div>
    </aside>

    <section aria-label="Stock results" class="min-w-0">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
        <p class="mr-auto text-sm text-ink-soft" role="status" aria-live="polite">
          <span class="tabular text-lg font-bold text-ink">{{ search.results.value.length }}</span>
          {{ search.results.value.length === 1 ? 'car' : 'cars' }} in stock
        </p>

        <button
          type="button"
          class="btn-ghost px-4 py-2 lg:hidden"
          :aria-expanded="open"
          :aria-controls="drawerId"
          @click="openDrawer"
        >
          <AppIcon name="sliders" :size="16" />
          Filters<span v-if="search.activeFilters.value.length" class="tabular">
            ({{ search.activeFilters.value.length }})</span
          >
        </button>

        <div class="inline-flex rounded-control border border-line bg-surface p-0.5" role="group" aria-label="Price shown">
          <button
            v-for="option in modes"
            :key="option.value"
            type="button"
            class="rounded px-3 py-1.5 text-sm font-semibold transition"
            :class="
              search.mode.value === option.value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
            "
            :aria-pressed="search.mode.value === option.value"
            @click="search.setMode(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-ink-muted" for="sort">Sort</label>
          <select
            id="sort"
            class="field w-auto py-2"
            :value="search.sort.value"
            @change="search.setSort(($event.target as HTMLSelectElement).value as SortKey)"
          >
            <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="hidden rounded-control border border-line bg-surface p-0.5 sm:inline-flex" role="group" aria-label="Layout">
          <button
            v-for="option in layouts"
            :key="option.value"
            type="button"
            class="rounded p-2 transition"
            :class="
              search.view.value === option.value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
            "
            :aria-pressed="search.view.value === option.value"
            @click="search.setView(option.value)"
          >
            <AppIcon :name="option.icon" :size="16" />
            <span class="sr-only">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <ul v-if="search.activeFilters.value.length" class="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
        <li v-for="chip in search.activeFilters.value" :key="chip.key">
          <button type="button" class="chip" @click="search.clearFilter(chip.key)">
            {{ chip.label }}
            <AppIcon name="close" :size="12" />
            <span class="sr-only">Remove filter</span>
          </button>
        </li>
      </ul>

      <ul
        v-if="search.results.value.length"
        class="mt-5 grid gap-5"
        :class="
          search.view.value === 'list'
            ? 'grid-cols-1'
            : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
        "
      >
        <li v-for="(vehicle, index) in search.visible.value" :key="vehicle.id">
          <VehicleCard
            :vehicle="vehicle"
            :mode="search.mode.value"
            :layout="search.view.value"
            :priority="index < 3"
            class="h-full"
          />
        </li>
      </ul>

      <div v-else class="panel mt-5 px-6 py-14 text-center">
        <h3 class="u-h2">No cars match those filters</h3>
        <p class="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Try a higher budget, remove a filter or clear everything to see all
          {{ totalCount }} cars in stock.
        </p>
        <button type="button" class="btn-accent mt-6" @click="search.reset()">Show all stock</button>
      </div>

      <div v-if="search.hasMore.value" class="mt-8 text-center">
        <button type="button" class="btn-ghost" @click="search.showMore()">
          Show more cars
          <span class="tabular text-ink-muted">
            ({{ search.results.value.length - search.visible.value.length }} left)
          </span>
        </button>
      </div>

      <p class="mt-8 flex gap-2 text-xs leading-relaxed text-ink-muted">
        <AppIcon name="info" :size="14" class="mt-0.5 shrink-0" />
        <span>
          Monthly figures are illustrations at a representative {{ REPRESENTATIVE_APR }}% APR over
          {{ QUOTE_TERM_MONTHS }} months with no deposit, rounded to the nearest pound. Finance is
          subject to status. {{ brokerDisclosure }}
        </span>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SORT_OPTIONS, useStockSearch } from '../../composables/useStockSearch'
import type { PriceMode, SortKey, ViewMode } from '../../composables/useStockSearch'
import { vehicles } from '../../data/vehicles'
import { QUOTE_TERM_MONTHS, REPRESENTATIVE_APR, brokerDisclosure } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import VehicleCard from '../shared/VehicleCard.vue'
import StockFilters from './StockFilters.vue'

const search = useStockSearch()
const totalCount = vehicles.length
const drawerId = 'stock-filters-drawer'

const modes: { value: PriceMode; label: string }[] = [
  { value: 'cash', label: 'Cash price' },
  { value: 'monthly', label: 'Per month' },
]
const layouts: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'grid', label: 'Grid view', icon: 'grid' },
  { value: 'list', label: 'List view', icon: 'list' },
]

const open = ref(false)
const closeButton = ref<HTMLButtonElement | null>(null)
let opener: HTMLElement | null = null

function openDrawer() {
  opener = document.activeElement as HTMLElement | null
  open.value = true
}

function closeDrawer() {
  open.value = false
}

// The drawer is a modal below lg, so it locks page scroll and hands focus back on close.
watch(open, async (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    await nextTick()
    closeButton.value?.focus()
  } else {
    opener?.focus()
  }
})

const desktop = window.matchMedia('(min-width: 1024px)')
const onBreakpoint = () => {
  if (desktop.matches) open.value = false
}
onMounted(() => desktop.addEventListener('change', onBreakpoint))
onBeforeUnmount(() => {
  desktop.removeEventListener('change', onBreakpoint)
  document.body.style.overflow = ''
})
</script>
