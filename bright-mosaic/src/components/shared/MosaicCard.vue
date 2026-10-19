<template>
  <RouterLink
    :to="{ name: 'vehicle', params: { id: vehicle.id } }"
    class="mosaic-card group"
    :class="{ 'is-large': large }"
    :aria-label="`${vehicle.year} ${vehicle.make} ${vehicle.model}, ${formatCurrency(vehicle.price)}`"
  >
    <img
      :src="vehicle.image"
      :alt="`${vehicle.make} ${vehicle.model}`"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="mosaic-img"
    />

    <!-- Softens the base so the label sits cleanly on any photo. -->
    <span class="mosaic-scrim" aria-hidden="true"></span>

    <span v-if="vehicle.badge" class="mosaic-badge">{{ vehicle.badge }}</span>

    <!-- Hidden until hover or keyboard focus on pointer devices; always shown
         on touch, where there is no hover to reveal it. -->
    <span class="mosaic-label" aria-hidden="true">
      <span class="min-w-0 truncate pl-1">
        <span class="font-bold text-ink">{{ vehicle.make }} {{ vehicle.model }}</span>
        <span v-if="large" class="ml-1.5 hidden text-ink-muted sm:inline">{{ vehicle.year }}</span>
      </span>
      <span class="price-pill">{{ formatCurrency(vehicle.price) }}</span>
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Vehicle } from '../../data/vehicles'
import { formatCurrency } from '../../composables/useVehicleFilters'

// The card fills whatever box its parent gives it: the mosaic and bento
// layouts own the shape, the card only owns the hover behaviour.
withDefaults(
  defineProps<{
    vehicle: Vehicle
    /** Bigger label for hero-sized tiles. */
    large?: boolean
    /** Above-the-fold tiles skip lazy loading. */
    eager?: boolean
  }>(),
  { large: false, eager: false },
)
</script>

<style scoped>
.mosaic-card {
  @apply relative block h-full w-full overflow-hidden rounded-panel border border-line bg-surface outline-none shadow-soft transition duration-300 ease-premium;
}
.mosaic-card:hover,
.mosaic-card:focus-visible {
  @apply border-accent shadow-lift;
}
.mosaic-card:focus-visible {
  outline: 2px solid rgb(var(--c-accent));
  outline-offset: 3px;
}

.mosaic-img {
  @apply h-full w-full object-cover transition-transform duration-700 ease-premium;
}
.mosaic-card:hover .mosaic-img,
.mosaic-card:focus-visible .mosaic-img {
  transform: scale(1.05);
}

.mosaic-scrim {
  @apply pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 ease-premium;
}

.mosaic-badge {
  @apply absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-soft;
}

.mosaic-label {
  @apply absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-full border border-white/70 bg-white/90 p-1 pl-3 text-xs shadow-soft backdrop-blur-md;
  transform: translate3d(0, calc(100% + 1rem), 0);
  opacity: 0;
  transition:
    transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;
}
.is-large .mosaic-label {
  @apply bottom-4 left-4 right-auto max-w-[calc(100%-2rem)] gap-4 text-sm;
}
.is-large .mosaic-label .price-pill {
  @apply px-4 py-1.5 text-sm;
}

.mosaic-card:hover .mosaic-label,
.mosaic-card:focus-visible .mosaic-label {
  transform: none;
  opacity: 1;
}
.mosaic-card:hover .mosaic-scrim,
.mosaic-card:focus-visible .mosaic-scrim {
  opacity: 1;
}

/* No hover on touch screens and small layouts, so the label is permanent. */
@media (hover: none), (max-width: 767px) {
  .mosaic-label {
    transform: none;
    opacity: 1;
  }
  .mosaic-scrim {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mosaic-label {
    transform: none;
    transition: opacity 150ms linear;
  }
  .mosaic-card:hover .mosaic-img,
  .mosaic-card:focus-visible .mosaic-img {
    transform: none;
  }
}
</style>
