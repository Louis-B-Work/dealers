import { ref, watch } from 'vue'
import { formatCurrency } from './useVehicleFilters'

export type PriceMode = 'total' | 'monthly'

const STORAGE_KEY = 'price-mode'

function readStored(): PriceMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'monthly' ? 'monthly' : 'total'
  } catch {
    return 'total'
  }
}

// Module-level so every card, chip and filter on the site reads one choice.
const priceMode = ref<PriceMode>(readStored())

watch(priceMode, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable: the choice just lasts for this visit */
  }
})

/** Monthly ceilings offered when shopping by monthly cost. */
export const MONTHLY_BANDS = [100, 150, 200, 250, 300] as const

export function usePriceMode() {
  return { priceMode }
}

interface Priced {
  price: number
  monthlyFrom: number
}

/** The figure a card leads with: the cash price, or the "from" monthly payment. */
export function priceLabel(vehicle: Priced, mode: PriceMode): string {
  if (mode === 'monthly' && vehicle.monthlyFrom > 0) return `${formatCurrency(vehicle.monthlyFrom)}/mo`
  return formatCurrency(vehicle.price)
}
