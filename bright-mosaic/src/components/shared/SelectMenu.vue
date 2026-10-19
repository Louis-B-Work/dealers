<template>
  <div ref="root" class="search-cell" :class="{ 'is-open': open }">
    <AppIcon :name="icon" :size="18" class="search-icon" />

    <button
      ref="trigger"
      type="button"
      class="search-trigger"
      role="combobox"
      :aria-label="label"
      :aria-expanded="open"
      :aria-controls="listId"
      aria-haspopup="listbox"
      :aria-activedescendant="activeDescendant"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      {{ selectedLabel }}
    </button>

    <AppIcon
      name="chevron"
      :size="16"
      class="search-arrow"
      :class="{ 'rotate-180': open }"
    />

    <!-- Points into the gutter toward the next step. Row layout only; when the
         fields stack the order already reads top-to-bottom. -->
    <AppIcon
      v-if="showNext"
      name="arrow"
      :size="18"
      class="next-hint"
      aria-hidden="true"
    />

    <transition name="menu">
      <ul
        v-if="open"
        :id="listId"
        ref="list"
        class="select-menu"
        :class="flipUp ? 'is-up' : 'is-down'"
        role="listbox"
        :aria-label="label"
      >
        <li
          v-for="(opt, i) in options"
          :id="optionId(i)"
          :key="opt.value"
          class="select-option"
          :class="{ 'is-active': i === activeIndex, 'is-selected': opt.value === modelValue }"
          role="option"
          :aria-selected="opt.value === modelValue"
          :aria-haspopup="hasBranch(opt) ? 'listbox' : undefined"
          :aria-expanded="hasBranch(opt) ? branchIndex === i : undefined"
          @click="choose(i)"
          @mousemove="onOptionHover(i, $event)"
        >
          <span class="truncate">{{ opt.label }}</span>
          <span class="flex shrink-0 items-center gap-1.5">
            <AppIcon v-if="opt.value === modelValue" name="check" :size="16" />
            <AppIcon
              v-if="hasBranch(opt)"
              name="chevron"
              :size="14"
              class="-rotate-90 opacity-50"
            />
          </span>
        </li>
      </ul>
    </transition>

    <!-- Branch panel: sits outside the scrolling list so it is never clipped. -->
    <transition name="menu">
      <ul
        v-if="branchOption"
        ref="branch"
        class="select-branch"
        :style="{ top: `${branchTop}px` }"
        role="listbox"
        :aria-label="`${branchOption.label} models`"
      >
        <li
          v-for="(child, ci) in branchOption.children"
          :id="childId(branchIndex, ci)"
          :key="child.value"
          class="select-option"
          :class="{ 'is-active': ci === activeChild, 'is-selected': isChildSelected(child.value) }"
          role="option"
          :aria-selected="isChildSelected(child.value)"
          @click.stop="chooseChild(ci)"
          @mousemove="onChildHover(ci, $event)"
        >
          <span class="truncate">{{ child.label }}</span>
          <AppIcon
            v-if="isChildSelected(child.value)"
            name="check"
            :size="16"
            class="shrink-0"
          />
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

interface SelectOption {
  value: string | number
  label: string
  children?: SelectOption[]
}

const props = defineProps<{
  modelValue: string | number
  options: SelectOption[]
  icon: string
  label: string
  disabled?: boolean
  childValue?: string | number
  showNext?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number, child?: string | number]
}>()

const listId = `select-menu-${++instanceCount}`

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLElement | null>(null)
const branch = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const flipUp = ref(false)
const branchIndex = ref(-1)
const activeChild = ref(-1)
const branchTop = ref(0)
// Branches need horizontal room, so they are a pointer/keyboard affordance on
// wider viewports only; the standalone Model field covers narrow screens.
const canBranch = ref(false)

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue))
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label ?? '')
const branchOption = computed(() =>
  branchIndex.value >= 0 ? props.options[branchIndex.value] : undefined,
)
const activeDescendant = computed(() => {
  if (!open.value) return undefined
  if (branchOption.value && activeChild.value >= 0) {
    return childId(branchIndex.value, activeChild.value)
  }  return activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
})

function optionId(i: number) {
  return `${listId}-opt-${i}`
}

function childId(i: number, ci: number) {
  return `${listId}-opt-${i}-child-${ci}`
}

function hasBranch(opt: SelectOption) {
  return canBranch.value && !!opt.children?.length
}

let lastPointerX = -1
let lastPointerY = -1

// Closing a panel re-runs hit-testing and fires a mousemove at unchanged
// coordinates, which would otherwise let a stationary pointer hijack the
// keyboard position. Only treat genuine movement as a hover.
function pointerMoved(event: MouseEvent) {
  if (event.clientX === lastPointerX && event.clientY === lastPointerY) return false
  lastPointerX = event.clientX
  lastPointerY = event.clientY
  return true
}

