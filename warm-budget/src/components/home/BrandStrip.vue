<template>
  <section class="bg-paper py-8 sm:py-10">
    <div class="u-gutter-wide w-full">
      <!-- One row at every width, drifting sideways. The list is rendered
           twice: once the drift passes the halfway mark it rewinds by exactly
           half, which lands on the identical copy so the loop is invisible. -->
      <ul
        ref="rail"
        tabindex="0"
        aria-label="Shop by manufacturer"
        class="u-scroll-hide flex gap-2 overflow-x-auto sm:gap-3"
        :class="[canScroll && 'is-draggable', dragging && 'is-dragging']"
        v-on="dragHandlers"
        @pointerenter="hovering = true"
        @pointerleave="hovering = false"
        @focusin="hovering = true"
        @focusout="hovering = false"
      >
        <li
          v-for="(brand, index) in loopedBrands"
          :key="`${brand.name}-${index}`"
          class="w-[5.25rem] shrink-0 sm:w-24 lg:w-28"
          :aria-hidden="index >= stockedBrands.length ? 'true' : undefined"
        >
          <RouterLink
            :to="{ name: 'vehicles', query: { make: brand.name } }"
            draggable="false"
            :tabindex="index >= stockedBrands.length ? -1 : undefined"
            class="tile group relative flex aspect-square items-center justify-center rounded-tile bg-paper-soft p-2.5"
          >
            <img
              v-if="hasLogo(brand)"
              :src="brand.logo"
              alt=""
              aria-hidden="true"
              draggable="false"
              loading="lazy"
              decoding="async"
              class="max-h-[60%] max-w-full object-contain"
              @error="failed.add(brand.name)"
            />
            <!-- No artwork, or it would not load: the wordmark stands in, so
                 the tile is never an empty box. -->
            <span
              v-else
              aria-hidden="true"
              class="font-display text-xs font-semibold text-ink transition-colors duration-150 ease-out group-hover:text-accent"
            >
              {{ brand.name }}
            </span>

            <!-- `relative` on the tile matters: this label is absolutely
                 positioned, and without a positioned ancestor it escapes the
                 rail's overflow clipping and stretches the page's horizontal
                 scroll area. -->
            <span class="sr-only">
              {{ brand.name }}, {{ brand.count }} {{ brand.count === 1 ? 'car' : 'cars' }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * A strip of clickable manufacturer squares, sitting directly under the hero
 * so a shopper who already knows the make can skip the search entirely.
 *
 * It drifts on its own, but the shopper always wins: hovering, focusing,
 * dragging or swiping pauses the drift, and it picks up from wherever they
 * left it. Under `prefers-reduced-motion` it never moves on its own at all.
 */
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDragScroll } from '../../composables/useDragScroll'
import { useMarquee } from '../../composables/useMarquee'
import { stockedBrands, type StockedBrand } from '../../data/brands'

const rail = ref<HTMLElement | null>(null)
const hovering = ref(false)

const { dragging, canScroll, dragHandlers } = useDragScroll(rail, { settle: false })

// Repeating the list is what makes the loop seamless. Three passes rather
// than two so that one pass is comfortably narrower than the rail itself,
// which is what the rewind needs to stay inside the scrollable range. The
// extra passes are hidden from assistive tech and skipped by the tab order.
const BRAND_COPIES = 3

const loopedBrands = computed(() =>
  Array.from({ length: BRAND_COPIES }, () => stockedBrands).flat(),
)

const paused = computed(() => hovering.value || dragging.value)
useMarquee(rail, { paused, copies: BRAND_COPIES })

const failed = reactive(new Set<string>())

function hasLogo(brand: StockedBrand) {
  return Boolean(brand.logo) && !failed.has(brand.name)
}
</script>

<style scoped>
/* Pale teal on hover rather than the full accent: the marque artwork comes
   from a third party in mixed colour profiles, and anything darker either
   swallows the dark logos or forces a knockout that flattens the ones with
   white detail inside them. The wash keeps every logo true. */
.tile {
  @apply border border-line transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out hover:-translate-y-px hover:border-accent/20 hover:bg-accent-wash hover:shadow-card-hover;
}

/* Only mice get the grab affordance; a touch device has no cursor and the
   rail already swipes. The selectors stay class-based (no `#id`) so the
   grabbing state can out-specify the resting one. */
@media (hover: hover) and (pointer: fine) {
  ul.is-draggable {
    cursor: grab;
  }

  ul.is-draggable.is-dragging {
    cursor: grabbing;
  }
}

ul.is-dragging {
  user-select: none;
}
</style>
