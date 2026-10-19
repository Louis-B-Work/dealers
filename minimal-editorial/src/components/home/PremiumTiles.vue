<template>
  <section class="py-16 md:py-20">
    <SectionHeading eyebrow="Explore" title="Where would you like to start?" size="sm" />

    <!-- Two-up at every width. Four across renders the tiles too small to read
         as photography inside the homepage's left column, and a single column
         on mobile stacks four portrait tiles into a very tall run — so the
         mobile pair is squared off and tightened instead. -->
    <div class="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5">
      <RouterLink
        v-for="(tile, i) in tiles"
        :key="tile.label"
        :to="tile.to"
        class="tile group relative block aspect-square overflow-hidden bg-ink sm:aspect-[3/4]"
        data-reveal
        :data-reveal-delay="i * 90"
      >
        <img
          :src="tile.image"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-[900ms] ease-premium group-hover:scale-[1.07] group-hover:grayscale-0"
          @error="onImageError"
        />

        <!-- Editorial scrim. Weighted to the foot of the tile, where the
             caption sits, and lifted very slightly on hover so the photograph
             comes forward as the card is engaged. -->
        <div
          class="absolute inset-0 transition-opacity duration-700 ease-premium group-hover:opacity-80"
          style="
            background: linear-gradient(
              to top,
              rgba(10, 10, 10, 0.82) 0%,
              rgba(10, 10, 10, 0.34) 46%,
              rgba(10, 10, 10, 0.12) 100%
            );
          "
        ></div>

        <!-- Caption bracketed by two drawn rules, which grow to full width as
             the tile is hovered. -->
        <div class="absolute inset-x-0 bottom-0 flex flex-col items-center px-[9%] pb-[10%] sm:pb-[12%]">
          <span class="tile-rule"></span>
          <span class="tile-label my-3 sm:my-5">{{ tile.label }}</span>
          <span class="tile-rule"></span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeading from '../shared/SectionHeading.vue'

// Hotlinked Pexels stills (CC0). They are rendered greyscale by default so the
// strip stays within the template's monochrome palette; colour is the reward
// for engaging with a tile rather than a permanent part of the page.
const tiles = [
  {
    label: 'Current stock',
    to: '/vehicles',
    image:
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    label: 'Sell your car',
    to: '/sell',
    image:
      'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    label: 'Finance',
    to: '/finance',
    image:
      'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    label: 'News & events',
    to: '/about',
    image:
      'https://images.pexels.com/photos/1077785/pexels-photo-1077785.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

// A dead CDN leaves the tile as a flat black panel with its caption intact,
// rather than a broken-image icon.
function onImageError(event: Event) {
  ;(event.target as HTMLImageElement).style.display = 'none'
}
</script>

<style scoped>
.tile-rule {
  @apply h-px w-full origin-center scale-x-[0.72] bg-paper/70 transition-transform duration-700 ease-premium;
}

.tile:hover .tile-rule,
.tile:focus-visible .tile-rule {
  @apply scale-x-100;
}

/* The caption has to survive a tile roughly half the width on mobile, so the
   type steps down and the tracking loosens only once there is room for it. */
.tile-label {
  @apply text-center text-[0.58rem] font-medium uppercase leading-tight tracking-[0.16em] text-paper transition-[letter-spacing] duration-700 ease-premium sm:text-[0.72rem] sm:tracking-[0.24em];
}

.tile:hover .tile-label,
.tile:focus-visible .tile-label {
  @apply tracking-[0.22em] sm:tracking-[0.3em];
}

@media (prefers-reduced-motion: reduce) {
  .tile-rule,
  .tile-label {
    transition: none;
  }
}
</style>
