<template>
  <section class="u-gutter w-full py-20 md:py-28">
    <div class="grid w-full items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div class="flex flex-col">
        <SectionHeading
          eyebrow="Sell or part-exchange"
          title="Your car could be worth more than you think"
          subtitle="Get a competitive, no-obligation valuation in under a minute. Sell outright or put it towards your next car, and we handle all the paperwork."
        />

        <form
          class="mt-10 flex flex-col gap-4 sm:flex-row"
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
            <AppIcon name="arrow" :size="15" />
          </button>
        </form>

        <p v-if="valued" class="mt-6 max-w-prose text-sm text-ink-soft">
          Cars like yours are currently valued from
          <span class="font-display text-lg text-ink">£18,400</span>. Our team will confirm your
          exact figure after a short inspection.
        </p>
      </div>

      <!-- Numbered steps on hairlines rather than in cards: the same structural
           device as the USP strip, at a smaller scale. -->
      <ol class="flex flex-col border-t border-line">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="flex items-start gap-5 border-b border-line py-6"
          data-reveal
          :data-reveal-delay="i * 90"
        >
          <span class="shrink-0 pt-1 text-[0.62rem] tabular-nums tracking-micro text-ink-muted">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <div class="flex flex-col gap-2">
            <h3 class="u-display-caps text-[0.78rem]">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
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
   template allowed outside the monochrome palette, because the colour is
   legally part of what a UK plate is. */
.reg-plate {
  @apply w-full rounded-control border border-[#f6c744] bg-[#f6c744] px-4 py-3.5 text-center font-sans text-xl font-bold uppercase tracking-widest text-[#0a0a0a] outline-none transition placeholder:text-[#0a0a0a]/45 focus:border-ink;
}
</style>
