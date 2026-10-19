<template>
  <div class="bg-paper pb-24">
    <PageHeader
      eyebrow="The Collection"
      title="Browse our vehicles"
      :subtitle="`${results.length} handpicked ${results.length === 1 ? 'vehicle' : 'vehicles'} available now, each prepared to our exacting standard.`"
    />

    <!-- Filters run as a sticky toolbar on a hairline rather than a rail, so
         the grid keeps the full page width and the whitespace around it. -->
    <div class="sticky top-[var(--nav-h-scrolled)] z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div class="u-gutter w-full">
        <div class="flex items-center justify-between gap-4 py-3 lg:hidden">
          <button class="btn-quiet px-5 py-3" @click="filtersOpen = !filtersOpen">
            <AppIcon name="sliders" :size="15" />
            Filters{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
          </button>
          <p class="text-[0.62rem] uppercase tracking-micro text-ink-muted">
            {{ results.length }} results
          </p>
        </div>

        <div
          class="flex-col gap-4 pb-5 lg:flex lg:flex-row lg:items-end lg:gap-5 lg:py-5"
          :class="filtersOpen ? 'flex' : 'hidden lg:flex'"
        >
          <label class="filter-field lg:flex-[1.4]">
            <span class="field-label">Search</span>
            <input v-model="filters.query" type="search" class="field" placeholder="Make, model…" />
          </label>

          <!-- The home wizard can hand over a shortlist of marques, which a
               single select cannot represent. Showing "Any make" over filtered
               results would be a lie, so the shortlist is summarised with a
               way back to the single-choice control. -->
          <div v-if="selectedMakes.length > 1" class="filter-field">
            <span class="field-label">Make</span>
            <span class="field flex items-center justify-between gap-2">
              <span class="truncate">{{ selectedMakes.length }} makes</span>
              <button
                type="button"
                class="shrink-0 text-ink-muted transition-colors duration-300 ease-premium hover:text-ink"
                :aria-label="`Clear ${selectedMakes.length} selected makes`"
                :title="selectedMakes.join(', ')"
                @click="filters.make = ''"
              >
                <AppIcon name="close" :size="14" />
              </button>
            </span>
          </div>

          <label v-else class="filter-field">
            <span class="field-label">Make</span>
            <span class="relative block">
              <select v-model="filters.make" class="field appearance-none pr-9">
                <option value="">Any make</option>
                <option v-for="m in makeOptions" :key="m" :value="m">{{ m }}</option>
              </select>
              <AppIcon name="chevron" :size="14" class="filter-arrow" />
            </span>
          </label>

          <label class="filter-field">
            <span class="field-label">Body type</span>
            <span class="relative block">
              <select v-model="filters.bodyType" class="field appearance-none pr-9">
                <option value="">Any body type</option>
                <option v-for="b in bodyTypeOptions" :key="b" :value="b">{{ b }}</option>
              </select>
              <AppIcon name="chevron" :size="14" class="filter-arrow" />
            </span>
          </label>

          <label class="filter-field">
            <span class="field-label">Fuel</span>
            <span class="relative block">
              <select v-model="filters.fuel" class="field appearance-none pr-9">
                <option value="">Any fuel</option>
                <option v-for="f in fuelOptions" :key="f" :value="f">{{ f }}</option>
              </select>
              <AppIcon name="chevron" :size="14" class="filter-arrow" />
            </span>
          </label>


          <label class="filter-field">
            <span class="field-label">Sort by</span>
            <span class="relative block">
              <select v-model="sort" class="field appearance-none pr-9">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="year-desc">Newest</option>
                <option value="mileage-asc">Lowest mileage</option>
              </select>
              <AppIcon name="chevron" :size="14" class="filter-arrow" />
            </span>
          </label>

          <button
            v-if="activeFilterCount"
            type="button"
            class="btn-quiet shrink-0 px-5 py-3.5"
            @click="reset"
          >
            <AppIcon name="close" :size="14" />
            Clear
          </button>
        </div>
      </div>
    </div>

    <div class="u-gutter w-full pt-12">
      <p class="pb-8 text-[0.62rem] uppercase tracking-micro text-ink-muted">
        Showing <span class="text-ink tabular-nums">{{ visible.length }}</span> of
        <span class="tabular-nums">{{ results.length }}</span>
      </p>

      <div
        v-if="results.length"
        class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-4"
      >
        <VehicleCard v-for="v in visible" :key="v.id" :vehicle="v" />
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-5 border border-line px-6 py-24 text-center"
      >
        <span class="flex h-14 w-14 items-center justify-center border border-line text-ink-muted">
          <AppIcon name="search" :size="22" />
        </span>
        <h3 class="u-display-caps text-base">No vehicles match your filters</h3>
        <p class="max-w-sm text-sm text-ink-soft">
          Try widening your search, or clear your filters to see the full collection.
        </p>
        <button class="btn-primary mt-2" @click="reset">Clear filters</button>
      </div>

      <div v-if="canLoadMore" class="mt-14 flex justify-center">
        <button class="btn-ghost" @click="limit += 6">
          Load more vehicles
          <AppIcon name="scroll" :size="14" />
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
  make: (route.query.make as string | string[] | undefined) ?? '',
  // The home wizard's model answer arrives as free text, since the model is
  // not a filter of its own here.
  query: (route.query.q as string) ?? '',
})

/** A shortlist handed over by the home wizard, or the single select's value. */
const selectedMakes = computed(() => {
  const make = filters.value.make
  if (Array.isArray(make)) return make.filter(Boolean)
  return make ? [make] : []
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
  @apply flex flex-1 flex-col;
}

.filter-arrow {
  @apply pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted;
}
</style>
