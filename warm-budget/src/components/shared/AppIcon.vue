<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="strokeWidth"
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
  defineProps<{ name: string; size?: number | string; filled?: boolean; strokeWidth?: number }>(),
  {
    size: 20,
    filled: false,
    // A touch heavier than the other templates' hairline icons — this
    // template's type is semibold, and 1.5 icons look undernourished beside it.
    strokeWidth: 1.75,
  },
)

const icons: Record<string, string[]> = {
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.3-4.3'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  'arrow-left': ['M19 12H5', 'm11 18-6-6 6-6'],
  chevron: ['m6 9 6 6 6-6'],
  'chevron-left': ['m15 6-6 6 6 6'],
  'chevron-right': ['m9 6 6 6-6 6'],
  phone: [
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  ],
  mail: ['M4 4h16v16H4z', 'm4 6 8 6 8-6'],
  pin: [
    'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z',
    'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  ],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5l3 2'],
  gauge: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'm12 12 4-3', 'M12 12h.01'],
  fuel: [
    'M3 22h12',
    'M4 9h10',
    'M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18',
    'M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5',
  ],
  gear: [
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L16 3H8l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L8 21h8l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  ],
  calendar: [
    'M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z',
    'M16 2v4',
    'M8 2v4',
    'M4 10h16',
  ],
  car: [
    'M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M7 15h10',
    'M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v3a1 1 0 0 1-1 1h-1',
    'M6 16H5a1 1 0 0 1-1-1v-2',
  ],
  check: ['M20 6 9 17l-5-5'],
  'check-circle': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'm8.5 12 2.5 2.5 4.5-5'],
  tag: [
    'M20.6 13.3 13.3 20.6a1.9 1.9 0 0 1-2.7 0l-7.2-7.2A1.9 1.9 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12c.5 0 1 .2 1.4.6l7.2 7.2a1.9 1.9 0 0 1 0 2.7Z',
    'M7.5 8.5h.01',
  ],
  pound: ['M17 19H6', 'M9 19v-6.5', 'M6 12.5h7', 'M9 12.5V8a4 4 0 0 1 6.9-2.7'],
  wallet: [
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  ],
  star: ['m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'm9 12 2 2 4-4'],
  spanner: [
    'M15.5 3.5a5 5 0 0 0-6 6.6L3.8 15.8a2 2 0 0 0 0 2.8l1.6 1.6a2 2 0 0 0 2.8 0l5.7-5.7a5 5 0 0 0 6.6-6l-3 3-2.8-2.8 3-3a5 5 0 0 0-2.2-.2Z',
  ],
  handshake: [
    'm11 17 2 2a1 1 0 1 0 3-3',
    'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4',
    'm21 3 1 11h-2',
    'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3',
    'M3 4h8',
  ],
  camera: [
    'M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z',
    'M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  ],
  users: [
    'M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20',
    'M9 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M22 20v-1.5a4 4 0 0 0-3-3.9',
    'M16 3.6a4 4 0 0 1 0 7',
  ],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6 18 18', 'M18 6 6 18'],
  play: ['m6 4 14 8-14 8V4Z'],
  quote: ['M7 7h4v6H5v-2a4 4 0 0 1 4-4Z', 'M17 7h4v6h-6v-2a4 4 0 0 1 4-4Z'],
  sliders: [
    'M4 6h10',
    'M18 6h2',
    'M4 12h4',
    'M12 12h8',
    'M4 18h12',
    'M20 18h.01',
    'M16 4v4',
    'M10 10v4',
    'M18 16v4',
  ],
  seat: ['M6 20v-3', 'M18 20v-6l-2-8H9', 'M6 14h9', 'M6 6v8'],
  door: ['M4 20h16', 'M6 20V6l9-2v16', 'M12.5 12.5h.01'],
  key: ['M15 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M11.5 11.5 3 20', 'm7 15 2 2', 'm5 17 2 2'],
}

const paths = computed(() => icons[props.name] ?? [])
</script>
