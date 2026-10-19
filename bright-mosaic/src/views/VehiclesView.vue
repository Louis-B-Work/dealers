<template>
  <div class="bg-paper pb-24 pt-[84px]">
    <!-- page header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-3 py-10 md:py-14">
        <span class="u-eyebrow">
          The Forecourt
        </span>
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl">Find a car that fits your budget</h1>
        <p class="max-w-prose text-ink-soft">
          {{ results.length }} checked {{ results.length === 1 ? 'car' : 'cars' }} available now,
          every one with its price on show.
        </p>
      </div>
    </div>

    <div class="container grid gap-10 pt-10 lg:grid-cols-[280px_1fr]">
      <!-- Filters -->
      <aside class="lg:sticky lg:top-[92px] lg:h-fit">
        <div class="flex items-center justify-between lg:hidden">
          <button class="btn-ghost" @click="filtersOpen = !filtersOpen">
            <AppIcon name="menu" :size="16" />
            Filters{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
          </button>
        </div>

        <div
          class="mt-4 flex-col gap-6 rounded-panel border border-line bg-surface p-6 shadow-soft lg:mt-0 lg:flex"
          :class="filtersOpen ? 'flex' : 'hidden lg:flex'"
        >
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg text-ink">Refine</h2>
            <button
              v-if="activeFilterCount"
              class="text-xs font-semibold text-accent hover:underline"
              @click="reset"
            >
              Clear all
            </button>
          </div>

          <label class="filter-field">
            <span class="filter-label">Search</span>
            <input v-model="filters.query" type="search" class="field" placeholder="Make, model…" />
          </label>

          <label class="filter-field">
            <span class="filter-label">Budget</span>
            <div class="relative">
              <select v-model="filters.maxPrice" class="field appearance-none pr-9">
                <option value="">Any price</option>
                <option v-for="b in BUDGET_BANDS" :key="b" :value="String(b)">
                  Under {{ formatCurrency(b) }}
                </option>
              </select>
              <AppIcon name="chevron" :size="16" class="filter-arrow" />
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">Make</span>
            <div class="relative">
              <select v-model="filters.make" class="field appearance-none pr-9">
                <option value="">Any make</option>
                <option v-for="m in makeOptions" :key="m" :value="m">{{ m }}</option>
              </select>
              <AppIcon name="chevron" :size="16" class="filter-arrow" />
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">Body type</span>
            <div class="relative">
              <select v-model="filters.bodyType" class="field appearance-none pr-9">
                <option value="">Any body type</option>
                <option v-for="b in bodyTypeOptions" :key="b" :value="b">{{ b }}</option>
              </select>
              <AppIcon name="chevron" :size="16" class="filter-arrow" />
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">Fuel</span>
            <div class="relative">
              <select v-model="filters.fuel" class="field appearance-none pr-9">
                <option value="">Any fuel</option>
                <option v-for="f in fuelOptions" :key="f" :value="f">{{ f }}</option>
              </select>
              <AppIcon name="chevron" :size="16" class="filter-arrow" />
            </div>
          </label>

        </div>
      </aside>

      <!-- Results -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6">
          <p class="text-sm text-ink-soft">
            Showing <span class="font-semibold text-ink">{{ visible.length }}</span> of
            {{ results.length }}
          </p>
          <label class="flex items-center gap-2 text-sm">
            <span class="text-ink-soft">Sort by</span>
            <div class="relative">
              <select v-model="sort" class="field appearance-none py-2 pr-9 text-sm">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="year-desc">Newest</option>
                <option value="mileage-asc">Lowest mileage</option>
              </select>
              <AppIcon name="chevron" :size="16" class="filter-arrow" />
            </div>
          </label>
        </div>

        <div v-if="results.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="v in visible" :key="v.id" class="aspect-[4/3]">
            <MosaicCard :vehicle="v" />
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-4 rounded-panel border border-dashed border-line bg-paper-soft px-6 py-20 text-center"
        >
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-ink-muted shadow-soft">
            <AppIcon name="search" :size="24" />
          </span>
          <h3 class="font-display text-xl text-ink">No vehicles match your filters</h3>
          <p class="max-w-sm text-sm text-ink-soft">
            Try widening your search, or clear your filters to see every car in stock.
          </p>
          <button class="btn-primary" @click="reset">Clear filters</button>
        </div>

        <div v-if="canLoadMore" class="mt-12 flex justify-center">
          <button class="btn-ghost" @click="limit += 6">
            Load more vehicles
            <AppIcon name="chevron" :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { BUDGET_BANDS, formatCurrency, useVehicleFilters } from '../composables/useVehicleFilters'
import MosaicCard from '../components/shared/MosaicCard.vue'
import AppIcon from '../components/shared/AppIcon.vue'

const route = useRoute()

const {
  filters,
  sort,
  results,
  makeOptions,
  bodyTypeOptions,
  fuelOptions,
  activeFilterCount,
  reset,
} = useVehicleFilters({
  make: (route.query.make as string) ?? '',
  maxPrice: (route.query.maxPrice as string) ?? '',
})

const filtersOpen = ref(false)
const limit = ref(9)

const visible = computed(() => results.value.slice(0, limit.value))
const canLoadMore = computed(() => results.value.length > limit.value)

// Reset pagination whenever the result set changes
watch(results, () => {
  limit.value = 9
})
</script>

<style scoped>
.filter-field {
  @apply flex flex-col gap-1.5;
}
.filter-label {
  @apply text-xs font-semibold uppercase tracking-wider text-ink-muted;
}
.filter-arrow {
  @apply pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted;
}
</style>
