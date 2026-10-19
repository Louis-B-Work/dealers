<template>
  <div class="wizard border border-ink bg-paper">
    <!-- Step rail. Both tabs are always live, so this is the only
         navigation the wizard needs — there is no back arrow to hunt for. -->
    <div class="grid grid-cols-2 border-b border-line">
      <button
        v-for="(s, i) in steps"
        :key="s.key"
        type="button"
        class="tab"
        :class="[i === stepIndex ? 'is-active' : '', i > 0 ? 'border-l border-line' : '']"
        :aria-current="i === stepIndex ? 'step' : undefined"
        @click="goTo(i)"
      >
        <span class="tab-num">0{{ i + 1 }}</span>
        <span class="flex min-w-0 flex-col items-start leading-none">
          <span class="text-[0.58rem] font-medium uppercase tracking-micro">{{ s.label }}</span>
          <span class="mt-1.5 hidden max-w-full truncate text-[0.72rem] text-ink-soft sm:block">
            {{ summaryFor(s.key) }}
          </span>
        </span>
      </button>
    </div>

    <!-- Control row. One row deep whatever the step, so the whole thing reads
         as a search bar rather than a form to work through. -->
    <div class="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:gap-8 lg:px-7">
      <div class="min-w-0 flex-1">
        <!-- One rail whichever step is showing, so the scroll container
             survives the step change and both steps drag identically. The
             plates always overflow at narrow widths, and the scrollbar is
             hidden, so a mouse has no other way to reach the far end. -->
        <div class="rail-frame">
          <!-- Stepping arrows, so the row does not depend on dragging or a
               hidden scrollbar being discovered. They sit outside the rail as
               flex siblings rather than over it, so they never cover a plate.
               At an end the arrow keeps its space and only loses its ink,
               otherwise the rail would jump width on the first step. -->
          <button
            v-if="canScroll"
            type="button"
            class="rail-arrow"
            :class="{ 'is-spent': atStart }"
            aria-label="Show previous options"
            @click="stepRail(-1)"
          >
            <AppIcon name="chevron" :size="13" class="rotate-90" />
          </button>

          <div
            ref="optionsRail"
            class="options-row"
            :class="[
              isGrid && 'is-grid',
              isWrap && 'is-wrap',
              canScroll && 'is-scrollable',
              dragging && 'is-dragging',
            ]"
            v-on="dragHandlers"
          >
          <!-- Make: a row of marque plates. The brand mark fills the slot where
               it exists; the wordmark stands in where it does not, or where the
               artwork fails to load, so a plate is never empty. -->
          <template v-if="currentKey === 'make'">
            <button
              v-for="option in makeOptions"
              :key="String(option.value)"
              type="button"
              class="marque"
              :class="{ 'is-selected': isMakeSelected(option.value) }"
              :aria-pressed="isMakeSelected(option.value)"
              @click="toggleMake(option.value)"
            >
              <img
                v-if="logoFor(option.label)"
                :src="logoFor(option.label)"
                class="marque-logo"
                alt=""
                aria-hidden="true"
                draggable="false"
                loading="lazy"
                decoding="async"
                @error="failed.add(option.label)"
              />
              <span v-else class="marque-name">{{ option.label }}</span>
              <!-- The plate's accessible name must survive the wordmark being
                   replaced by artwork that carries no text. `relative` on the
                   plate matters: this label is absolutely positioned, and
                   without a positioned ancestor it escapes the rail's overflow
                   clipping and stretches the page's horizontal scroll area. -->
              <span v-if="logoFor(option.label)" class="sr-only">{{ option.label }}</span>
            </button>
          </template>

          <!-- Model: plain text, because a model name is the only label that
               identifies it — there is no mark to show. -->
          <template v-else>
            <button
              v-for="option in modelOptions"
              :key="String(option.value)"
              type="button"
              class="pill"
              :class="{ 'is-selected': answered.model && answers.model === option.value }"
              @click="selectModel(option.value)"
            >
              {{ option.label }}
              <span class="pill-count tabular-nums">{{ option.count }}</span>
            </button>
          </template>
          </div>

          <button
            v-if="canScroll"
            type="button"
            class="rail-arrow"
            :class="{ 'is-spent': atEnd }"
            aria-label="Show more options"
            @click="stepRail(1)"
          >
            <AppIcon name="chevron" :size="13" class="-rotate-90" />
          </button>
        </div>
      </div>

      <div
        class="flex shrink-0 items-center justify-between gap-6 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
      >
        <p class="whitespace-nowrap text-[0.62rem] uppercase tracking-micro text-ink-muted">
          <span class="tabular-nums text-ink">{{ matchCount }}</span>
          {{ matchCount === 1 ? 'match' : 'matches' }}
        </p>
        <button
          type="button"
          class="btn-primary whitespace-nowrap px-6 py-3.5 tabular-nums"
          :disabled="matchCount === 0"
          @click="search"
        >
          View {{ matchCount }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { vehicles } from '../../data/vehicles'
import { logoForMake } from '../../data/brands'
import { useDragScroll } from '../../composables/useDragScroll'
import AppIcon from '../shared/AppIcon.vue'

type StepKey = 'make' | 'model'
type Answer = string | ''

interface Option {
  value: Answer
  label: string
  count: number
}

const router = useRouter()

// Make then model: the buyer narrows by marque first, which is how someone
// shopping this kind of stock already thinks about it.
const steps: { key: StepKey; label: string }[] = [
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
]

const stepIndex = ref(0)

// Makes are multi-select, models are not: a buyer will happily shortlist three
// marques, but "a 911 or a Cayenne" is a different search, not a broader one.
const answers = ref<{ make: string[]; model: Answer }>({ make: [], model: '' })
// An unanswered step and a step answered with "any" both hold their neutral
// value, but only the latter should read as chosen.
const answered = ref<Record<StepKey, boolean>>({ make: false, model: false })

const currentKey = computed(() => steps[stepIndex.value].key)

/**
 * The rail always overflows at narrow widths and its scrollbar is hidden, so
 * without this a mouse cannot reach the far end of the row at all. Touch and
 * trackpads already scroll it natively; this adds click-and-drag for mice.
 */
const optionsRail = ref<HTMLElement | null>(null)
const { atStart, atEnd, canScroll, dragging, dragHandlers, updateEdges } = useDragScroll(
  optionsRail,
  { settle: false },
)

/**
 * One option's worth of scroll, for the rail at `sm` and above. The shared
 * composable's own step is the gap between the first two children, which is
 * right here, but this also copes with a first child narrower than the step.
 */
function stepRail(direction: 1 | -1) {
  const el = optionsRail.value
  if (!el) return
  const children = [...el.children] as HTMLElement[]
  const first = children[0]
  if (!first) return
  const nextColumn = children.find((child) => child.offsetLeft > first.offsetLeft)
  const step = nextColumn ? nextColumn.offsetLeft - first.offsetLeft : first.offsetWidth
  el.scrollBy({
    left: step * direction,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

/**
 * Below `sm` nothing scrolls sideways. The makes lay out as a grid and the
 * models wrap, so every option is on screen at once. A rail that narrow showed
 * two plates at a time and needed arrows, which then ate the width they were
 * there to reveal; with no overflow the arrows and the edge fade drop out on
 * their own, because `canScroll` is false.
 */
const isNarrow = ref(false)
const isGrid = computed(() => isNarrow.value && currentKey.value === 'make')
const isWrap = computed(() => isNarrow.value && currentKey.value === 'model')

let viewport: MediaQueryList | null = null
function onViewportChange(event: MediaQueryListEvent | MediaQueryList) {
  isNarrow.value = event.matches
}

onMounted(() => {
  viewport = window.matchMedia('(max-width: 639px)')
  onViewportChange(viewport)
  viewport.addEventListener('change', onViewportChange)
})

onBeforeUnmount(() => viewport?.removeEventListener('change', onViewportChange))

// Swapping between grid and rail changes whether there is anything to scroll,
// so the arrows and the fade have to be re-derived from the new layout.
watch(isGrid, async () => {
  await nextTick()
  optionsRail.value?.scrollTo({ left: 0 })
  updateEdges()
})

// Artwork that 404s or is blocked leaves the plate blank, so a failed load
// falls back to the wordmark rather than being retried on every render.
const failed = reactive(new Set<string>())

/** The marque's artwork, or undefined for "Any make" and anything we hold none for. */
function logoFor(label: string): string | undefined {
  if (failed.has(label)) return undefined
  return logoForMake(label)
}

// Options with nothing behind them are dropped rather than shown disabled —
// a row of dead choices is just wasted width in a bar this size.
const makeOptions = computed<Option[]>(() => {
  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort((a, b) =>
    a.localeCompare(b),
  )
  return [
    { value: '', label: 'Any make', count: vehicles.length },
    ...makes.map((make) => ({
      value: make,
      label: make,
      count: vehicles.filter((v) => v.make === make).length,
    })),
  ]
})

const modelOptions = computed<Option[]>(() => {
  const makes = answers.value.make
  const pool = vehicles.filter((v) => makes.length === 0 || makes.includes(v.make))
  const models = Array.from(new Set(pool.map((v) => v.model))).sort((a, b) => a.localeCompare(b))
  return [
    { value: '', label: 'Any model', count: pool.length },
    ...models.map((model) => ({
      value: model,
      label: model,
      count: pool.filter((v) => v.model === model).length,
    })),
  ]
})

// The rail is one element across both steps, so a step change swaps its
// contents underneath it: rewind it and re-measure, or it keeps the previous
// step's scroll position and a stale idea of whether it can scroll at all.
watch([currentKey, makeOptions, modelOptions], async () => {
  await nextTick()
  optionsRail.value?.scrollTo({ left: 0 })
  updateEdges()
})

const matchCount = computed(
  () =>
    vehicles.filter((v) => {
      const makes = answers.value.make
      if (makes.length > 0 && !makes.includes(v.make)) return false
      if (answers.value.model && v.model !== answers.value.model) return false
      return true
    }).length,
)

/** True when a plate should read as chosen. "Any make" is chosen when nothing else is. */
function isMakeSelected(value: Answer): boolean {
  if (!answered.value.make) return false
  return value === '' ? answers.value.make.length === 0 : answers.value.make.includes(value)
}

function summaryFor(key: StepKey): string {
  if (!answered.value[key]) return 'Not set'
  if (key === 'model') return answers.value.model === '' ? 'Any model' : String(answers.value.model)

  const makes = answers.value.make
  if (makes.length === 0) return 'Any make'
  if (makes.length === 1) return makes[0]
  // Listing four marques would overrun the tab; the count is the useful part.
  return `${makes.length} makes`
}

function advance() {
  answered.value[currentKey.value] = true
  if (stepIndex.value < steps.length - 1) stepIndex.value += 1
}

/**
 * Makes toggle rather than commit, so the step cannot auto-advance the way the
 * model step does — the buyer has to be able to add a second marque. The step
 * rail doubles as the way on, which is why both tabs are always live.
 */
function toggleMake(value: Answer) {
  answered.value.make = true

  if (value === '') {
    answers.value.make = []
  } else {
    const makes = answers.value.make
    answers.value.make = makes.includes(value)
      ? makes.filter((m) => m !== value)
      : [...makes, value]
  }

  // A model chosen under a marque that is no longer selected would silently
  // filter everything out, so it is dropped rather than left dangling.
  const stillOffered = modelOptions.value.some((o) => o.value === answers.value.model)
  if (!stillOffered) {
    answers.value.model = ''
    answered.value.model = false
  }
}

function selectModel(value: Answer) {
  answers.value.model = value
  advance()
}

function goTo(i: number) {
  stepIndex.value = i
}

function search() {
  const { make, model } = answers.value
  router.push({
    name: 'vehicles',
    query: {
      // Repeated params when several marques are chosen; the VLP normalises
      // either shape, so one make still reads back as a plain string.
      ...(make.length ? { make: make.length === 1 ? make[0] : make } : {}),
      // The VLP has no model filter of its own; its free-text search covers
      // the model name, so the answer is handed over as a query instead.
      ...(model ? { q: model } : {}),
    },
  })
}
</script>

<style scoped>
.tab {
  @apply flex min-w-0 items-center gap-3 px-4 py-3.5 text-left text-ink-muted transition-colors duration-300 ease-premium hover:text-ink sm:px-5;
}

.tab.is-active {
  @apply text-ink;
}

.tab-num {
  @apply flex h-7 w-7 shrink-0 items-center justify-center border border-line text-[0.6rem] font-medium tabular-nums transition duration-300 ease-premium;
}

.tab.is-active .tab-num {
  @apply border-ink bg-ink text-paper;
}

/* Options scroll sideways rather than wrapping: the bar must stay one row
   deep at every width. The right edge fades so a part-visible plate reads as
   "there is more", not as a clipping bug. */
/* A flex row rather than a positioning context: the arrows sit beside the
   rail, so the rail simply gets narrower instead of being covered. */
.rail-frame {
  @apply flex items-center gap-1.5 sm:gap-2;
}

.rail-arrow {
  @apply flex h-7 w-7 shrink-0 items-center justify-center border border-line bg-paper text-ink-soft transition duration-300 ease-premium hover:border-ink hover:text-ink;
}

/* At an end the arrow holds its place and only loses its ink; removing it
   would hand its width back to the rail and shift every plate sideways. */
.rail-arrow.is-spent {
  @apply pointer-events-none border-line/50 text-ink-muted/30;
}

.options-row {
  @apply flex min-w-0 flex-1 items-stretch gap-2.5 overflow-x-auto pb-1;
  scrollbar-width: none;
}

/* Below `sm` nothing scrolls sideways: the makes lay out as a grid and the
   models wrap, so every option is on screen at once. That also makes
   `canScroll` false, so the arrows, the edge fade and the grab cursor all
   drop out without being suppressed. */
.options-row.is-grid {
  @apply grid grid-cols-3 gap-2 overflow-visible;
}

/* More columns as the phone gets wider, so the block stays short and the
   plates stay roughly square instead of stretching to fill three columns. */
@media (min-width: 420px) {
  .options-row.is-grid {
    @apply grid-cols-4;
  }
}

@media (min-width: 560px) {
  .options-row.is-grid {
    @apply grid-cols-5;
  }
}

.options-row.is-wrap {
  @apply flex-wrap gap-2 overflow-visible;
}

/* Compact enough that fourteen marques read as a few short rows rather than a
   column the length of the screen. */
.options-row.is-grid .marque {
  @apply h-[54px] w-full px-2;
}

.options-row.is-grid .marque-logo {
  @apply h-[26px] max-w-[80%];
}

.options-row.is-grid .marque-name {
  @apply text-[0.56rem] tracking-[0.08em];
}

.options-row.is-wrap .pill {
  @apply h-[42px] px-3.5 text-[0.6rem];
}

.options-row::-webkit-scrollbar {
  display: none;
}

/* A short fade at the trailing edge, so a part-visible plate reads as "there
   is more" rather than as a clipping bug. Shorter than it was now the arrows
   carry most of that job. */
.options-row.is-scrollable {
  -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 24px), transparent 100%);
  mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 24px), transparent 100%);
}

