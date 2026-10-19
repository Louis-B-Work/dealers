<template>
  <section class="bg-paper py-20 md:py-28">
    <div class="container">
      <div
        class="relative overflow-hidden rounded-panel border border-line bg-paper-soft px-6 py-12 md:px-16 md:py-16"
      >
        <div
          class="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-40"
          style="background: radial-gradient(circle, rgb(var(--c-accent-soft) / 0.35), transparent 60%)"
        ></div>

        <div class="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div class="flex flex-col gap-5">
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
              <div class="relative flex-1">
                <input
                  v-model="reg"
                  type="text"
                  class="reg-plate"
                  placeholder="YOUR REG"
                  maxlength="8"
                  aria-label="Vehicle registration"
                />
              </div>
              <button type="submit" class="btn-accent whitespace-nowrap">
                Value my car
                <AppIcon name="arrow" :size="16" />
              </button>
            </form>
            <p v-if="valued" class="text-sm font-medium text-ink" data-reveal>
              Great news: cars like yours are currently valued from
              <span class="font-semibold text-accent">£18,400</span>. Our team will confirm your
              exact figure.
            </p>
          </div>

          <ul class="flex flex-col gap-4">
            <li
              v-for="(step, i) in steps"
              :key="step.title"
              class="flex items-start gap-4"
              data-reveal
              :data-reveal-delay="i * 90"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
                >{{ i + 1 }}</span
              >
              <div>
                <h3 class="font-display text-base text-ink">{{ step.title }}</h3>
                <p class="text-sm text-ink-soft">{{ step.body }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
.reg-plate {
  @apply w-full rounded-control border-2 border-ink bg-[#f6c744] px-4 py-3 text-center font-display text-xl font-semibold uppercase tracking-widest text-ink placeholder:text-ink/50 focus:border-accent;
}
</style>
