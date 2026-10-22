<template>
  <section class="u-gutter w-full py-20 md:py-28">
    <div class="grid w-full items-start gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div class="flex flex-col">
        <SectionHeading
          eyebrow="Finance your vehicle"
          :title="headline"
          subtitle="Representative finance tailored to you, with a decision in principle in minutes. Adjust your deposit and term to see a monthly figure that fits."
        />

        <ul class="mt-10 flex flex-col border-t border-line">
          <li
            v-for="point in points"
            :key="point"
            class="flex items-center gap-3.5 border-b border-line py-4 text-sm text-ink-soft"
          >
            <AppIcon name="check" :size="14" class="shrink-0 text-ink" />
            {{ point }}
          </li>
        </ul>

        <div class="mt-10 flex flex-wrap gap-4" data-reveal data-reveal-delay="200">
          <RouterLink to="/vehicles" class="btn-primary">Browse &amp; apply</RouterLink>
          <RouterLink to="/contact" class="btn-ghost">Speak to our team</RouterLink>
        </div>
      </div>

      <!-- Illustrative calculator. Square, hairlined and flat — the same panel
           primitive as the card, at a larger scale. -->
      <div class="border border-line p-6 md:p-8" data-reveal data-reveal-delay="120">
        <div class="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <!-- Not uppercased: the required title is "Finance calculator", and
                 a CSS transform would render it as "FINANCE CALCULATOR". -->
            <p class="font-display text-lg text-ink">Finance calculator</p>
            <p class="mt-1.5 text-xs text-ink-muted">
              For illustration purposes only. Credit is subject to status.
            </p>
          </div>
          <span class="shrink-0 pt-1 text-[0.6rem] uppercase tracking-micro text-ink-muted">HP</span>
        </div>

        <div class="mt-8 flex flex-col gap-8">
          <label class="flex flex-col gap-3">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Vehicle price</span>
              <span class="font-display text-lg tabular-nums text-ink">{{
                formatCurrency(price)
              }}</span>
            </span>
            <input
              v-model.number="price"
              type="range"
              min="4000"
              max="150000"
              step="500"
              class="range"
            />
          </label>

          <label class="flex flex-col gap-3">
            <span class="flex items-baseline justify-between">
              <span class="calc-label">Deposit</span>
              <span class="font-display text-lg tabular-nums text-ink">{{
                formatCurrency(deposit)
              }}</span>
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

          <div class="flex flex-col gap-3">
            <span class="calc-label">Term</span>
            <!-- Segmented rather than a third slider: the terms we offer are a
                 fixed set, so presenting them as a continuum would mislead. -->
            <div class="grid grid-cols-4 gap-px bg-line">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                class="term-btn"
                :class="{ 'is-selected': term === t }"
                @click="term = t"
              >
                {{ t }}<span class="ml-1 text-[0.58rem] text-ink-muted">mo</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-9 flex items-end justify-between gap-4 border-t border-line pt-7">
          <div class="flex flex-col gap-2">
            <span class="calc-label">Estimated monthly</span>
            <span class="whitespace-nowrap font-display text-[2.2rem] leading-none tabular-nums">
              {{ formatCurrency(monthly) }}
            </span>
          </div>
          <p class="text-right text-xs leading-relaxed text-ink-muted">
            Representative<br /><span class="font-medium text-ink">{{ apr }}% APR</span>
          </p>
        </div>

        <!-- Regulated disclosure. Required wherever an indicative monthly
             figure is shown, alongside the figure rather than page-footed. -->
        <p class="mt-6 border-t border-line pt-6 text-[0.66rem] leading-relaxed text-ink-muted">
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

const headline = computed(() => `Drive away from ${formatCurrency(lowestMonthly.value)} a month`)

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
  @apply text-[0.6rem] font-medium uppercase tracking-micro text-ink-muted;
}

.term-btn {
  @apply bg-paper py-3.5 text-sm tabular-nums text-ink-soft transition duration-300 ease-premium hover:bg-ink hover:text-paper;
}

.term-btn.is-selected {
  @apply bg-ink text-paper;
}

/* A hairline track with a small square thumb — no rounded pill, in keeping
   with the rest of the template's geometry. */
.range {
  @apply h-px w-full cursor-pointer appearance-none bg-line outline-none;
}

.range::-webkit-slider-thumb {
  @apply h-3.5 w-3.5 appearance-none bg-ink transition;
}

.range::-moz-range-thumb {
  @apply h-3.5 w-3.5 rounded-none border-0 bg-ink;
}
</style>
