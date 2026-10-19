import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Tracks whether the page has been scrolled past a threshold so the nav can
 * transition from transparent (over the hero) to a solid, condensed state.
 */
export function useStickyNav(threshold = 40) {
  const scrolled = ref(false)

  function onScroll() {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { scrolled }
}
