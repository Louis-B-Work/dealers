<template>
  <section aria-labelledby="faq-title">
    <h2 id="faq-title" class="u-h2 mb-4">Questions, answered</h2>
    <div class="divide-y divide-line border-y border-line">
      <details v-for="faq in faqs" :key="faq.question" class="group py-1">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold">
          {{ faq.question }}
          <AppIcon name="chevron" :size="18" class="shrink-0 transition group-open:rotate-180" />
        </summary>
        <p class="max-w-prose pb-4 text-sm leading-relaxed text-ink-soft">{{ faq.answer }}</p>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Faq } from '../../data/content'
import AppIcon from './AppIcon.vue'

defineProps<{ faqs: Faq[] }>()
</script>
