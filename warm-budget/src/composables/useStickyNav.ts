import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Tracks whether the page has been scrolled off the top, so the bar can lift
 * a shadow. The bar itself does not resize: condensing it made it jump.
 */
export function useStickyNav(threshold = 24) {
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
