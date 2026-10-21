<template>
  <div class="min-h-screen bg-paper text-ink">
    <a
      href="#main"
      class="sr-only z-[70] rounded-control bg-surface px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      @click.prevent="focusMain"
    >
      Skip to content
    </a>
    <TheNav />
    <main id="main" ref="main" tabindex="-1" class="outline-none">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheFooter from './components/layout/TheFooter.vue'
import TheNav from './components/layout/TheNav.vue'

const route = useRoute()
const main = ref<HTMLElement | null>(null)

function focusMain() {
  main.value?.focus()
}

// A new page should start at its heading for keyboard and screen reader users.
// Filter changes keep the same path and so keep focus where it is.
watch(
  () => route.path,
  async (_to, from) => {
    if (!from) return
    await nextTick()
    main.value?.focus({ preventScroll: true })
  },
)
</script>
