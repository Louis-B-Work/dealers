import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import { vehicles as allVehicles } from '../data/vehicles'
import type { Vehicle } from '../data/vehicles'

export type SortKey = 'featured' | 'price-desc' | 'price-asc' | 'year-desc' | 'mileage-asc'
export type ViewMode = 'catalogue' | 'gallery'

export interface CollectionFilters {
  query: string
  make: string
  model: string
  bodyType: string
  fuel: string
  /** Numeric limits are strings so they bind straight to selects; '' means any. */
  maxPrice: string
  minYear: string
}

export const FILTER_KEYS = ['query', 'make', 'model', 'bodyType', 'fuel', 'maxPrice', 'minYear'] as const satisfies readonly (keyof CollectionFilters)[]

export const PRICE_BANDS = [50000, 75000, 100000, 125000, 150000] as const
export const YEAR_BANDS = [2020, 2021, 2022, 2023] as const
export const PAGE_SIZE = 8

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Curated order' },
  { value: 'price-desc', label: 'Price, highest first' },
  { value: 'price-asc', label: 'Price, lowest first' },
  { value: 'year-desc', label: 'Newest first' },
  { value: 'mileage-asc', label: 'Lowest mileage' },
]
const SORT_KEYS = SORT_OPTIONS.map((option) => option.value)

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)

export const formatMileage = (value: number): string => `${new Intl.NumberFormat('en-GB').format(value)} miles`

const unique = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))

export const makesInStock = (): string[] => unique(allVehicles.map((v) => v.make))
export const modelsFor = (make: string): string[] =>
  make ? unique(allVehicles.filter((v) => v.make === make).map((v) => v.model)) : []

/** The one place a filter set is applied, so counts and results never disagree. */
export function applyFilters(list: Vehicle[], f: CollectionFilters): Vehicle[] {
  const query = f.query.trim().toLowerCase()
  return list.filter((v) => {
    if (f.make && v.make !== f.make) return false
    if (f.model && v.model !== f.model) return false
    if (f.bodyType && v.bodyType !== f.bodyType) return false
    if (f.fuel && v.fuel !== f.fuel) return false
    if (f.maxPrice && v.price > Number(f.maxPrice)) return false
    if (f.minYear && v.year < Number(f.minYear)) return false
    if (query && !`${v.make} ${v.model} ${v.variant} ${v.colour}`.toLowerCase().includes(query)) return false
    return true
  })
}

export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'year-desc':
      return sorted.sort((a, b) => b.year - a.year || b.price - a.price)
    case 'mileage-asc':
      return sorted.sort((a, b) => a.mileage - b.mileage)
    default:
      // Curated: featured cars first, then the most valuable.
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price)
  }
}

const first = (value: LocationQuery[string]): string => (Array.isArray(value) ? value[0] : value) ?? ''

/**
 * Collection search whose state lives in the URL query, so a search can be
 * bookmarked, shared and survives a refresh.
 */
export function useCollectionSearch() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<CollectionFilters>(
    () => Object.fromEntries(FILTER_KEYS.map((key) => [key, first(route.query[key])])) as unknown as CollectionFilters,
  )
  const sort = computed<SortKey>(() => {
    const value = first(route.query.sort) as SortKey
    return SORT_KEYS.includes(value) ? value : 'featured'
  })
  const view = computed<ViewMode>(() => (first(route.query.view) === 'gallery' ? 'gallery' : 'catalogue'))

  function write(patch: Record<string, string>) {
    const merged: Record<string, string> = {}
    for (const [key, value] of Object.entries(route.query)) {
      const single = first(value)
      if (single) merged[key] = single
    }
    Object.assign(merged, patch)
    for (const key of Object.keys(merged)) if (!merged[key]) delete merged[key]
    router.replace({ path: route.path, query: merged })
  }

  // A model only makes sense within its make, so changing the make clears it.
  const setFilter = (key: keyof CollectionFilters, value: string) =>
    write(key === 'make' ? { make: value, model: '' } : { [key]: value })
  const setSort = (value: SortKey) => write({ sort: value === 'featured' ? '' : value })
  const setView = (value: ViewMode) => write({ view: value === 'gallery' ? 'gallery' : '' })
  const reset = () => write({ ...Object.fromEntries(FILTER_KEYS.map((key) => [key, ''])), sort: '' })

  const results = computed(() => sortVehicles(applyFilters(allVehicles, filters.value), sort.value))

  const makeOptions = computed(() =>
    unique(allVehicles.map((v) => v.make)).map((make) => ({
      value: make,
      count: applyFilters(allVehicles, { ...filters.value, make, model: '' }).length,
    })),
  )
  const modelOptions = computed(() => modelsFor(filters.value.make))
  const bodyTypeOptions = computed(() => unique(allVehicles.map((v) => v.bodyType)))
  const fuelOptions = computed(() => unique(allVehicles.map((v) => v.fuel)))

  const activeCount = computed(() => FILTER_KEYS.filter((key) => filters.value[key]).length)

  const shown = ref(PAGE_SIZE)
  watch([filters, sort], () => {
    shown.value = PAGE_SIZE
  })
  const visible = computed(() => results.value.slice(0, shown.value))
  const hasMore = computed(() => results.value.length > shown.value)
  const showMore = () => {
    shown.value += PAGE_SIZE
  }

  return {
    filters,
    sort,
    view,
    results,
    visible,
    hasMore,
    showMore,
    makeOptions,
    modelOptions,
    bodyTypeOptions,
    fuelOptions,
    activeCount,
    setFilter,
    setSort,
    setView,
    reset,
  }
}
