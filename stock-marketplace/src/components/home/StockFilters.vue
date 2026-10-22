<template>
  <form class="flex flex-col gap-5" role="search" aria-label="Filter the stock" @submit.prevent>
    <PriceModeToggle :search="search" />

    <div>
      <label class="field-label" for="f-query">Search</label>
      <input
        id="f-query"
        type="search"
        class="field"
        placeholder="Make, model or colour"
        autocomplete="off"
        :value="search.filters.value.query"
        @input="search.setFilter('query', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <div>
        <label class="field-label" for="f-make">Make</label>
        <select
          id="f-make"
          class="field"
          :value="search.filters.value.make"
          @change="search.setFilter('make', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Any make</option>
          <option
            v-for="option in search.makeOptions.value"
            :key="option.value"
            :value="option.value"
            :disabled="option.count === 0 && option.value !== search.filters.value.make"
          >
            {{ option.value }} ({{ option.count }})
          </option>
        </select>
      </div>
      <div>
        <label class="field-label" for="f-model">Model</label>
        <select
          id="f-model"
          class="field disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!search.filters.value.make"
          :value="search.filters.value.model"
          @change="search.setFilter('model', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ search.filters.value.make ? 'Any model' : 'Choose a make first' }}</option>
          <option v-for="model in search.modelOptions.value" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>
    </div>

    <fieldset>
      <legend class="field-label">Body type</legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in search.bodyTypeOptions.value"
          :key="option.value"
          type="button"
          class="chip disabled:cursor-not-allowed disabled:opacity-50"
          :aria-pressed="search.filters.value.bodyType === option.value"
          :disabled="option.count === 0 && search.filters.value.bodyType !== option.value"
          @click="
            search.setFilter(
              'bodyType',
              search.filters.value.bodyType === option.value ? '' : option.value,
            )
          "
        >
          {{ option.value }}
          <span class="tabular opacity-70">{{ option.count }}</span>
        </button>
      </div>
    </fieldset>

    <fieldset>
      <legend class="field-label">Transmission</legend>
      <div class="flex gap-2">
        <button
          v-for="gearbox in ['Automatic', 'Manual']"
          :key="gearbox"
          type="button"
          class="chip"
          :aria-pressed="search.filters.value.transmission === gearbox"
          @click="
            search.setFilter(
              'transmission',
              search.filters.value.transmission === gearbox ? '' : gearbox,
            )
          "
        >
          {{ gearbox }}
        </button>
      </div>
    </fieldset>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <div>
        <label class="field-label" for="f-fuel">Fuel</label>
        <select
          id="f-fuel"
          class="field"
          :value="search.filters.value.fuel"
          @change="search.setFilter('fuel', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Any fuel</option>
          <option v-for="fuel in search.fuelOptions.value" :key="fuel" :value="fuel">{{ fuel }}</option>
        </select>
      </div>

      <div v-if="search.mode.value === 'cash'">
        <label class="field-label" for="f-price">Max price</label>
        <select
          id="f-price"
          class="field"
          :value="search.filters.value.maxPrice"
          @change="search.setFilter('maxPrice', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">No maximum</option>
          <option v-for="band in PRICE_BANDS" :key="band" :value="String(band)">
            Up to {{ formatCurrency(band) }}
          </option>
        </select>
      </div>
      <div v-else>
        <label class="field-label" for="f-monthly">Max monthly payment</label>
        <select
          id="f-monthly"
          class="field"
          :value="search.filters.value.maxMonthly"
          @change="search.setFilter('maxMonthly', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">No maximum</option>
          <option v-for="band in MONTHLY_BANDS" :key="band" :value="String(band)">
            Up to {{ formatCurrency(band) }}/mo
          </option>
        </select>
      </div>

      <div>
        <label class="field-label" for="f-year">Year</label>
        <select
          id="f-year"
          class="field"
          :value="search.filters.value.minYear"
          @change="search.setFilter('minYear', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Any year</option>
          <option v-for="year in YEAR_BANDS" :key="year" :value="String(year)">{{ year }} or newer</option>
        </select>
      </div>

      <div>
        <label class="field-label" for="f-mileage">Mileage</label>
        <select
          id="f-mileage"
          class="field"
          :value="search.filters.value.maxMileage"
          @change="search.setFilter('maxMileage', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Any mileage</option>
          <option v-for="band in MILEAGE_BANDS" :key="band" :value="String(band)">
            Under {{ new Intl.NumberFormat('en-GB').format(band) }} miles
          </option>
        </select>
      </div>
    </div>

    <button type="button" class="btn-ghost w-full" @click="search.reset()">Clear all filters</button>
  </form>
</template>

<script setup lang="ts">
import {
  MILEAGE_BANDS,
  MONTHLY_BANDS,
  PRICE_BANDS,
  YEAR_BANDS,
  formatCurrency,
} from '../../composables/useStockSearch'
import type { StockSearch } from '../../composables/useStockSearch'
import PriceModeToggle from '../shared/PriceModeToggle.vue'

defineProps<{ search: StockSearch }>()
</script>
