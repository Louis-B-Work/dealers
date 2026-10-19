import { onMounted, onUnmounted } from 'vue'

/**
 * Reveals elements carrying a `data-reveal` attribute as they scroll into
 * view. Honours `prefers-reduced-motion` (elements are shown immediately).
 */
export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.revealDelay
            if (delay) el.style.transitionDelay = `${delay}ms`
            el.classList.add('is-revealed')
            observer?.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
