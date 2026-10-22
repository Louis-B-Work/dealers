<template>
  <div class="bg-paper pb-20">
    <PageHeader
      wide
      title="Cars in stock"
      :subtitle="`${vehicles.length} quality used cars, all prepared and ready to drive away.`"
    />

    <div class="u-gutter-wide pt-8 lg:pt-10">
      <div class="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <!-- Filter rail. Sticky below `lg`; above it, it collapses into a
             disclosure so the grid gets the full width on a phone. -->
        <aside class="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
          <div class="card overflow-hidden">
            <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <h2 class="flex items-center gap-2 font-display text-sm font-semibold">
                <AppIcon name="sliders" :size="18" class="text-accent" />
                Filters
                <span v-if="activeFilterCount" class="chip-accent">{{ activeFilterCount }}</span>
              </h2>
              <div class="flex items-center gap-1">
                <button
                  v-if="activeFilterCount"
                  type="button"
                  class="btn-quiet !text-xs"
                  @click="clearAll"
                >
                  Clear
                </button>
                <button
                  type="button"
                  class="btn-ghost !px-2.5 !py-1.5 lg:hidden"
                  :aria-expanded="railOpen"
                  aria-controls="filter-rail"
                  @click="railOpen = !railOpen"
                >
                  <AppIcon :name="railOpen ? 'close' : 'chevron'" :size="16" />
                </button>
              </div>
            </div>

            <div id="filter-rail" class="flex-col gap-4 p-4" :class="railOpen ? 'flex' : 'hidden lg:flex'">
              <!-- Budget first here too, in the same two currencies the home
                   search bar offers, so an answer given there is still the
                   first thing on screen when the shopper lands. -->
              <div>
                <span class="field-label">Budget</span>
                <div class="mb-2 inline-flex w-full rounded-control bg-paper-sink p-1">
                  <button
                    v-for="mode in modes"
                    :key="mode.value"
                    type="button"
                    class="mode-btn"
                    :class="{ 'is-active': filters.priceMode === mode.value }"
                    :aria-pressed="filters.priceMode === mode.value"
                    @click="setMode(mode.value)"
                  >
                    {{ mode.label }}
                  </button>
                </div>
                <SelectMenu
                  v-model="budget"
                  :options="budgetOptions"
                  :placeholder="filters.priceMode === 'monthly' ? 'Any monthly budget' : 'Any price'"
                  size="sm"
                />
              </div>

              <SelectMenu
                v-model="filters.make"
                :options="toOptions(makeOptions)"
                label="Make"
                placeholder="Any make"
                size="sm"
              />
              <SelectMenu
                v-model="filters.bodyType"
                :options="toOptions(bodyTypeOptions)"
                label="Body type"
                placeholder="Any body type"
                size="sm"
              />
              <SelectMenu
                v-model="filters.fuel"
                :options="toOptions(fuelOptions)"
                label="Fuel"
                placeholder="Any fuel"
                size="sm"
              />
              <SelectMenu
                v-model="filters.transmission"
                :options="toOptions(transmissionOptions)"
                label="Gearbox"
                placeholder="Any gearbox"
                size="sm"
              />

              <div>
                <label :for="queryId" class="field-label">Keyword</label>
                <input
                  :id="queryId"
                  v-model.trim="filters.query"
                  type="search"
                  class="field"
                  placeholder="Model, colour…"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-ink-soft">
              Showing <span class="font-semibold text-ink">{{ results.length }}</span>
              {{ results.length === 1 ? 'car' : 'cars' }}
            </p>

            <div class="flex items-center gap-2">
              <span class="shrink-0 text-sm text-ink-soft">Sort by</span>
              <div class="w-56">
                <SelectMenu
                  v-model="sortValue"
                  :options="sortSelectOptions"
                  aria-label="Sort results by"
                  placeholder="Our picks first"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <ul v-if="results.length" class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <li v-for="vehicle in results" :key="vehicle.id">
              <VehicleCard :vehicle="vehicle" />
            </li>
          </ul>

          <div v-else class="card mt-5 flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span class="flex h-14 w-14 items-center justify-center rounded-full bg-paper-sink text-ink-muted">
              <AppIcon name="search" :size="24" />
            </span>
            <div class="max-w-prose">
              <h2 class="u-display text-xl">Nothing matches that yet</h2>
              <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                Try widening your budget or clearing a filter, or tell us what you are after and we
                will look out for one.
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-3">
              <button type="button" class="btn-primary" @click="clearAll">Clear all filters</button>
              <RouterLink to="/contact" class="btn-ghost">Tell us what you want</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  countVehicles,
  monthlyBands,
  sortOptions,
  totalPriceBands,
  useVehicleFilters,
  type FilterOption,
  type PriceMode,
  type SortKey,
} from '../composables/useVehicleFilters'
import { vehicles } from '../data/vehicles'
import AppIcon from '../components/shared/AppIcon.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import SelectMenu from '../components/shared/SelectMenu.vue'
import type { SelectOption } from '../components/shared/SelectMenu.vue'
import VehicleCard from '../components/shared/VehicleCard.vue'

