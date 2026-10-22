<template>
  <ul class="divide-y divide-line rounded-panel border border-line bg-white shadow-soft">
    <li v-for="faq in faqs" :key="faq.question" data-reveal>
      <details class="group">
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-lg text-ink transition hover:text-accent [&::-webkit-details-marker]:hidden"
        >
          {{ faq.question }}
          <AppIcon
            name="chevron"
            :size="18"
            class="shrink-0 text-accent transition-transform group-open:rotate-180"
          />
        </summary>
        <p class="max-w-prose px-6 pb-6 leading-relaxed text-ink-soft">{{ faq.answer }}</p>
      </details>
    </li>
  </ul>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'

export interface Faq {
  question: string
  answer: string
}

defineProps<{ faqs: Faq[] }>()
</script>