/* Only mice get the grab affordance; a touch device has no cursor and the
   row already swipes natively. Class-based so grabbing out-specifies rest. */
@media (hover: hover) and (pointer: fine) {
  .options-row.is-scrollable {
    cursor: grab;
  }

  .options-row.is-scrollable.is-dragging {
    cursor: grabbing;
  }
}

.options-row.is-dragging {
  user-select: none;
}

/* A marque plate — a fixed, logo-shaped slot holding either brand artwork or
   the wordmark standing in for it; the geometry is the same either way.
   Unlike the model pills, the plate does not invert to ink on hover: the
   artwork arrives in mixed colour profiles, and an ink fill either swallows
   the dark marks or forces a knockout that flattens the ones carrying light
   detail inside them (Aston Martin's wings, the Audi rings). The plate marks
   itself with weight instead, which is the same device the forms use. */
.marque {
  @apply relative flex h-[76px] w-[140px] shrink-0 items-center justify-center border border-line px-4 transition duration-300 ease-premium hover:border-ink;
}

/* Selected fills the plate with ink and knocks the mark out in white. The
   mark is reduced to a silhouette to do it — `brightness(0)` flattens every
   opaque pixel to black while keeping the alpha shape, and `invert(1)` turns
   that white — so marks carrying light detail inside them lose it (the BMW
   roundel's quarters, the text inside Land Rover's oval). That is accepted:
   the plate shows the mark in full colour at rest, and the selected state is
   a deliberate stylisation rather than a second rendering of the artwork. */
.marque.is-selected {
  @apply border-ink bg-ink text-paper;
}

.marque.is-selected .marque-logo {
  filter: brightness(0) invert(1);
}

/* With the count gone the plate is all artwork, so the mark can run much
   larger. Sized to the plate rather than to the artwork, so marques of very
   different aspect ratios still read as one row.
   The marks are shown in black and white: thirteen brand palettes at once
   fight the template's white-and-hairline restraint, and desaturating them
   lets the row read as one material. */
.marque-logo {
  @apply h-[44px] w-auto max-w-[108px] shrink-0 object-contain transition duration-300 ease-premium;
  filter: grayscale(1) contrast(1.15);
}

.marque-name {
  @apply max-w-full truncate text-[0.68rem] font-medium uppercase tracking-[0.12em];
}

.pill {
  @apply flex h-[58px] shrink-0 items-center gap-2.5 border border-line px-5 text-[0.68rem] font-medium uppercase tracking-[0.14em] transition duration-300 ease-premium hover:border-ink hover:bg-ink hover:text-paper;
}

.pill.is-selected {
  @apply border-ink bg-ink text-paper;
}

.pill-count {
  @apply text-[0.6rem] font-normal tracking-normal opacity-50;
}


</style>
