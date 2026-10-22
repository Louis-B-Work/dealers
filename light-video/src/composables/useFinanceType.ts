import { ref } from 'vue'

export type FinanceType = 'hp' | 'pcp'

// Module-level so the calculator and the HP vs PCP explainer share one choice.
const financeType = ref<FinanceType>('pcp')

export function useFinanceType() {
  return { financeType }
}
