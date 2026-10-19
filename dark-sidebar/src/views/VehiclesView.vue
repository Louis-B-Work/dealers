<template>
  <div class="bg-paper pb-24">
    <PageHeader
      eyebrow="The Collection"
      title="Browse our vehicles"
      :subtitle="`${results.length} handpicked ${results.length === 1 ? 'vehicle' : 'vehicles'} available now, each prepared to our exacting standard.`"
    />

    <!-- Filters run horizontally. A left-hand filter rail would sit directly
         against the navigation column and read as a second sidebar, so the
         controls become a sticky toolbar instead. -->
    <div
      class="sticky top-[var(--nav-h)] z-20 border-b border-line bg-paper/90 backdrop-blur-md lg:top-0"
    >
      <div class="u-gutter w-full">
        <div class="flex items-center justify-between gap-4 py-3 lg:hidden">
          <button class="btn-ghost px-4 py-2" @click="filtersOpen = !filtersOpen">
            <AppIcon name="sliders" :size="16" />
            Filters{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
          </button>
          <p class="text-xs text-ink-muted">{{ results.length }} results</p>
        </div>

        <div
          class="flex-col gap-3 pb-4 lg:flex lg:flex-row lg:items-end lg:gap-4 lg:py-4"
          :class="filtersOpen ? 'flex' : 'hidden lg:flex'"
        >
          <label class="filter-field lg:flex-[1.4]">
            <span class="filter-label">Search</span>
            <input v-model="filters.query" type="search" class="field" placeholder="Make, model…" />
          </label>

          <label class="filter-field">
            <span class="filter-label">Make</span>
            <span class="relative block">
              <select v-model="filters.make" class="field appearance-none pr-9">
                <option value="">Any make</option>
                <option v-for="m in makeOptions" :key="m" :value="m">{{ m }}</option>
              </select>
              <AppIcon name="chevron" :size="15" class="filter-arrow" />
            </span>
          </label>

          <label class="filter-field">
            <span class="filter-label">Body type</span>
            <span class="relative block">
              <select v-model="filters.bodyType" class="field appearance-none pr-9">
                <option value="">Any body type</option>
                <option v-for="b in bodyTypeOptions" :key="b" :value="b">{{ b }}</option>
              </select>
              <AppIcon name="chevron" :size="15" class="filter-arrow" />
            </span>
          </label>

          <label class="filter-field">
            <span class="filter-label">Fuel</span>
            <span class="relative block">
              <select v-model="filters.fuel" class="field appearance-none pr-9">
                <option value="">Any fuel</option>
                <option v-for="f in fuelOptions" :key="f" :value="f">{{ f }}</option>
              </select>
              <AppIcon name="chevron" :size="15" class="filter-arrow" />
            </span>
          </label>


          <label class="filter-field">
            <span class="filter-label">Sort by</span>
            <span class="relative block">
              <select v-model="sort" class="field appearance-none pr-9">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="year-desc">Newest</option>
                <option value="mileage-asc">Lowest mileage</option>
              </select>
              <AppIcon name="chevron" :size="15" class="filter-arrow" />
            </span>
          </label>

          <button
            v-if="activeFilterCount"
            type="button"
            class="btn-ghost shrink-0 px-4 py-3"
            @click="reset"
          >
            <AppIcon name="close" :size="15" />
            Clear
          </button>
        </div>
      </div>
    </div>

    <div class="u-gutter w-full pt-10">
      <p class="pb-6 text-xs uppercase tracking-micro text-ink-muted">
        Showing <span class="text-ink">{{ visible.length }}</span> of {{ results.length }}
      </p>

      <div v-if="results.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-4">
        <VehicleCard v-for="v in visible" :key="v.id" :vehicle="v" />
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-4 border border-dashed border-line bg-paper-soft px-6 py-20 text-center"
      >
        <span class="flex h-14 w-14 items-center justify-center border border-line text-ink-muted">
          <AppIcon name="search" :size="24" />
        </span>
        <h3 class="font-display text-2xl text-ink">No vehicles match your filters</h3>
        <p class="max-w-sm text-sm text-ink-soft">
          Try widening your search, or clear your filters to see the full collection.
        </p>
        <button class="btn-primary" @click="reset">Clear filters</button>
      </div>

      <div v-if="canLoadMore" class="mt-12 flex justify-center">
        <button class="btn-ghost" @click="limit += 6">
          Load more vehicles
          <AppIcon name="scroll" :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useVehicleFilters } from '../composables/useVehicleFilters'
import VehicleCard from '../components/shared/VehicleCard.vue'
import PageHeader from '../components/shared/PageHeader.vue'
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
  @apply flex flex-1 flex-col gap-1.5;
}

.filter-label {
  @apply text-[0.58rem] font-semibold uppercase tracking-micro text-ink-muted;
}

.filter-arrow {
  @apply pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted;
}

/* Native option lists inherit the OS surface, which is white on some
   platforms; force them into the template's palette. */
.filter-field select option {
  background-color: rgb(var(--c-paper-soft));
  color: rgb(var(--c-ink));
}
</style>
