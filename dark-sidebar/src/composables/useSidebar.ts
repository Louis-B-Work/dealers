import { ref, watch } from 'vue'

const STORAGE_KEY = 'sidebar-collapsed'

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

// Module-level so the rail, the page offset in App.vue and the reopen button
// all read the same state.
const collapsed = ref(readStored())

watch(collapsed, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    /* storage unavailable: the choice just lasts for this visit */
  }
})

export function useSidebar() {
  return { collapsed, toggle: () => (collapsed.value = !collapsed.value) }
}
