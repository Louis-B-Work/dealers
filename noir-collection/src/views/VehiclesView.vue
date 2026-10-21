<template>
  <div>
    <PageHeader
      title="The Collection"
      current="The Collection"
      :subtitle="`${vehicles.length} exceptional cars, each inspected and presented. Viewings are by appointment.`"
      :image="headerImage"
    />

    <div class="u-gutter py-10 lg:py-14">
      <!-- Refinements: a single quiet bar on desktop, a toggled panel on smaller screens. -->
      <div class="flex flex-wrap items-center gap-4 border-b border-line pb-6">
        <p class="mr-auto text-sm text-ink-soft" role="status" aria-live="polite">
          <span class="tabular font-display text-3xl text-ink">{{ search.results.value.length }}</span>
          {{ search.results.value.length === 1 ? 'car' : 'cars' }}
        </p>

        <button
          type="button"
          class="btn-ghost px-5 py-3 lg:hidden"
          :aria-expanded="refineOpen"
          aria-controls="refine"
          @click="refineOpen = !refineOpen"
        >
          <AppIcon name="sliders" :size="15" />
          Refine<span v-if="search.activeCount.value" class="tabular">&nbsp;({{ search.activeCount.value }})</span>
        </button>

        <div class="flex items-center gap-3">
          <label for="sort" class="hidden text-[0.68rem] uppercase tracking-[0.2em] text-ink-muted sm:inline">Order</label>
          <select id="sort" class="field w-auto py-2.5" :value="search.sort.value" @change="search.setSort(($event.target as HTMLSelectElement).value as SortKey)">
            <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="flex overflow-hidden rounded-control border border-line" role="group" aria-label="Layout">
          <button
            v-for="option in views"
            :key="option.value"
            type="button"
            class="px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.2em] transition"
            :class="search.view.value === option.value ? 'bg-accent text-accent-ink' : 'text-ink-soft hover:text-ink'"
            :aria-pressed="search.view.value === option.value"
            @click="search.setView(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <form
        id="refine"
        class="gap-5 border-b border-line py-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(5,1fr)_auto] lg:items-end"
        :class="refineOpen ? 'grid' : 'hidden lg:grid'"
        role="search"
        aria-label="Refine the collection"
        @submit.prevent
      >
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="field-label" for="r-query">Search</label>
          <input id="r-query" type="search" class="field" placeholder="Marque, model or colour" :value="search.filters.value.query" @input="search.setFilter('query', ($event.target as HTMLInputElement).value)" />
        </div>
        <div>
          <label class="field-label" for="r-make">Marque</label>
          <select id="r-make" class="field" :value="search.filters.value.make" @change="search.setFilter('make', ($event.target as HTMLSelectElement).value)">
            <option value="">All marques</option>
            <option v-for="option in search.makeOptions.value" :key="option.value" :value="option.value" :disabled="option.count === 0 && option.value !== search.filters.value.make">
              {{ option.value }} ({{ option.count }})
            </option>
          </select>
        </div>
        <div>
          <label class="field-label" for="r-model">Model</label>
          <select id="r-model" class="field disabled:cursor-not-allowed disabled:opacity-50" :disabled="!search.filters.value.make" :value="search.filters.value.model" @change="search.setFilter('model', ($event.target as HTMLSelectElement).value)">
            <option value="">{{ search.filters.value.make ? 'All models' : 'Choose a marque first' }}</option>
            <option v-for="model in search.modelOptions.value" :key="model" :value="model">{{ model }}</option>
          </select>
        </div>
        <div>
          <label class="field-label" for="r-body">Body style</label>
          <select id="r-body" class="field" :value="search.filters.value.bodyType" @change="search.setFilter('bodyType', ($event.target as HTMLSelectElement).value)">
            <option value="">All styles</option>
            <option v-for="body in search.bodyTypeOptions.value" :key="body" :value="body">{{ body }}</option>
          </select>
        </div>
        <div>
          <label class="field-label" for="r-price">Price up to</label>
          <select id="r-price" class="field" :value="search.filters.value.maxPrice" @change="search.setFilter('maxPrice', ($event.target as HTMLSelectElement).value)">
            <option value="">Any price</option>
            <option v-for="band in PRICE_BANDS" :key="band" :value="String(band)">{{ formatCurrency(band) }}</option>
          </select>
        </div>
        <div>
          <label class="field-label" for="r-year">Year from</label>
          <select id="r-year" class="field" :value="search.filters.value.minYear" @change="search.setFilter('minYear', ($event.target as HTMLSelectElement).value)">
            <option value="">Any year</option>
            <option v-for="year in YEAR_BANDS" :key="year" :value="String(year)">{{ year }}</option>
          </select>
        </div>
        <button type="button" class="text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-accent hover:underline sm:justify-self-start lg:pb-3.5" @click="search.reset()">
          Clear all
        </button>
      </form>

      <div class="mt-10">
        <template v-if="search.results.value.length">
          <CatalogueList v-if="search.view.value === 'catalogue'" :cars="search.visible.value" />
          <ul v-else class="grid gap-x-8 gap-y-14 md:grid-cols-2">
            <li v-for="(car, index) in search.visible.value" :key="car.id">
              <CollectionCard :car="car" :eager="index < 2" />
            </li>
          </ul>
        </template>

        <div v-else class="rounded-panel border border-line px-6 py-20 text-center">
          <h2 class="u-h2">No cars match those refinements.</h2>
          <p class="mx-auto mt-5 max-w-md text-ink-soft">
            Widen the search, or tell us what you are looking for and we will keep an eye out.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" class="btn-accent" @click="search.reset()">Show the full collection</button>
            <RouterLink :to="{ path: '/contact', query: { subject: 'General enquiry' } }" class="btn-ghost">Tell us what you need</RouterLink>
          </div>
        </div>

        <div v-if="search.hasMore.value" class="mt-12 text-center">
          <button type="button" class="btn-ghost" @click="search.showMore()">
            Show more
            <span class="tabular text-ink-muted">({{ search.results.value.length - search.visible.value.length }})</span>
          </button>
        </div>
      </div>

      <p class="mt-14 max-w-3xl text-xs leading-relaxed text-ink-muted">
        Monthly figures are illustrations at a representative {{ REPRESENTATIVE_APR }}% APR over {{ QUOTE_TERM_MONTHS }}
        months with no deposit. Finance is subject to status. {{ brokerDisclosure }} Photography is illustrative and
        credited on the photo credits page.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import CatalogueList from '../components/shared/CatalogueList.vue'
import CollectionCard from '../components/shared/CollectionCard.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { PRICE_BANDS, SORT_OPTIONS, YEAR_BANDS, formatCurrency, useCollectionSearch } from '../composables/useCollectionSearch'
import type { SortKey, ViewMode } from '../composables/useCollectionSearch'
import { QUOTE_TERM_MONTHS, REPRESENTATIVE_APR, brokerDisclosure } from '../data/dealer'
import { getVehicleById, vehicles } from '../data/vehicles'

const search = useCollectionSearch()
const refineOpen = ref(false)
const headerImage = getVehicleById('range-rover-2023')?.image ?? ''

const views: { value: ViewMode; label: string }[] = [
  { value: 'catalogue', label: 'Catalogue' },
  { value: 'gallery', label: 'Gallery' },
]
</script>
