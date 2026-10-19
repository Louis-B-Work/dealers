<template>
  <Transition name="jump">
    <button v-if="visible" type="button" class="stock-jump" @click="jump">
      <span>In stock now</span>
      <AppIcon name="scroll" :size="14" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
/**
 * A sticky shortcut down to the stock column, for mobile only.
 *
 * On a phone the homepage spread unstacks: the dealership's pitch runs first
 * and the stock sits a long way below it, so a buyer who has just used the
 * search wizard has no quick way to the cars. This carries them there.
 *
 * It appears only once the wizard has scrolled *above* the viewport — not
 * merely left it — so it never shows while the wizard is still reachable, and
 * it retires as soon as the stock column arrives, rather than sitting over the
 * cards it was pointing at.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    /** The element the button waits to get past. */
    trigger?: string
    /** Where the button scrolls to, and the thing whose arrival retires it. */
    target?: string
  }>(),
  { trigger: '.wizard', target: '#in-stock' },
)

const pastTrigger = ref(false)
const targetInView = ref(false)
const isMobile = ref(false)

const visible = computed(() => isMobile.value && pastTrigger.value && !targetInView.value)

let triggerObserver: IntersectionObserver | null = null
let targetObserver: IntersectionObserver | null = null
let viewport: MediaQueryList | null = null

function onViewportChange(event: MediaQueryListEvent | MediaQueryList) {
  isMobile.value = event.matches
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function jump() {
  const el = document.querySelector<HTMLElement>(props.target)
  if (!el) return

  // The nav is fixed, so scrolling the heading to the viewport top would park
  // it underneath. Read the height rather than hard-coding it: it condenses
  // once the page has scrolled.
  const navHeight = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h-scrolled'),
  )
  const top = el.getBoundingClientRect().top + window.scrollY - (navHeight || 0) - 12

  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

onMounted(() => {
  viewport = window.matchMedia('(max-width: 639px)')
  onViewportChange(viewport)
  viewport.addEventListener('change', onViewportChange)

  const triggerEl = document.querySelector(props.trigger)
  if (triggerEl) {
    triggerObserver = new IntersectionObserver(
      ([entry]) => {
        // `isIntersecting` alone cannot tell "not yet reached" from "scrolled
        // past" — both are false. The bounding rect's top settles it.
        pastTrigger.value = !entry.isIntersecting && entry.boundingClientRect.top < 0
      },
      { threshold: 0 },
    )
    triggerObserver.observe(triggerEl)
  }

  const targetEl = document.querySelector(props.target)
  if (targetEl) {
    targetObserver = new IntersectionObserver(
      ([entry]) => (targetInView.value = entry.isIntersecting),
      { threshold: 0 },
    )
    targetObserver.observe(targetEl)
  }
})

onBeforeUnmount(() => {
  triggerObserver?.disconnect()
  targetObserver?.disconnect()
  viewport?.removeEventListener('change', onViewportChange)
})
</script>

<style scoped>
/* Ink-filled and centred on the gutter, so it reads as the page's one live
   action rather than another hairline control competing with the cards. */
.stock-jump {
  @apply fixed inset-x-0 z-40 mx-auto flex w-[calc(100%-2.5rem)] max-w-[20rem] items-center justify-center gap-2.5 border border-ink bg-ink px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-paper shadow-[0_8px_28px_rgb(10_10_10/0.28)];
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}

.jump-enter-active,
.jump-leave-active {
  transition:
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.jump-enter-from,
.jump-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .jump-enter-active,
  .jump-leave-active {
    transition: none;
  }
}
</style>
