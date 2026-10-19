<template>
  <section class="bg-paper-sink/60 u-section">
    <div class="u-gutter-wide w-full">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          :title="`${dealer.rating.score} out of 5 from ${dealer.rating.count.toLocaleString('en-GB')} reviews`"
          subtitle="Every review below is from a real customer on our forecourt."
        />
        <div class="flex shrink-0 items-center gap-4">
          <p class="flex items-center gap-1 text-highlight">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="22" filled />
          </p>
          <!-- The rail scrolls natively by swipe and keyboard; these are for
               anyone driving it with a mouse on a wide screen. -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rail-button"
              aria-label="Previous reviews"
              :aria-controls="railId"
              :disabled="atStart"
              @click="scrollByItem(-1)"
            >
              <AppIcon name="chevron-left" :size="18" />
            </button>
            <button
              type="button"
              class="rail-button"
              aria-label="More reviews"
              :aria-controls="railId"
              :disabled="atEnd"
              @click="scrollByItem(1)"
            >
              <AppIcon name="chevron-right" :size="18" />
            </button>
          </div>
        </div>
      </div>

      <ul
        :id="railId"
        ref="rail"
        tabindex="0"
        aria-label="Customer reviews"
        class="u-scroll-hide mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
        :class="[canScroll && 'is-draggable', dragging && 'is-dragging', (dragging || settling) && 'is-unsnapped']"
        v-on="dragHandlers"
      >
        <li
          v-for="(review, index) in reviews"
          :key="review.name"
          class="w-[19rem] shrink-0 sm:w-[22rem]"
          :class="index === reviews.length - 1 ? 'snap-end' : 'snap-start'"
        >
          <article class="card flex h-full flex-col p-5 sm:p-6">
            <p class="flex items-center gap-0.5 text-highlight">
              <AppIcon v-for="n in review.score" :key="n" name="star" :size="16" filled />
            </p>
            <blockquote class="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
              “{{ review.body }}”
            </blockquote>
            <footer class="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-wash font-display text-sm font-semibold text-accent"
              >
                {{ review.name.charAt(0) }}
              </span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-ink">{{ review.name }}</span>
                <span class="block truncate text-xs text-ink-muted">{{ review.context }}</span>
              </span>
            </footer>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDragScroll } from '../../composables/useDragScroll'
import { dealer } from '../../data/dealer'
import AppIcon from '../shared/AppIcon.vue'
import SectionHeading from '../shared/SectionHeading.vue'

const railId = 'reviews-rail'

const rail = ref<HTMLElement | null>(null)

// The arrows advance by exactly one card; the step is measured from the rail.
const { atStart, atEnd, canScroll, dragging, settling, dragHandlers, scrollByItem } =
  useDragScroll(rail)

const reviews = [
  {
    name: 'Sarah W.',
    context: 'Bought a Ford Fiesta',
    score: 5,
    body: 'No pushy sales at all. I said what I could afford a month and they showed me three cars that fitted, not the most expensive thing on the forecourt. Drove it away the same week.',
  },
  {
    name: 'Danny R.',
    context: 'Part-exchanged a Corsa',
    score: 5,
    body: 'They settled the finance on my old car and it was all sorted in an afternoon. Gave me a proper price for it too, better than the online buyers were offering.',
  },
  {
    name: 'Priya M.',
    context: 'Bought a Nissan Qashqai',
    score: 5,
    body: 'First car I have bought on finance and they talked me through the whole thing without making me feel daft. A small issue two weeks later was fixed under warranty, no argument.',
  },
  {
    name: 'Tom H.',
    context: 'Bought a VW Polo',
    score: 5,
    body: 'Rang on the Saturday, test drove it on the Sunday and picked it up on the Tuesday with a fresh MOT and a full tank. Everything they said on the phone was true when I got there.',
  },
  {
    name: 'Claire B.',
    context: 'Bought a Kia Sportage',
    score: 5,
    body: 'I had a decline elsewhere and assumed that was that. They found me a lender who would look at it properly and the payment came in under what I had budgeted.',
  },
  {
    name: 'Mo A.',
    context: 'Bought a Ford Focus',
    score: 4,
    body: 'Good car at a fair price and no haggling needed. It took an extra day to get the second key cut, but they kept me posted and posted it out at their own cost.',
  },
  {
    name: 'Janet P.',
    context: 'Bought a Hyundai i10',
    score: 5,
    body: 'Bought my first car here twenty years ago and just bought my granddaughter hers. Same family, same honest approach, and they still remember your name when you walk in.',
  },
  {
    name: 'Ryan T.',
    context: 'Bought a BMW 3 Series',
    score: 5,
    body: 'They sent me a full walkaround video before I drove over, so there were no surprises. The service history and the inspection report were both on the desk waiting for me.',
  },
]
</script>

<style scoped>
.rail-button {
  @apply flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors duration-150 ease-out hover:bg-paper-sink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-paper disabled:hover:text-ink-soft;
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

/* `ul.` beats Tailwind's `.snap-x` on specificity, so the override lands
   whichever order the stylesheets end up in. */
ul.is-unsnapped {
  scroll-snap-type: none;
}

ul.is-dragging {
  user-select: none;
}
</style>

