<template>
  <form class="searchbar card p-3 sm:p-4" @submit.prevent="submit">
    <!-- Budget is asked in whichever currency the shopper actually thinks in.
         The toggle sits above the row rather than inside it, so the row stays
         a row and the first control is always the budget. -->
    <div class="flex items-center justify-between gap-3">
      <PriceModeToggle />

      <RouterLink to="/sell" class="hidden text-sm font-semibold text-accent hover:underline sm:inline">
        or sell us your car
      </RouterLink>
    </div>

    <div class="mt-3 grid gap-2 lg:grid-cols-[1.15fr_1fr_1fr_auto]">
      <SelectMenu
        v-model="budget"
        :options="budgetOptions"
        :placeholder="priceMode === 'monthly' ? 'Any monthly budget' : 'Any price'"
        :label="priceMode === 'monthly' ? 'Your monthly budget' : 'Your budget'"
      />

      <SelectMenu v-model="make" :options="makeOptions" placeholder="Any make" label="Make" />

      <div>
        <label :for="modelId" class="field-label">Model</label>
        <input
          :id="modelId"
          v-model.trim="query"
          type="search"
          class="field"
          placeholder="Any model"
          autocomplete="off"
        />
      </div>

      <div class="flex items-end">
        <button type="submit" class="btn-primary h-[46px] w-full lg:w-auto lg:px-8">
          <AppIcon name="search" :size="17" />
          Search
          <span class="font-normal opacity-80">({{ count }})</span>
        </button>
      </div>
    </div>

    <RouterLink to="/sell" class="mt-3 block text-center text-sm font-semibold text-accent sm:hidden">
      or sell us your car
    </RouterLink>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  countVehicles,
  monthlyBands,
  totalPriceBands,
} from '../../composables/useVehicleFilters'
import { usePriceMode } from '../../composables/usePriceMode'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import PriceModeToggle from '../shared/PriceModeToggle.vue'
import SelectMenu from '../shared/SelectMenu.vue'
import type { SelectOption } from '../shared/SelectMenu.vue'

const router = useRouter()
const modelId = useId()

const { priceMode } = usePriceMode()
const budget = ref('')
const make = ref('')
const query = ref('')

// Switching currency invalidates the answer: £10,000 is not £10,000 a month.
watch(priceMode, () => {
  budget.value = ''
})

const budgetOptions = computed<SelectOption[]>(() => {
  const bands = priceMode.value === 'monthly' ? monthlyBands : totalPriceBands
  return bands.map((band) => ({
    value: String(band.value),
    label: band.label,
    count: countVehicles(currentFilters(band.value)),
  }))
})

const makeOptions = computed<SelectOption[]>(() => {
  const counts = new Map<string, number>()
  for (const v of vehicles) counts.set(v.make, (counts.get(v.make) ?? 0) + 1)
  return Array.from(counts.keys())
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: value,
      count: countVehicles({ ...currentFilters(), make: value }),
    }))
})

const count = computed(() => countVehicles(currentFilters()))

/** `budgetOverride` lets the budget options count themselves. */
function currentFilters(budgetOverride?: number) {
  const value: number | '' = budgetOverride ?? (budget.value ? Number(budget.value) : '')
  return {
    priceMode: priceMode.value,
    maxPrice: priceMode.value === 'total' ? value : '',
    maxMonthly: priceMode.value === 'monthly' ? value : '',
    make: make.value,
    query: query.value,
  }
}

// A make that no longer exists inside the chosen budget would otherwise sit in
// the select showing "(0)" and return nothing.
watch([budget, priceMode], () => {
  if (make.value && countVehicles({ ...currentFilters(), make: make.value }) === 0) {
    make.value = ''
  }
})

function submit() {
  const params: Record<string, string> = {}
  if (budget.value) {
    params[priceMode.value === 'monthly' ? 'maxMonthly' : 'maxPrice'] = budget.value
  }
  if (make.value) params.make = make.value
  if (query.value) params.q = query.value
  router.push({ name: 'vehicles', query: params })
}
</script>

<style scoped>
.mode-btn {
  @apply rounded-control px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 ease-out hover:text-ink;
}

.mode-btn.is-active {
  @apply bg-paper-soft text-accent shadow-card;
}
</style>