function isChildSelected(value: string | number) {
  return branchOption.value?.value === props.modelValue && value === props.childValue
}

function openMenu() {
  if (props.disabled) return
  open.value = true
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0
  nextTick(() => {
    // Open upward when the panel would otherwise run past the viewport.
    const rect = root.value?.getBoundingClientRect()
    const height = list.value?.offsetHeight ?? 0
    if (rect) {
      const below = window.innerHeight - rect.bottom
      flipUp.value = below < height + 16 && rect.top > below
    }
    scrollActiveIntoView()
  })
}

function closeMenu(refocus = false) {
  open.value = false
  activeIndex.value = -1
  closeBranch()
  if (refocus) trigger.value?.focus()
}

function toggle() {
  open.value ? closeMenu() : openMenu()
}

function closeBranch() {
  branchIndex.value = -1
  activeChild.value = -1
}

function openBranch(i: number, focusFirst = false) {
  if (!open.value) return
  branchIndex.value = i
  activeChild.value = focusFirst ? 0 : -1
  nextTick(positionBranch)
}

function positionBranch() {
  const menuEl = list.value
  const optionEl = menuEl?.children[branchIndex.value] as HTMLElement | undefined
  if (!menuEl || !optionEl) return
  // Option position within the scrolled list, translated into cell coordinates.
  let top = menuEl.offsetTop + optionEl.offsetTop - menuEl.scrollTop
  const cellTop = root.value?.getBoundingClientRect().top ?? 0
  const height = branch.value?.offsetHeight ?? 0
  const maxTop = window.innerHeight - height - 16 - cellTop
  branchTop.value = Math.max(-cellTop + 16, Math.min(top, maxTop))
}

function onOptionHover(i: number, event: MouseEvent) {
  // The list stays mounted for the duration of its leave transition, so its
  // handlers can still fire after closeMenu(). Without this guard a pointer
  // crossing a row on the way out re-opens a branch that nothing will close.
  if (!open.value) return
  if (!pointerMoved(event)) return
  activeIndex.value = i
  const opt = props.options[i]
  if (opt && hasBranch(opt)) {
    if (branchIndex.value !== i) openBranch(i)
  } else if (branchIndex.value !== -1) {
    closeBranch()
  }
}

function onChildHover(ci: number, event: MouseEvent) {
  if (!open.value) return
  if (!pointerMoved(event)) return
  activeChild.value = ci
}

function choose(i: number) {
  const opt = props.options[i]
  if (!opt) return
  emit('update:modelValue', opt.value)
  closeMenu(true)
}

function chooseChild(ci: number) {
  const parent = branchOption.value
  const child = parent?.children?.[ci]
  if (!parent || !child) return
  emit('update:modelValue', parent.value, child.value)
  closeMenu(true)
}

const inBranch = computed(() => !!branchOption.value && activeChild.value >= 0)

function move(delta: number) {
  // A hover-opened branch is only a preview; arrows stay on the parent list
  // until the user steps in with ArrowRight (or hovers a child directly).
  if (inBranch.value) {
    const children = branchOption.value?.children ?? []
    if (!children.length) return
    activeChild.value = Math.min(Math.max(activeChild.value + delta, 0), children.length - 1)
    return
  }
  if (!props.options.length) return
  activeIndex.value = Math.min(
    Math.max(activeIndex.value + delta, 0),
    props.options.length - 1,
  )
  closeBranch()
  nextTick(scrollActiveIntoView)
}

function scrollActiveIntoView() {
  list.value
    ?.querySelector<HTMLElement>('.is-active')
    ?.scrollIntoView({ block: 'nearest' })
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      open.value ? move(1) : openMenu()
      break
    case 'ArrowUp':
      event.preventDefault()
      open.value ? move(-1) : openMenu()
      break
    case 'ArrowRight': {
      if (!open.value) return
      const opt = props.options[activeIndex.value]
      if (opt && hasBranch(opt) && !branchOption.value) {
        event.preventDefault()
        openBranch(activeIndex.value, true)
      }
      break
    }
    case 'ArrowLeft':
      if (!open.value || !branchOption.value) return
      event.preventDefault()
      closeBranch()
      break
    case 'Home':
      if (!open.value) return
      event.preventDefault()
      if (inBranch.value) activeChild.value = 0
      else {
        activeIndex.value = 0
        closeBranch()
        nextTick(scrollActiveIntoView)
      }
      break
    case 'End':
      if (!open.value) return
      event.preventDefault()
      if (inBranch.value) activeChild.value = (branchOption.value?.children?.length ?? 1) - 1
      else {
        activeIndex.value = props.options.length - 1
        closeBranch()
        nextTick(scrollActiveIntoView)
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!open.value) openMenu()
      else if (inBranch.value) chooseChild(activeChild.value)
      else choose(activeIndex.value)
      break
    case 'Escape':
      if (!open.value) return
      event.preventDefault()
      // Step out of the branch first, then out of the menu.
      if (branchOption.value) closeBranch()
      else closeMenu(true)
      break
    case 'Tab':
      if (open.value) closeMenu()
      break
  }
}

