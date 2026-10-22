import { ref, watch } from 'vue'
import type { PriceMode } from './useVehicleFilters'

const STORAGE_KEY = 'price-mode'

function readStored(): PriceMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'monthly' ? 'monthly' : 'total'
  } catch {
    return 'total'
  }
}

// Module-level so the search bar, the stock filters and every card read one choice.
const priceMode = ref<PriceMode>(readStored())

watch(priceMode, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable: the choice just lasts for this visit */
  }
})

export function usePriceMode() {
  return { priceMode }
}
