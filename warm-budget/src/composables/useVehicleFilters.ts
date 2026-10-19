import { computed, ref } from 'vue'
import { vehicles as allVehicles } from '../data/vehicles'
import type { Vehicle } from '../data/vehicles'

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'monthly-asc'
  | 'year-desc'
  | 'mileage-asc'

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Our picks first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'monthly-asc', label: 'Monthly payment: low to high' },
  { value: 'year-desc', label: 'Newest first' },
  { value: 'mileage-asc', label: 'Lowest mileage first' },
]

/**
 * Whether the budget the shopper gave us is a total price or a monthly
 * payment. This template asks for budget first and lets them answer in
 * whichever of the two they actually think in, so the mode travels with
 * the filters rather than being a property of one control.
 */
export type PriceMode = 'total' | 'monthly'

export interface VehicleFilters {
  make: string
  bodyType: string
  fuel: string
  transmission: string
  priceMode: PriceMode
  /** applied only while `priceMode` is `'total'` */
  maxPrice: number | ''
  /** applied only while `priceMode` is `'monthly'` */
  maxMonthly: number | ''
  query: string
}

export interface FilterOption {
  value: string
  /** how many vehicles this option would return, given the other filters */
  count: number
}

/** Budget bands offered when shopping by total price. */
export const totalPriceBands: { value: number; label: string }[] = [
  { value: 4000, label: 'Up to £4,000' },
  { value: 6000, label: 'Up to £6,000' },
  { value: 8000, label: 'Up to £8,000' },
  { value: 10000, label: 'Up to £10,000' },
  { value: 12500, label: 'Up to £12,500' },
  { value: 15000, label: 'Up to £15,000' },
  { value: 20000, label: 'Up to £20,000' },
]

/** Budget bands offered when shopping by monthly payment. */
export const monthlyBands: { value: number; label: string }[] = [
  { value: 100, label: 'Up to £100 a month' },
  { value: 150, label: 'Up to £150 a month' },
  { value: 200, label: 'Up to £200 a month' },
  { value: 250, label: 'Up to £250 a month' },
  { value: 300, label: 'Up to £300 a month' },
  { value: 400, label: 'Up to £400 a month' },
]

export function emptyFilters(): VehicleFilters {
  return {
    make: '',
    bodyType: '',
    fuel: '',
    transmission: '',
    priceMode: 'total',
    maxPrice: '',
    maxMonthly: '',
    query: '',
  }
}

type FilterKey = keyof VehicleFilters

/**
 * `skip` lets an option list ask "how many would there be if this filter
 * weren't applied?", which is what makes the counts beside each option
 * useful rather than circular.
 */
function matches(v: Vehicle, f: VehicleFilters, skip?: FilterKey): boolean {
  if (skip !== 'make' && f.make && v.make !== f.make) return false
  if (skip !== 'bodyType' && f.bodyType && v.bodyType !== f.bodyType) return false
  if (skip !== 'fuel' && f.fuel && v.fuel !== f.fuel) return false
  if (skip !== 'transmission' && f.transmission && v.transmission !== f.transmission) return false

  if (skip !== 'maxPrice' && skip !== 'maxMonthly') {
    if (f.priceMode === 'monthly') {
      // A vehicle we quote no monthly figure for cannot satisfy a monthly
      // budget — it isn't available on finance at all.
      if (f.maxMonthly !== '' && (v.monthlyFrom <= 0 || v.monthlyFrom > Number(f.maxMonthly))) {
        return false
      }
    } else if (f.maxPrice !== '' && v.price > Number(f.maxPrice)) {
      return false
    }
  }

  if (skip !== 'query' && f.query.trim()) {
    const haystack = `${v.make} ${v.model} ${v.variant} ${v.bodyType} ${v.colour}`.toLowerCase()
    if (!haystack.includes(f.query.trim().toLowerCase())) return false
  }

  return true
}

function sortVehicles(list: Vehicle[], key: SortKey): Vehicle[] {
  const sorted = [...list]
  switch (key) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'monthly-asc':
      // Vehicles without a monthly figure sort to the end rather than to
      // the front, which is where a plain `0` would otherwise put them.
      sorted.sort(
        (a, b) =>
          (a.monthlyFrom || Number.POSITIVE_INFINITY) - (b.monthlyFrom || Number.POSITIVE_INFINITY),
      )
      break
    case 'year-desc':
      sorted.sort((a, b) => b.year - a.year)
      break
    case 'mileage-asc':
      sorted.sort((a, b) => a.mileage - b.mileage)
      break
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price)
  }
  return sorted
}

export function useVehicleFilters(initial: Partial<VehicleFilters> = {}) {
  const filters = ref<VehicleFilters>({ ...emptyFilters(), ...initial })

  const sort = ref<SortKey>('featured')

  function optionsFor(key: 'make' | 'bodyType' | 'fuel' | 'transmission') {
    return computed<FilterOption[]>(() => {
      const pool = allVehicles.filter((v) => matches(v, filters.value, key))
      const counts = new Map<string, number>()
      for (const v of pool) {
        const value = String(v[key])
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
      return Array.from(counts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value))
    })
  }

  const makeOptions = optionsFor('make')
  const bodyTypeOptions = optionsFor('bodyType')
  const fuelOptions = optionsFor('fuel')
  const transmissionOptions = optionsFor('transmission')

  const results = computed<Vehicle[]>(() =>
    sortVehicles(
      allVehicles.filter((v) => matches(v, filters.value)),
      sort.value,
    ),
  )

  const resultCount = computed(() => results.value.length)

  const activeFilterCount = computed(() => {
    const f = filters.value
    const budgetActive = f.priceMode === 'monthly' ? f.maxMonthly !== '' : f.maxPrice !== ''
    return [f.make, f.bodyType, f.fuel, f.transmission, budgetActive ? 'b' : '', f.query.trim()]
      .filter(Boolean)
      .length
  })

  function reset() {
    filters.value = emptyFilters()
    sort.value = 'featured'
  }

  return {
    filters,
    sort,
    results,
    resultCount,
    makeOptions,
    bodyTypeOptions,
    fuelOptions,
    transmissionOptions,
    activeFilterCount,
    reset,
  }
}

/**
 * Standalone count, used by the homepage search bar and the trending-search
 * tiles — neither owns a full filter state, they just need "how many?".
 */
export function countVehicles(partial: Partial<VehicleFilters>): number {
  const f = { ...emptyFilters(), ...partial }
  return allVehicles.filter((v) => matches(v, f)).length
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