function onPointerDown(event: MouseEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) closeMenu()
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('mousedown', onPointerDown)
  else document.removeEventListener('mousedown', onPointerDown)
})

// A shrinking option list (e.g. Model resetting when Make changes) must not
// leave the menu open on stale entries.
watch(
  () => props.options,
  () => {
    if (open.value) closeMenu()
  },
)

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled && open.value) closeMenu()
  },
)

let mq: MediaQueryList | undefined
function onBreakpoint(event: MediaQueryListEvent) {
  canBranch.value = event.matches
  if (!event.matches) closeBranch()
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)')
  canBranch.value = mq.matches
  mq.addEventListener('change', onBreakpoint)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onPointerDown)
  mq?.removeEventListener('change', onBreakpoint)
})
</script>

<script lang="ts">
let instanceCount = 0
</script>

<style scoped>
/* Mirrors the hero search bar: translucent over video, solid once the
   surrounding `.group` form is hovered or focused. */
.search-cell {
  @apply relative flex min-h-[48px] items-center gap-3.5 rounded-control px-4 py-1.5 transition hover:bg-paper-soft;
}

/* Sits in the grid gutter, centred between this field and the next. */
.next-hint {
  @apply pointer-events-none absolute left-full top-1/2 ml-4 hidden -translate-x-1/2 -translate-y-1/2 text-accent md:block;
}
.search-icon {
  @apply shrink-0 text-ink-muted group-hover:text-accent group-focus-within:text-accent;
  transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.search-trigger {
  @apply w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-left text-sm font-medium text-ink outline-none group-hover:text-ink group-focus-within:text-ink;
  transition: color 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.search-trigger:disabled {
  @apply cursor-not-allowed text-ink-muted group-hover:text-ink-muted group-focus-within:text-ink-muted;
}
.search-arrow {
  @apply pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted group-hover:text-ink-muted group-focus-within:text-ink-muted;
  /* Colour cross-fades with the bar; the open/close rotation stays snappy. */
  transition:
    color 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* The bar also latches solid once a filter is chosen; contents must follow.
   Tailwind has no variant for an arbitrary parent class, so these are written
   against the parent form's `.group.is-active` directly. */
.group.is-active .search-icon {
  @apply text-accent;
}
.group.is-active .search-trigger {
  @apply text-ink;
}
.group.is-active .search-trigger:disabled {
  @apply text-ink-muted;
}
.group.is-active .search-arrow {
  @apply text-ink-muted;
}

.select-menu {
  @apply absolute left-0 right-0 z-30 max-h-60 overflow-y-auto rounded-panel border border-line bg-surface p-1.5 shadow-lift;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--c-line)) transparent;
}
.select-menu::-webkit-scrollbar {
  width: 6px;
}
.select-menu::-webkit-scrollbar-track {
  background: transparent;
}
.select-menu::-webkit-scrollbar-thumb {
  background: rgb(var(--c-line));
  border-radius: 999px;
}
.select-menu.is-down {
  @apply top-[calc(100%+0.5rem)];
}
.select-menu.is-up {
  @apply bottom-[calc(100%+0.5rem)];
}
.select-option {
  @apply flex cursor-pointer items-center justify-between gap-3 rounded-control px-3.5 py-2.5 text-sm font-medium text-ink transition-colors;
}
.select-option.is-selected {
  @apply text-accent;
}
/* Listed after `is-selected` so a highlighted row that is also the current
   selection still reads white-on-red rather than accent-on-accent. */
.select-option.is-active,
.select-option:hover {
  @apply bg-accent text-white;
}

.select-branch {
  @apply absolute left-[calc(100%+0.375rem)] z-40 max-h-60 w-56 overflow-y-auto rounded-panel border border-line bg-surface p-1.5 shadow-lift;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--c-line)) transparent;
}
.select-branch::-webkit-scrollbar {
  width: 6px;
}
.select-branch::-webkit-scrollbar-track {
  background: transparent;
}
.select-branch::-webkit-scrollbar-thumb {
  background: rgb(var(--c-line));
  border-radius: 999px;
}

.menu-enter-active,
.menu-leave-active {
  @apply transition duration-200 ease-premium;
}
.menu-enter-from,
.menu-leave-to {
  @apply -translate-y-1 opacity-0;
}
.is-up.menu-enter-from,
.is-up.menu-leave-to {
  @apply translate-y-1;
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }
}
</style>
