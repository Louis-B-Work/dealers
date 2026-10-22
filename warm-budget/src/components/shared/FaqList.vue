<template>
  <ul class="flex flex-col gap-3">
    <li v-for="faq in faqs" :key="faq.question" class="card overflow-hidden">
      <details class="group">
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-base font-semibold text-ink [&::-webkit-details-marker]:hidden"
        >
          {{ faq.question }}
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent transition-transform duration-200 group-open:rotate-180"
          >
            <AppIcon name="chevron" :size="16" />
          </span>
        </summary>
        <p class="max-w-prose px-6 pb-6 text-sm leading-relaxed text-ink-soft sm:text-base">{{ faq.answer }}</p>
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