const route = useRoute()
const queryId = useId()
const railOpen = ref(false)

const modes: { value: PriceMode; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'monthly', label: 'Monthly' },
]

// The homepage search bar hands its answers over as query params, so a shopper
// arrives with their budget already applied rather than having to say it twice.
const initialMaxPrice = Number(route.query.maxPrice) || ''
const initialMaxMonthly = Number(route.query.maxMonthly) || ''

const {
  filters,
  sort,
  results,
  makeOptions,
  bodyTypeOptions,
  fuelOptions,
  transmissionOptions,
  activeFilterCount,
  reset,
} = useVehicleFilters({
  priceMode: initialMaxMonthly ? 'monthly' : 'total',
  maxPrice: initialMaxPrice,
  maxMonthly: initialMaxMonthly,
  make: typeof route.query.make === 'string' ? route.query.make : '',
  bodyType: typeof route.query.bodyType === 'string' ? route.query.bodyType : '',
  fuel: typeof route.query.fuel === 'string' ? route.query.fuel : '',
  transmission: typeof route.query.transmission === 'string' ? route.query.transmission : '',
  query: typeof route.query.q === 'string' ? route.query.q : '',
})

/** `SelectMenu` speaks strings; the budget bands are numbers. */
const budget = computed<string>({
  get() {
    const value = filters.value.priceMode === 'monthly' ? filters.value.maxMonthly : filters.value.maxPrice
    return value === '' ? '' : String(value)
  },
  set(next) {
    const value = next === '' ? '' : Number(next)
    if (filters.value.priceMode === 'monthly') filters.value.maxMonthly = value
    else filters.value.maxPrice = value
  },
})

const budgetOptions = computed<SelectOption[]>(() => {
  const monthly = filters.value.priceMode === 'monthly'
  return (monthly ? monthlyBands : totalPriceBands).map((band) => ({
    value: String(band.value),
    label: band.label,
    count: countVehicles({
      ...filters.value,
      maxPrice: monthly ? '' : band.value,
      maxMonthly: monthly ? band.value : '',
    }),
  }))
})

// `featured` is represented by the select's placeholder option rather than by a
// row of its own, so the control shows "Our picks first" instead of going blank
// on a value that has no matching <option>.
const sortValue = computed<string>({
  get: () => (sort.value === 'featured' ? '' : sort.value),
  set: (next) => {
    sort.value = (next || 'featured') as SortKey
  },
})

const sortSelectOptions = computed<SelectOption[]>(() =>
  sortOptions.filter((o) => o.value !== 'featured').map((o) => ({ value: o.value, label: o.label })),
)

function toOptions(list: FilterOption[]): SelectOption[] {
  return list.map((o) => ({ value: o.value, label: o.value, count: o.count }))
}

// Switching currency invalidates the answer — £10,000 is not £10,000 a month.
function setMode(mode: PriceMode) {
  if (filters.value.priceMode === mode) return
  filters.value.priceMode = mode
  filters.value.maxPrice = ''
  filters.value.maxMonthly = ''
}

function clearAll() {
  reset()
}
</script>

<style scoped>
.mode-btn {
  @apply flex-1 rounded-control px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 ease-out hover:text-ink;
}

.mode-btn.is-active {
  @apply bg-paper-soft text-accent shadow-card;
}
</style>
