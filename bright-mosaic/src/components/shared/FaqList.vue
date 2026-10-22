<template>
  <ul class="grid gap-3 md:grid-cols-2 md:items-start">
    <li v-for="faq in faqs" :key="faq.question" class="overflow-hidden rounded-panel border border-line bg-surface shadow-soft" data-reveal>
      <details class="group">
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[0.95rem] font-extrabold text-ink [&::-webkit-details-marker]:hidden"
        >
          {{ faq.question }}
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-sink text-accent transition duration-300 group-open:rotate-180 group-open:bg-accent group-open:text-accent-ink"
          >
            <AppIcon name="chevron" :size="16" />
          </span>
        </summary>
        <p class="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{{ faq.answer }}</p>
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
