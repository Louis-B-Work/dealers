import { computed, ref } from 'vue'
import { vehicles as allVehicles } from '../data/vehicles'
import type { Vehicle } from '../data/vehicles'

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'year-desc'
  | 'mileage-asc'

export interface VehicleFilters {
  make: string
  bodyType: string
  fuel: string
  query: string
  /** Upper price limit as a string, so it binds straight to a select; '' means any. */
  maxPrice: string
  /** Upper monthly-payment limit, used when shopping by monthly cost; '' means any. */
  maxMonthly: string
}

/** Budget ceilings offered by the hero chips and the VLP filter. */
export const BUDGET_BANDS = [5000, 8000, 10000, 12000, 15000] as const

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

export function useVehicleFilters(initial: Partial<VehicleFilters> = {}) {
  const filters = ref<VehicleFilters>({
    make: initial.make ?? '',
    bodyType: initial.bodyType ?? '',
    fuel: initial.fuel ?? '',
    query: initial.query ?? '',
    maxPrice: initial.maxPrice ?? '',
    maxMonthly: initial.maxMonthly ?? '',
  })

  const sort = ref<SortKey>('featured')

  const makeOptions = computed(() => uniqueSorted(allVehicles.map((v) => v.make)))
  const bodyTypeOptions = computed(() => uniqueSorted(allVehicles.map((v) => v.bodyType)))
  const fuelOptions = computed(() => uniqueSorted(allVehicles.map((v) => v.fuel)))

  const results = computed<Vehicle[]>(() => {
    const f = filters.value
    const query = f.query.trim().toLowerCase()

    const list = allVehicles.filter((v) => {
      if (f.make && v.make !== f.make) return false
      if (f.bodyType && v.bodyType !== f.bodyType) return false
      if (f.fuel && v.fuel !== f.fuel) return false
      if (f.maxPrice && v.price > Number(f.maxPrice)) return false
      if (f.maxMonthly && v.monthlyFrom > Number(f.maxMonthly)) return false
      if (query) {
        const haystack = `${v.make} ${v.model} ${v.variant} ${v.colour}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    const sorted = [...list]
    switch (sort.value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'year-desc':
        sorted.sort((a, b) => b.year - a.year)
        break
      case 'mileage-asc':
        sorted.sort((a, b) => a.mileage - b.mileage)
        break
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price)
    }
    return sorted
  })

  function reset() {
    filters.value = { make: '', bodyType: '', fuel: '', query: '', maxPrice: '', maxMonthly: '' }
    sort.value = 'featured'
  }

  const activeFilterCount = computed(() => {
    const f = filters.value
    return [f.make, f.bodyType, f.fuel, f.query, f.maxPrice, f.maxMonthly].filter(Boolean).length
  })

  return {
    filters,
    sort,
    results,
    makeOptions,
    bodyTypeOptions,
    fuelOptions,
    activeFilterCount,
    reset,
  }
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)

export const formatMileage = (value: number): string =>
  `${new Intl.NumberFormat('en-GB').format(value)} miles`

/** Compact form for narrow cards, where the full label won't fit on one row. */
export const formatMileageShort = (value: number): string =>
  `${new Intl.NumberFormat('en-GB').format(value)} mi`
