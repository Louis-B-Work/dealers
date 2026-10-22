<template>
  <!-- The full regulated example, on its own strip, wherever "from £x a month" figures can appear. -->
  <section class="border-y border-line bg-paper-soft py-8 md:py-10" aria-label="Representative finance example">
    <div class="u-gutter">
      <div class="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
        <p class="text-xs font-bold uppercase tracking-micro text-ink-muted lg:pt-0.5">Representative example</p>
        <div class="flex max-w-5xl flex-col gap-2 text-sm leading-relaxed text-ink-soft">
          <p>{{ representativeExample }}</p>
          <p>
            Monthly figures shown on this site are “from” payments over {{ QUOTE_TERM_MONTHS }} months with no
            deposit at a representative {{ REPRESENTATIVE_APR }}% APR. {{ brokerDisclosure }} Finance is subject to
            status.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  QUOTE_TERM_MONTHS,
  REPRESENTATIVE_APR,
  brokerDisclosure,
  representativeExample,
} from '../../data/dealer'
</script>
