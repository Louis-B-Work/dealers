<template>
  <section class="bg-paper-sink/60 u-section">
    <div class="u-gutter-wide w-full">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title="Our latest arrivals"
          subtitle="Freshly prepared, fully checked and ready to drive away."
        />
        <RouterLink to="/vehicles" class="btn-ghost shrink-0">
          View all {{ total }} cars
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>

      <!-- A scrolling row on a phone, where four stacked cards would be a very
           long column, and a plain grid once there is width for one. -->
      <ul
        ref="rail"
        tabindex="0"
        aria-label="Our latest arrivals"
        class="u-scroll-hide mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:pb-0 lg:grid-cols-4"
        :class="[canScroll && 'is-draggable', dragging && 'is-dragging', (dragging || settling) && 'is-unsnapped']"
        v-on="dragHandlers"
      >
        <li
          v-for="(vehicle, index) in featured"
          :key="vehicle.id"
          class="w-[17rem] shrink-0 sm:w-auto"
          :class="index === featured.length - 1 ? 'snap-end' : 'snap-start'"
        >
          <VehicleCard :vehicle="vehicle" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDragScroll } from '../../composables/useDragScroll'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'
import SectionHeading from '../shared/SectionHeading.vue'
import VehicleCard from '../shared/VehicleCard.vue'

const total = vehicles.length

const rail = ref<HTMLElement | null>(null)
const { canScroll, dragging, settling, dragHandlers } = useDragScroll(rail)

// Featured first, then whatever is newest, so the row is always full even if
// nobody has flagged enough stock. Four fills the grid exactly once, keeping
// the section to a single row.
const featured = computed(() =>
  [...vehicles]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year)
    .slice(0, 4),
)
</script>

<style scoped>
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
