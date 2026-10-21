<template>
  <div class="relative" @pointermove="onMove" @pointerleave="hovered = null">
    <ol class="border-t border-line">
      <li v-for="(car, index) in cars" :key="car.id" class="border-b border-line">
        <RouterLink
          :to="{ name: 'vehicle', params: { id: car.id } }"
          class="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] rounded-control items-center gap-x-4 gap-y-1 py-5 transition-colors duration-300 hover:bg-paper-soft focus-visible:bg-paper-soft sm:px-3 md:grid-cols-[3rem_minmax(0,1fr)_7rem_9rem_10rem_2rem] md:gap-x-6 md:py-6"
          @pointerenter="onEnter($event, car)"
          @focus="hovered = null"
        >
          <!-- Below md the row leads with a thumbnail; above it, a lot number. -->
          <img
            :src="car.image"
            alt=""
            class="aspect-[4/3] w-full rounded-control object-cover md:hidden"
            loading="lazy"
            width="160"
            height="120"
          />
          <span class="tabular hidden text-xs text-ink-muted md:block">{{ String(start + index).padStart(2, '0') }}</span>

          <span class="min-w-0">
            <span class="block text-[0.65rem] uppercase tracking-[0.24em] text-ink-muted">{{ car.make }}</span>
            <span class="block truncate font-display text-xl leading-tight transition-colors group-hover:text-accent sm:text-2xl md:text-3xl">
              {{ car.model }}
              <span class="ml-2 hidden align-middle font-sans text-xs tracking-normal text-ink-muted lg:inline">{{ car.variant }}</span>
            </span>
            <span class="tabular mt-1 block text-xs text-ink-muted md:hidden">
              {{ car.year }} · {{ formatMileage(car.mileage) }}
            </span>
          </span>

          <span class="tabular hidden text-sm text-ink-soft md:block">{{ car.year }}</span>
          <span class="tabular hidden text-sm text-ink-soft md:block">{{ formatMileage(car.mileage) }}</span>
          <span class="tabular text-right font-display text-lg text-ink sm:text-xl md:text-left">
            {{ formatCurrency(car.price) }}
            <span v-if="car.badge" class="mt-0.5 block font-sans text-[0.6rem] uppercase tracking-[0.22em] text-accent">{{ car.badge }}</span>
          </span>
          <AppIcon name="arrow" :size="18" class="hidden text-ink-muted transition group-hover:translate-x-1 group-hover:text-accent md:block" />
        </RouterLink>
      </li>
    </ol>

    <!-- A floating preview follows the pointer on devices that can hover. -->
    <div
      v-if="canHover"
      aria-hidden="true"
      class="pointer-events-none fixed left-0 top-0 z-40 w-[22rem] overflow-hidden rounded-panel border border-line shadow-lift transition-opacity duration-300"
      :class="hovered ? 'opacity-100' : 'opacity-0'"
      :style="{ transform: `translate3d(${pos.x + 28}px, ${pos.y - 120}px, 0)` }"
    >
      <img v-if="hovered" :src="hovered.image" alt="" class="aspect-[16/10] w-full object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCurrency, formatMileage } from '../../composables/useCollectionSearch'
import type { Vehicle } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'

withDefaults(defineProps<{ cars: Vehicle[]; start?: number }>(), { start: 1 })

const hovered = ref<Vehicle | null>(null)
const pos = reactive({ x: 0, y: 0 })
const canHover = ref(false)

function onMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  pos.x = Math.min(event.clientX, window.innerWidth - 400)
  pos.y = Math.max(event.clientY, 140)
}

// Scrolling moves rows under a still pointer, so position comes from the entry event too.
function onEnter(event: PointerEvent, car: Vehicle) {
  if (event.pointerType !== 'mouse') return
  onMove(event)
  hovered.value = car
}

onMounted(() => {
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches
})
</script>
