<template>
  <ul class="border-t border-ink">
    <li v-for="faq in faqs" :key="faq.question" class="border-b border-line" data-reveal>
      <details class="group">
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-8 py-6 text-left text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink [&::-webkit-details-marker]:hidden"
        >
          {{ faq.question }}
          <span class="relative h-3 w-3 shrink-0" aria-hidden="true">
            <span class="absolute left-0 top-1/2 h-px w-3 bg-ink"></span>
            <span
              class="absolute left-1/2 top-0 h-3 w-px bg-ink transition-transform duration-300 ease-premium group-open:scale-y-0"
            ></span>
          </span>
        </summary>
        <p class="max-w-prose pb-7 text-sm leading-relaxed text-ink-soft sm:text-base">{{ faq.answer }}</p>
      </details>
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface Faq {
  question: string
  answer: string
}

defineProps<{ faqs: Faq[] }>()
</script>
