<template>
  <div ref="root" class="relative">
    <button
      :id="buttonId"
      type="button"
      class="nav-link inline-flex items-center gap-1"
      :class="{ 'is-open': open }"
      :aria-expanded="open"
      :aria-controls="menuId"
      aria-haspopup="true"
      @click="open = !open"
      @keydown.down.prevent="openAndFocusFirst"
    >
      {{ label }}
      <AppIcon name="chevron" :size="15" :class="open ? 'rotate-180' : ''" class="text-ink-muted" />
    </button>

    <!-- Rendered in its final state rather than faded in: the template has no
         entrance animation anywhere. -->
    <div
      v-if="open"
      :id="menuId"
      ref="menu"
      class="absolute left-0 top-full z-50 mt-1 min-w-[13rem] rounded-panel border border-line bg-paper-soft p-1.5 shadow-card-hover"
      :aria-labelledby="buttonId"
    >
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="menu-link"
        @click="open = false"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../shared/AppIcon.vue'

defineProps<{ label: string; items: { label: string; to: string }[] }>()

const route = useRoute()
const buttonId = useId()
const menuId = useId()

const root = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const open = ref(false)

async function openAndFocusFirst() {
  open.value = true
  await nextTick()
  menu.value?.querySelector<HTMLAnchorElement>('a')?.focus()
}

function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return
  open.value = false
  root.value?.querySelector('button')?.focus()
}

// Tabbing out of the panel should close it, the same as clicking away.
function onFocusIn(event: FocusEvent) {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('focusin', onFocusIn)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('focusin', onFocusIn)
})

watch(() => route.fullPath, () => (open.value = false))
</script>

<style scoped>
/* Matches the plain links in TheNav, duplicated rather than shared because
   scoped styles do not cross the component boundary. */
.nav-link {
  @apply whitespace-nowrap rounded-control px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 ease-out hover:bg-paper-sink hover:text-ink;
}

.nav-link.is-open {
  @apply bg-paper-sink text-ink;
}

.menu-link {
  @apply block whitespace-nowrap rounded-tile px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 ease-out hover:bg-paper-sink hover:text-ink;
}

.menu-link.router-link-active {
  @apply text-accent;
}
</style>
