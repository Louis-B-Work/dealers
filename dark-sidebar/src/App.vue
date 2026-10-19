<template>
  <div class="min-h-screen bg-paper text-ink">
    <SideNav v-if="!bare" />

    <!-- The sidebar is fixed, so the page reserves its width here rather than
         participating in a flex row — that keeps every section free to run
         full-bleed across the remaining viewport. -->
    <div :class="bare ? '' : 'lg:pl-[var(--nav-w-collapsed)]'">
      <main :class="bare ? '' : 'pt-[var(--nav-h)] lg:pt-0'">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </main>
      <TheFooter v-if="!bare" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from './components/layout/SideNav.vue'
import TheFooter from './components/layout/TheFooter.vue'

// Isolation routes (e.g. /card-lab) render without the site chrome.
const route = useRoute()
const bare = computed(() => route.meta.bare === true)
</script>
