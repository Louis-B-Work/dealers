import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

interface MarqueeOptions {
  /** Pixels per second. Slow enough to read, not so slow it looks broken. */
  speed?: number
  /** How many times the rail repeats its items. Must match the markup. */
  copies?: number
  /** Held true while the shopper is touching, dragging or hovering the rail. */
  paused: Ref<boolean>
}

/**
 * Drifts a rail sideways forever, looping seamlessly.
 *
 * The rail must render its items more than once. Rewinding by a whole number
 * of copies lands on identical content, so the reset is invisible.
 *
 * The rewind distance has to be reachable: a rail can only scroll to
 * `scrollWidth - clientWidth`, so rewinding by one copy is impossible when a
 * single copy is wider than that. We therefore rewind by the largest whole
 * number of copies that fits inside the scrollable range, and if not even one
 * fits the marquee stays put rather than stalling at the end and snapping
 * back.
 *
 * Manual scrolling always wins. The loop re-reads the live scroll position
 * every frame, so a swipe, a drag or a keypress moves the rail and the drift
 * simply carries on from wherever the shopper left it.
 */
export function useMarquee(rail: Ref<HTMLElement | null>, options: MarqueeOptions) {
  const { speed = 26, copies = 2, paused } = options

  const running = ref(false)

  let frame = 0
  let lastTime = 0
  let position = 0
  let lastApplied = -1
  let visible = true
  let observer: IntersectionObserver | null = null

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Distance to rewind by: the largest whole number of copies that still sits
   * inside the scrollable range. Zero means a seamless loop is impossible at
   * this width.
   */
  function rewindDistance(el: HTMLElement) {
    const cycle = el.scrollWidth / copies
    const maxScroll = el.scrollWidth - el.clientWidth
    if (cycle <= 0 || maxScroll <= 0) return 0
    return Math.floor(maxScroll / cycle) * cycle
  }

  /** Only worth running when the rail can actually complete a loop. */
  function canRun() {
    const el = rail.value
    if (!el || !visible || document.hidden || prefersReducedMotion()) return false
    return rewindDistance(el) > 0
  }

  function step(time: number) {
    const el = rail.value
    if (!el) return stop()

    const delta = lastTime ? (time - lastTime) / 1000 : 0
    lastTime = time

    // Someone else moved the rail (a swipe, a drag, a focus jump). Take their
    // position as the new truth rather than fighting it.
    if (Math.abs(el.scrollLeft - lastApplied) > 1) position = el.scrollLeft

    if (!paused.value) {
      const rewind = rewindDistance(el)
      position += speed * Math.min(delta, 0.1)
      if (rewind > 0 && position >= rewind) position -= rewind
      el.scrollLeft = position
      lastApplied = el.scrollLeft
    }

    frame = requestAnimationFrame(step)
  }

  function start() {
    if (running.value || !canRun()) return
    running.value = true
    lastTime = 0
    position = rail.value?.scrollLeft ?? 0
    lastApplied = position
    frame = requestAnimationFrame(step)
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    running.value = false
  }

  function refresh() {
    if (canRun()) start()
    else stop()
  }

  function onVisibilityChange() {
    if (document.hidden) stop()
    else refresh()
  }

  onMounted(() => {
    const el = rail.value
    if (!el) return

    // A rail scrolled off screen does not need to burn frames.
    observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        refresh()
      },
      { threshold: 0 },
    )
    observer.observe(el)

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', refresh)
    refresh()
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('resize', refresh)
  })

  // Pausing leaves the loop running so it can pick the position back up
  // without a jump; only the advance is skipped.
  watch(paused, () => refresh())

  return { running, refresh }
}
