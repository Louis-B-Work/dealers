import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import { vehicles as allVehicles } from '../data/vehicles'
import type { Vehicle } from '../data/vehicles'

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc'
export type PriceMode = 'cash' | 'monthly'
export type ViewMode = 'grid' | 'list'

export interface StockFilters {
  query: string
  make: string
  model: string
  bodyType: string
  fuel: string
  transmission: string
  /** Numeric limits are strings so they bind straight to selects; '' means any. */
  maxPrice: string
  maxMonthly: string
  minYear: string
  maxMileage: string
}

export const FILTER_KEYS = [
  'query',
  'make',
  'model',
  'bodyType',
  'fuel',
  'transmission',
  'maxPrice',
  'maxMonthly',
  'minYear',
  'maxMileage',
] as const satisfies readonly (keyof StockFilters)[]

export const PRICE_BANDS = [8000, 10000, 12500, 15000, 20000, 25000, 30000] as const
export const MONTHLY_BANDS = [100, 150, 200, 250, 300, 350, 400] as const
export const YEAR_BANDS = [2016, 2018, 2020, 2021, 2022] as const
export const MILEAGE_BANDS = [20000, 30000, 40000, 50000] as const
export const PAGE_SIZE = 9

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'year-desc', label: 'Newest first' },
  { value: 'mileage-asc', label: 'Lowest mileage' },
]

const SORT_KEYS = SORT_OPTIONS.map((option) => option.value)

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)

export const formatMileage = (value: number): string =>
  `${new Intl.NumberFormat('en-GB').format(value)} miles`

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

/** The one place a filter set is applied, so counts and results never disagree. */
export function applyFilters(list: Vehicle[], f: StockFilters): Vehicle[] {
  const query = f.query.trim().toLowerCase()
  return list.filter((v) => {
    if (f.make && v.make !== f.make) return false
    if (f.model && v.model !== f.model) return false
    if (f.bodyType && v.bodyType !== f.bodyType) return false
    if (f.fuel && v.fuel !== f.fuel) return false
    if (f.transmission && v.transmission !== f.transmission) return false
    if (f.maxPrice && v.price > Number(f.maxPrice)) return false
    if (f.maxMonthly && v.monthlyFrom > Number(f.maxMonthly)) return false
    if (f.minYear && v.year < Number(f.minYear)) return false
    if (f.maxMileage && v.mileage > Number(f.maxMileage)) return false
    if (query) {
      const haystack = `${v.make} ${v.model} ${v.variant} ${v.colour}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
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
      return sorted.sort((a, b) => b.year - a.year || a.price - b.price)
    case 'mileage-asc':
      return sorted.sort((a, b) => a.mileage - b.mileage)
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price)
  }
}

const first = (value: LocationQuery[string]): string => {
  const raw = Array.isArray(value) ? value[0] : value
  return raw ?? ''
}

/**
 * Stock search whose state lives in the URL query, so a search can be
 * bookmarked, shared and survives a refresh. Works on both `/` and `/vehicles`.
 */
export function useStockSearch() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<StockFilters>(() => {
    const q = route.query
    const next = Object.fromEntries(FILTER_KEYS.map((key) => [key, first(q[key])])) as unknown as StockFilters
    return next
  })

  const sort = computed<SortKey>(() => {
    const value = first(route.query.sort) as SortKey
    return SORT_KEYS.includes(value) ? value : 'featured'
  })
  const mode = computed<PriceMode>(() => (first(route.query.show) === 'monthly' ? 'monthly' : 'cash'))
  const view = computed<ViewMode>(() => (first(route.query.view) === 'list' ? 'list' : 'grid'))

  function write(patch: Record<string, string>) {
    const merged: Record<string, string> = {}
    for (const [key, value] of Object.entries(route.query)) {
      const single = first(value)
      if (single) merged[key] = single
    }
    Object.assign(merged, patch)
    for (const key of Object.keys(merged)) if (!merged[key]) delete merged[key]
    router.replace({ path: route.path, query: merged, hash: route.hash })
  }

  function setFilter<K extends keyof StockFilters>(key: K, value: string) {
    const patch: Record<string, string> = { [key]: value }
    if (key === 'make') patch.model = ''
    write(patch)
  }

  function setSort(value: SortKey) {
    write({ sort: value === 'featured' ? '' : value })
  }

  function setMode(value: PriceMode) {
    // The two price limits are alternatives, so switching clears the other.
    write({ show: value === 'monthly' ? 'monthly' : '', maxPrice: '', maxMonthly: '' })
  }

  function setView(value: ViewMode) {
    write({ view: value === 'list' ? 'list' : '' })
  }

  function clearFilter(key: keyof StockFilters) {
    setFilter(key, '')
  }

  function reset() {
    write({
      ...Object.fromEntries(FILTER_KEYS.map((key) => [key, ''])),
      sort: '',
    })
  }

  const results = computed(() => sortVehicles(applyFilters(allVehicles, filters.value), sort.value))

  const makeOptions = computed(() =>
    unique(allVehicles.map((v) => v.make)).map((make) => ({
      value: make,
      count: applyFilters(allVehicles, { ...filters.value, make, model: '' }).length,
    })),
  )

  const modelOptions = computed(() =>
    filters.value.make
      ? unique(allVehicles.filter((v) => v.make === filters.value.make).map((v) => v.model))
      : [],
  )

  const bodyTypeOptions = computed(() =>
    unique(allVehicles.map((v) => v.bodyType)).map((value) => ({
      value,
      count: applyFilters(allVehicles, { ...filters.value, bodyType: value }).length,
    })),
  )

  const fuelOptions = computed(() => unique(allVehicles.map((v) => v.fuel)))

  const activeFilters = computed(() => {
    const f = filters.value
    const chips: { key: keyof StockFilters; label: string }[] = []
    if (f.query) chips.push({ key: 'query', label: `“${f.query}”` })
    if (f.make) chips.push({ key: 'make', label: f.make })
    if (f.model) chips.push({ key: 'model', label: f.model })
    if (f.bodyType) chips.push({ key: 'bodyType', label: f.bodyType })
    if (f.fuel) chips.push({ key: 'fuel', label: f.fuel })
    if (f.transmission) chips.push({ key: 'transmission', label: f.transmission })
    if (f.maxPrice) chips.push({ key: 'maxPrice', label: `Up to ${formatCurrency(Number(f.maxPrice))}` })
    if (f.maxMonthly)
      chips.push({ key: 'maxMonthly', label: `Up to ${formatCurrency(Number(f.maxMonthly))}/mo` })
    if (f.minYear) chips.push({ key: 'minYear', label: `${f.minYear} or newer` })
    if (f.maxMileage)
      chips.push({ key: 'maxMileage', label: `Under ${new Intl.NumberFormat('en-GB').format(Number(f.maxMileage))} miles` })
    return chips
  })

  // "Show more" reveals further results; any change to the search starts again.
  const shown = ref(PAGE_SIZE)
  watch([filters, sort], () => {
    shown.value = PAGE_SIZE
  })
  const visible = computed(() => results.value.slice(0, shown.value))
  const hasMore = computed(() => results.value.length > shown.value)
  function showMore() {
    shown.value += PAGE_SIZE
  }

  return {
    filters,
    sort,
    mode,
    view,
    results,
    visible,
    hasMore,
    showMore,
    makeOptions,
    modelOptions,
    bodyTypeOptions,
    fuelOptions,
    activeFilters,
    setFilter,
    setSort,
    setMode,
    setView,
    clearFilter,
    reset,
  }
}

export type StockSearch = ReturnType<typeof useStockSearch>
