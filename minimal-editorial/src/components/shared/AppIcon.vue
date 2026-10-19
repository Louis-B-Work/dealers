<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    role="img"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ name: string; size?: number | string; filled?: boolean }>(),
  {
    size: 20,
    filled: false,
  },
)

const icons: Record<string, string[]> = {
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.3-4.3'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  'arrow-left': ['M19 12H5', 'm11 18-6-6 6-6'],
  chevron: ['m6 9 6 6 6-6'],
  phone: [
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  ],
  mail: ['M4 4h16v16H4z', 'm4 6 8 6 8-6'],
  pin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5l3 2'],
  gauge: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'm12 12 4-3', 'M12 12h.01'],
  fuel: ['M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16', 'M3 12h10', 'M16 8l3 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-4-4'],
  gear: [
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L16 3H8l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L8 21h8l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  ],
  calendar: ['M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z', 'M16 2v4', 'M8 2v4', 'M4 10h16'],
  car: [
    'M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M7 15h10',
    'M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v3a1 1 0 0 1-1 1h-1',
    'M6 16H5a1 1 0 0 1-1-1v-2',
  ],
  check: ['M20 6 9 17l-5-5'],
  tag: [
    'M20.6 13.3 13.3 20.6a1.9 1.9 0 0 1-2.7 0l-7.2-7.2A1.9 1.9 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12c.5 0 1 .2 1.4.6l7.2 7.2a1.9 1.9 0 0 1 0 2.7Z',
    'M7.5 8.5h.01',
  ],
  pound: ['M17 19H6', 'M9 19v-6.5', 'M6 12.5h7', 'M9 12.5V8a4 4 0 0 1 6.9-2.7'],
  star: ['m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z'],
  spark: ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'm6 6 2.5 2.5', 'm15.5 15.5 2.5 2.5', 'm18 6-2.5 2.5', 'm8.5 15.5-2.5 2.5'],
  key: ['M15 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M11.5 11.5 3 20', 'm7 15 2 2', 'm5 17 2 2'],
  seat: ['M6 20v-3', 'M18 20v-6l-2-8H9', 'M6 14h9', 'M6 6v8'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6 18 18', 'M18 6 6 18'],
  play: ['m6 4 14 8-14 8V4Z'],
  quote: ['M7 7h4v6H5v-2a4 4 0 0 1 4-4Z', 'M17 7h4v6h-6v-2a4 4 0 0 1 4-4Z'],
  sliders: ['M4 6h10', 'M18 6h2', 'M4 12h4', 'M12 12h8', 'M4 18h12', 'M20 18h.01', 'M16 4v4', 'M10 10v4', 'M18 16v4'],
  scroll: ['M12 5v14', 'm6 13 6 6 6-6'],

  // Social marks, drawn in the same stroke language as the rest of the set so
  // they inherit currentColor and stay monochrome rather than pulling each
  // platform's brand colour into a black-and-white footer.
  instagram: [
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z',
    'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z',
    'M17.5 6.5h.01',
  ],
  facebook: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z'],
  youtube: [
    'M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z',
    'm10 15 5-3-5-3v6Z',
  ],
  linkedin: [
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z',
    'M2 9h4v12H2z',
    'M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  ],
  tiktok: [
    'M21 8.5a6.5 6.5 0 0 1-5-2.3V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.2a2.8 2.8 0 1 0 2 2.7V2h3a6.5 6.5 0 0 0 5 5.1V8.5Z',
  ],
  x: ['M3 3h4.5l5 6.8L18.5 3H21l-7.3 8.3L21.5 21H17l-5.2-7.1L5.4 21H3l7.7-8.8L3 3Z'],
}

const paths = computed(() => icons[props.name] ?? [])
</script>
