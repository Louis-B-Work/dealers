<template>
  <div ref="root" class="relative" @mouseleave="onLeave" @keydown="onKeydown">
    <button
      ref="trigger"
      type="button"
      class="group relative flex items-center gap-1.5 text-sm font-medium transition-colors"
      :class="[
        onDark ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-ink',
        childActive && (onDark ? 'text-white' : 'text-ink'),
      ]"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="toggle"
      @mouseenter="onEnter"
    >
      {{ label }}
      <AppIcon
        name="chevron"
        :size="14"
        class="transition-transform duration-200 ease-premium"
        :class="{ 'rotate-180': open }"
      />
      <span
        class="absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ease-premium"
        :class="open || childActive ? 'w-full' : 'w-0 group-hover:w-full'"
      ></span>
    </button>

    <transition name="navmenu">
      <!-- Wrapper carries transparent top padding so the pointer can travel
           from trigger to panel without leaving the hover region. -->
      <div
        v-if="open"
        class="absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 pt-4"
      >
        <ul ref="list" class="rounded-panel border border-line bg-surface p-1.5 shadow-lift">
          <li v-for="(item, i) in items" :key="item.to">
            <RouterLink
              :to="item.to"
              class="nav-menu-item"
              :class="{ 'is-active': i === activeIndex }"
              @click="close()"
              @mousemove="onItemHover(i, $event)"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../shared/AppIcon.vue'

const props = defineProps<{
  label: string
  items: { label: string; to: string }[]
  onDark?: boolean
}>()

const route = useRoute()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)

const childActive = computed(() => props.items.some((i) => i.to === route.path))

let lastPointerX = -1
let lastPointerY = -1

// Closing a panel re-runs hit-testing and fires a mousemove at unchanged
// coordinates, which would let a stationary pointer hijack keyboard focus.
function pointerMoved(event: MouseEvent) {
  if (event.clientX === lastPointerX && event.clientY === lastPointerY) return false
  lastPointerX = event.clientX
  lastPointerY = event.clientY
  return true
}

function onItemHover(i: number, event: MouseEvent) {
  if (!pointerMoved(event)) return
  activeIndex.value = i
}

function openMenu(focusFirst = false) {
  open.value = true
  activeIndex.value = focusFirst ? 0 : -1
  if (focusFirst) nextTick(focusActive)
}

function close(refocus = false) {
  open.value = false
  activeIndex.value = -1
  if (refocus) trigger.value?.focus()
}

function toggle() {
  open.value ? close() : openMenu()
}

function onEnter() {
  open.value = true
}

function onLeave() {
  close()
}

function focusActive() {
  list.value?.querySelectorAll<HTMLElement>('a')[activeIndex.value]?.focus()
}

function move(delta: number) {
  const next = activeIndex.value + delta
  activeIndex.value = Math.min(Math.max(next, 0), props.items.length - 1)
  nextTick(focusActive)
}

// Bound on the root so arrow/Escape keys still work once focus has moved into
// the panel; at that point keydowns fire on the link, not the trigger.
function onKeydown(event: KeyboardEvent) {
  const onTrigger = event.target === trigger.value

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      open.value ? move(1) : openMenu(true)
      break
    case 'ArrowUp':
      event.preventDefault()
      if (open.value) move(-1)
      break
    case 'Home':
      if (!open.value || onTrigger) return
      event.preventDefault()
      activeIndex.value = 0
      nextTick(focusActive)
      break
    case 'End':
      if (!open.value || onTrigger) return
      event.preventDefault()
      activeIndex.value = props.items.length - 1
      nextTick(focusActive)
      break
    case 'Enter':
    case ' ':
      // On a link, let the browser activate it normally.
      if (!onTrigger) return
      event.preventDefault()
      open.value ? close(true) : openMenu(true)
      break
    case 'Escape':
      if (!open.value) return
      event.preventDefault()
      close(true)
      break
    case 'Tab':
      if (open.value) close()
      break
  }
}

function onPointerDown(event: MouseEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) close()
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('mousedown', onPointerDown)
  else document.removeEventListener('mousedown', onPointerDown)
})

watch(() => route.fullPath, () => close())

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onPointerDown)
})
</script>

<style scoped>
.nav-menu-item {
  @apply block rounded-control px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors;
}
.nav-menu-item.router-link-active {
  @apply text-accent;
}
/* Listed last so the highlight wins over the current-route colour. */
.nav-menu-item:hover,
.nav-menu-item.is-active,
.nav-menu-item:focus-visible {
  @apply bg-accent text-white;
}

.navmenu-enter-active,
.navmenu-leave-active {
  @apply transition duration-200 ease-premium;
}
.navmenu-enter-from,
.navmenu-leave-to {
  @apply -translate-y-1 opacity-0;
}

@media (prefers-reduced-motion: reduce) {
  .navmenu-enter-active,
  .navmenu-leave-active {
    transition: none;
  }
}
</style>
