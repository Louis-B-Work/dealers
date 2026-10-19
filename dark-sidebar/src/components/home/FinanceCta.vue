<template>
  <section class="relative overflow-hidden border-b border-line bg-paper-soft py-20 md:py-28">
    <!-- Champagne wash, kept very low: on a near-black surface anything
         stronger turns the panel murky. -->
    <div
      class="pointer-events-none absolute -right-40 top-1/2 h-[620px] w-[620px] -translate-y-1/2 opacity-60"
      style="background: radial-gradient(circle, rgb(var(--c-accent) / 0.14), transparent 62%)"
    ></div>

    <div class="u-gutter relative grid w-full items-start gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div class="flex flex-col gap-7">
        <SectionHeading
          eyebrow="Finance made simple"
          :title="headline"
          subtitle="Representative finance tailored to you, with a decision in principle in minutes. Adjust your deposit and term to see a monthly figure that fits."
        />

        <ul class="flex flex-col divide-y divide-line border-y border-line">
          <li v-for="point in points" :key="point" class="flex items-center gap-3 py-3.5 text-sm text-ink-soft">
            <AppIcon name="check" :size="15" class="shrink-0 text-accent" />
            {{ point }}
          </li>
        </ul>

        <div class="flex flex-wrap gap-3" data-reveal data-reveal-delay="200">
          <RouterLink to="/vehicles" class="btn-primary">Browse &amp; apply</RouterLink>
          <RouterLink to="/contact" class="btn-ghost">Speak to our team</RouterLink>
        </div>
      </div>

      <!-- Illustrative calculator -->
      <div class="panel p-6 md:p-8" data-reveal data-reveal-delay="120">
        <div class="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <!-- Not uppercased: the required title is "Finance calculator", and
                 a CSS transform would render it as "FINANCE CALCULATOR". -->
            <p class="font-display text-xl text-ink">Finance calculator</p>
            <p class="mt-1 text-xs text-ink-muted">
              For illustration purposes only. Credit is subject to status.
            </p>
          </div>
          <span class="u-index shrink-0 pt-1">HP</span>
        </div>

        <div class="mt-7 flex flex-col gap-7">
          <label class="flex flex-col gap-2.5">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Vehicle price</span>
              <span class="font-display text-lg text-ink">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="4000" max="150000" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-2.5">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Deposit</span>
              <span class="font-display text-lg text-ink">{{ formatCurrency(deposit) }}</span>
            </span>
            <input
              v-model.number="deposit"
              type="range"
              min="0"
              :max="Math.round(price * 0.5)"
              step="250"
              class="range"
            />
          </label>

          <div class="flex flex-col gap-2.5">
            <span class="calc-label">Term</span>
            <!-- Segmented rather than a third slider: the terms we offer are a
                 fixed set, so presenting them as a continuum would mislead. -->
            <div class="grid grid-cols-4 divide-x divide-line border border-line">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                class="term-btn"
                :class="{ 'is-selected': term === t }"
                @click="term = t"
              >
                {{ t }}<span class="ml-0.5 text-[0.6rem] text-ink-muted">mo</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-end justify-between gap-4 border-t border-line pt-6">
          <div class="flex flex-col gap-1">
            <span class="calc-label">Estimated monthly</span>
            <span class="whitespace-nowrap font-display text-[2.4rem] leading-none text-accent">
              {{ formatCurrency(monthly) }}
            </span>
          </div>
          <p class="text-right text-xs text-ink-muted">
            Representative<br /><span class="font-semibold text-ink-soft">{{ apr }}% APR</span>
          </p>
        </div>

        <!-- Regulated disclosure. Required wherever an indicative monthly
             figure is shown, alongside the figure rather than page-footed. -->
        <p class="mt-5 border-t border-line pt-5 text-[0.68rem] leading-relaxed text-ink-muted">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { vehicles } from '../../data/vehicles'
import { REPRESENTATIVE_APR, brokerDisclosure, representativeExample, monthlyPaymentFor } from '../../data/dealer'
import { formatCurrency } from '../../composables/useVehicleFilters'
import SectionHeading from '../shared/SectionHeading.vue'
import AppIcon from '../shared/AppIcon.vue'

// Shared constant: the calculator must not quote a different rate to the
// representative example on the VDP.
const apr = REPRESENTATIVE_APR
const terms = [24, 36, 48, 60]

const price = ref(60000)
const deposit = ref(6000)
const term = ref(48)

const lowestMonthly = computed(() => Math.min(...vehicles.map((v) => v.monthlyFrom)))

const headline = computed(
  () => `Drive away from ${formatCurrency(lowestMonthly.value)} a month.`,
)

// The deposit cap follows the price, so a large deposit must come back down
// with it rather than silently exceeding half the (new) price.
watch(price, (value) => {
  const cap = Math.round(value * 0.5)
  if (deposit.value > cap) deposit.value = cap
})

const monthly = computed(() =>
  monthlyPaymentFor(Math.max(price.value - deposit.value, 0), term.value, apr),
)

const points = [
  'Soft search that leaves no mark on your credit file',
  'Decision in principle in minutes, not days',
  'Part-exchange settled and deducted for you',
]
</script>

<style scoped>
.calc-label {
  @apply text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted;
}

.term-btn {
  @apply py-3 text-sm font-medium text-ink-soft transition-colors duration-300 ease-premium hover:bg-paper-sink hover:text-ink;
}

.term-btn.is-selected {
  @apply bg-accent text-accent-ink;
}

.range {
  @apply h-px w-full cursor-pointer appearance-none bg-line outline-none;
}

.range::-webkit-slider-thumb {
  @apply h-3.5 w-3.5 appearance-none rounded-full bg-accent transition;
  box-shadow: 0 0 0 4px rgb(var(--c-accent) / 0.18);
}

.range::-moz-range-thumb {
  @apply h-3.5 w-3.5 rounded-full border-0 bg-accent;
}
</style>
