<template>
  <section class="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20" aria-labelledby="faq-title">
    <div>
      <h2 id="faq-title" class="u-h2">Answered plainly</h2>
    </div>
    <div class="divide-y divide-line border-y border-line">
      <details v-for="faq in faqs" :key="faq.question" class="group">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl transition sm:text-2xl hover:text-accent [&::-webkit-details-marker]:hidden">
          {{ faq.question }}
          <span class="relative h-4 w-4 shrink-0" aria-hidden="true">
            <span class="absolute left-0 top-1/2 h-px w-4 bg-accent"></span>
            <span class="absolute left-1/2 top-0 h-4 w-px bg-accent transition group-open:scale-y-0"></span>
          </span>
        </summary>
        <p class="max-w-prose pb-6 leading-relaxed text-ink-soft">{{ faq.answer }}</p>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Faq } from '../../data/content'

defineProps<{ faqs: Faq[] }>()
</script>
