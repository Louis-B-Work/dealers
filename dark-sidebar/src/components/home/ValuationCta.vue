<template>
  <section class="border-b border-line bg-paper py-20 md:py-28">
    <div class="u-gutter grid w-full items-start gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
      <div class="flex flex-col gap-7">
        <SectionHeading
          eyebrow="Sell or part-exchange"
          title="Your car could be worth more than you think"
          subtitle="Get a competitive, no-obligation valuation in under a minute. Sell outright or put it towards your next car, and we handle all the paperwork."
        />

        <form
          class="flex flex-col gap-3 sm:flex-row"
          data-reveal
          data-reveal-delay="160"
          @submit.prevent="onValuation"
        >
          <input
            v-model="reg"
            type="text"
            class="reg-plate"
            placeholder="YOUR REG"
            maxlength="8"
            aria-label="Vehicle registration"
          />
          <button type="submit" class="btn-primary whitespace-nowrap">
            Value my car
            <AppIcon name="arrow" :size="16" />
          </button>
        </form>

        <p v-if="valued" class="max-w-prose text-sm text-ink-soft" data-reveal>
          Cars like yours are currently valued from
          <span class="font-display text-lg text-accent">£18,400</span>. Our team will confirm your
          exact figure after a short inspection.
        </p>
      </div>

      <!-- Numbered steps on hairlines rather than in a card: the same
           structural device as the USP strip, at a smaller scale. -->
      <ol class="flex flex-col divide-y divide-line border-y border-line">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="flex items-start gap-5 py-6"
          data-reveal
          :data-reveal-delay="i * 90"
        >
          <span class="u-index shrink-0 pt-1">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="flex flex-col gap-1">
            <h3 class="font-display text-lg text-ink">{{ step.title }}</h3>
            <p class="text-sm text-ink-soft">{{ step.body }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

const reg = ref('')
const valued = ref(false)

function onValuation() {
  valued.value = reg.value.trim().length > 0
}

const steps = [
  { title: 'Enter your registration', body: 'We pull your make, model and spec instantly.' },
  { title: 'Get an instant estimate', body: 'A fair, market-led figure with no obligation.' },
  { title: 'Book & complete', body: 'Sell or part-exchange, we handle everything.' },
]
</script>

<style scoped>
/* The plate keeps its statutory yellow — it is the one element in the
   template that shouldn't be restyled to the palette. */
.reg-plate {
  @apply w-full rounded-control border-2 border-[#f6c744] bg-[#f6c744] px-4 py-3 text-center font-sans text-xl font-bold uppercase tracking-widest text-[#101215] outline-none transition placeholder:text-[#101215]/45 focus:border-accent;
}
</style>
