<template>
  <div class="min-h-screen bg-paper text-ink">
    <TheNav v-if="!bare" />

    <!-- The bar is fixed and one height at all times, so the page reserves
         exactly that much here and sticky elements clear the same figure. -->
    <main :class="bare ? '' : 'pt-[var(--nav-h)]'">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <TheFooter v-if="!bare" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TheNav from './components/layout/TheNav.vue'
import TheFooter from './components/layout/TheFooter.vue'

// Isolation routes (e.g. /card-lab) render without the site chrome.
const route = useRoute()
const bare = computed(() => route.meta.bare === true)
</script>
