import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Click and drag, arrow stepping and edge tracking for a horizontal rail.
 *
 * Shared by the reviews carousel and the manufacturer strip so the two behave
 * identically and cannot drift apart.
 *
 * Dragging is for mice only. Touch and trackpads already scroll a rail
 * natively with momentum, so they are left alone rather than reimplemented
 * badly.
 */
export function useDragScroll(
  rail: Ref<HTMLElement | null>,
  options: { settle?: boolean } = {},
) {
  // A marquee rail drifts continuously and carries no snap points, so gliding
  // to the nearest item on release would fight it.
  const settleOnRelease = options.settle !== false
  const atStart = ref(true)
  const atEnd = ref(false)
  /** False when everything already fits, so a rail can drop its grab cursor. */
  const canScroll = ref(false)

  // `dragging` drives the cursor and kills text selection; `settling` keeps
  // snap switched off a moment longer while the rail glides to rest.
  const dragging = ref(false)
  const settling = ref(false)

  let pointerId: number | null = null
  let startX = 0
  let startScroll = 0
  let moved = false

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function updateEdges() {
    const el = rail.value
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    canScroll.value = max > 1
    atStart.value = el.scrollLeft <= 1
    atEnd.value = el.scrollLeft >= max - 1
  }

  /**
   * Width of one item plus the gap after it, measured from the live layout
   * rather than passed in. Rail gaps are responsive, and a hard-coded figure
   * silently drifts from the CSS: settling would then land just off the real
   * snap point and the browser would jerk it the rest of the way.
   */
  function itemStep(el: HTMLElement) {
    const first = el.children[0] as HTMLElement | undefined
    const second = el.children[1] as HTMLElement | undefined
    if (first && second) return second.offsetLeft - first.offsetLeft
    return first ? first.offsetWidth : el.clientWidth
  }

  function scrollByItem(direction: 1 | -1) {
    const el = rail.value
    if (!el) return
    el.scrollBy({
      left: itemStep(el) * direction,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  /**
   * Capture is deliberately *not* taken here. Capturing on pointerdown
   * retargets the subsequent click to the rail, which swallows clicks on any
   * link inside it. It is taken on the first move past the threshold instead,
   * so a plain click still reaches the card and a real drag still tracks the
   * pointer outside the rail.
   */
  function onPointerDown(event: PointerEvent) {
    const el = rail.value
    if (!el || event.pointerType !== 'mouse' || event.button !== 0) return
    // Nothing to drag when everything already fits on screen.
    if (el.scrollWidth <= el.clientWidth) return
    pointerId = event.pointerId
    startX = event.clientX
    startScroll = el.scrollLeft
    moved = false
    dragging.value = true
    settling.value = false
  }

  function onPointerMove(event: PointerEvent) {
    const el = rail.value
    if (!el || !dragging.value || event.pointerId !== pointerId) return
    const dx = event.clientX - startX
    // A few pixels of slack, so a plain click is not mistaken for a drag.
    if (!moved && Math.abs(dx) < 4) return
    if (!moved && pointerId !== null) el.setPointerCapture(pointerId)
    moved = true
    el.scrollLeft = startScroll - dx
    event.preventDefault()
  }

  function onPointerUp(event: PointerEvent) {
    const el = rail.value
    if (!el || !dragging.value || event.pointerId !== pointerId) return
    if (pointerId !== null && el.hasPointerCapture(pointerId)) {
      el.releasePointerCapture(pointerId)
    }
    dragging.value = false
    pointerId = null

    if (!moved || !settleOnRelease) return

    // Glide to the nearest item and only restore snap once we have arrived,
    // otherwise the browser re-snaps with a jump the moment the class is gone.
    settling.value = true
    const step = itemStep(el)
    const max = el.scrollWidth - el.clientWidth
    // The end of the rail is a snap point in its own right (the last item is
    // `snap-end`), and it is not a whole number of items from the start.
    // Without it as a candidate the final item could never be pulled fully
    // into view.
    const nearest = Math.max(0, Math.min(Math.round(el.scrollLeft / step) * step, max))
    const target = Math.abs(max - el.scrollLeft) < Math.abs(nearest - el.scrollLeft) ? max : nearest

    if (prefersReducedMotion() || Math.abs(target - el.scrollLeft) < 1) {
      el.scrollLeft = target
      settling.value = false
      return
    }

    el.scrollTo({ left: target, behavior: 'smooth' })
    // Read the capability into a local first: testing it inline narrows the
    // `window` type to never in the else branch.
    const hasScrollEnd = 'onscrollend' in window
    if (hasScrollEnd) {
      el.addEventListener('scrollend', () => (settling.value = false), { once: true })
    } else {
      window.setTimeout(() => (settling.value = false), 400)
    }
  }

  /**
   * Native image and link dragging fires `pointercancel`, which tears down
   * our pointer capture mid-gesture. Rails whose items contain images or
   * links need it suppressed or the drag dies on the first move.
   */
  function onDragStart(event: DragEvent) {
    if (dragging.value) event.preventDefault()
  }

  /** Bind with `v-on` so a rail cannot forget half the handlers. */
  const dragHandlers = {
    pointerdown: onPointerDown,
    pointermove: onPointerMove,
    pointerup: onPointerUp,
    pointercancel: onPointerUp,
    dragstart: onDragStart,
    scroll: updateEdges,
  }

  onMounted(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateEdges)
  })

  return { atStart, atEnd, canScroll, dragging, settling, dragHandlers, scrollByItem, updateEdges }
}
