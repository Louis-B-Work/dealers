<template>
  <section class="relative overflow-hidden bg-ink py-20 text-white md:py-28">
    <!-- decorative accent glow -->
    <div
      class="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full opacity-30"
      style="background: radial-gradient(circle, rgb(var(--c-accent-soft) / 0.55), transparent 65%)"
    ></div>

    <div class="container relative grid items-center gap-12 lg:grid-cols-2">
      <div class="flex flex-col gap-6">
        <h2 class="u-display text-3xl text-white sm:text-4xl md:text-5xl" data-reveal data-reveal-delay="80">
          Drive away from
          <span class="italic text-accent-soft">{{ formatCurrency(lowestMonthly) }}</span> a month.
        </h2>
        <p class="max-w-lg text-white/75" data-reveal data-reveal-delay="140">
          Representative finance tailored to you, with a decision in principle in minutes. Adjust
          your deposit and term to see a monthly figure that fits.
        </p>
        <div class="flex flex-wrap gap-4 pt-2" data-reveal data-reveal-delay="200">
          <RouterLink to="/vehicles" class="btn-accent">Browse &amp; apply</RouterLink>
          <RouterLink
            to="/contact"
            class="btn inline-flex border border-white/25 text-white hover:-translate-y-0.5 hover:border-white"
          >
            Speak to our team
          </RouterLink>
        </div>
      </div>

      <!-- mini calculator -->
      <div
        class="rounded-panel border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8"
        data-reveal
        data-reveal-delay="120"
      >
        <!-- Not uppercased: the required title is "Finance calculator", and a
             CSS transform would render it as "FINANCE CALCULATOR". -->
        <p class="text-sm font-semibold tracking-wide text-accent-soft">Finance calculator</p>
        <p class="mt-1 text-xs text-white/60">
          For illustration purposes only. Credit is subject to status.
        </p>

        <div class="mt-6 flex flex-col gap-6">
          <label class="flex flex-col gap-2">
            <span class="flex items-center justify-between text-sm text-white/80">
              <span>Vehicle price</span>
              <span class="font-semibold text-white">{{ formatCurrency(price) }}</span>
            </span>
            <input v-model.number="price" type="range" min="20000" max="150000" step="1000" class="range" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="flex items-center justify-between text-sm text-white/80">
              <span>Deposit</span>
              <span class="font-semibold text-white">{{ formatCurrency(deposit) }}</span>
            </span>
            <input v-model.number="deposit" type="range" min="0" :max="price * 0.5" step="500" class="range" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="flex items-center justify-between text-sm text-white/80">
              <span>Term</span>
              <span class="font-semibold text-white">{{ term }} months</span>
            </span>
            <input v-model.number="term" type="range" min="24" max="60" step="12" class="range" />
          </label>
        </div>

        <div class="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-white/50">Est. monthly</p>
            <p class="font-display text-3xl text-white">{{ formatCurrency(monthly) }}</p>
          </div>
          <p class="max-w-[45%] text-right text-[0.68rem] leading-snug text-white/40">
            Representative {{ apr }}% APR
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { vehicles } from '../../data/vehicles'
import { REPRESENTATIVE_APR, monthlyPaymentFor } from '../../data/dealer'
import { formatCurrency } from '../../composables/useVehicleFilters'

// Shared constant: the calculator must not quote a different rate to the
// representative example on the VDP.
const apr = REPRESENTATIVE_APR
const price = ref(60000)
const deposit = ref(6000)
const term = ref(48)

const lowestMonthly = computed(() => Math.min(...vehicles.map((v) => v.monthlyFrom)))

const monthly = computed(() =>
  monthlyPaymentFor(Math.max(price.value - deposit.value, 0), term.value, apr),
)
</script>

<style scoped>
.range {
  @apply h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 outline-none;
}
.range::-webkit-slider-thumb {
  @apply h-4 w-4 appearance-none rounded-full border-2 border-white bg-accent transition;
  box-shadow: 0 0 0 4px rgb(var(--c-accent-soft) / 0.25);
}
.range::-moz-range-thumb {
  @apply h-4 w-4 rounded-full border-2 border-white bg-accent;
}
</style>
