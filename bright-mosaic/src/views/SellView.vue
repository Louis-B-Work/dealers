<template>
  <div class="bg-paper pt-[84px]">
    <!-- valuation: heading, then the form as three locked tiles -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-8 py-12 md:py-16">
        <div class="max-w-4xl">
          <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>
            Looking to part-exchange or sell your car?
          </h1>
          <p class="mt-4 max-w-prose text-ink-soft sm:text-lg" data-intro>
            Get a free, instant valuation so you know exactly how much you can put towards your next car.
          </p>
        </div>

        <form class="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]" novalidate data-intro @submit.prevent="onSubmit">
          <label class="flex flex-col gap-1 rounded-panel border-2 border-transparent bg-surface px-5 py-4 shadow-soft focus-within:border-accent" :class="{ '!border-ink': errors.reg }">
            <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Vehicle registration</span>
            <input
              v-model="reg"
              type="text"
              class="bg-transparent font-display text-2xl font-extrabold uppercase tracking-wide text-ink outline-none placeholder:text-ink-muted/50"
              placeholder="ENTER REG"
              maxlength="8"
              autocomplete="off"
            />
          </label>

          <label class="flex flex-col gap-1 rounded-panel border-2 border-transparent bg-surface px-5 py-4 shadow-soft focus-within:border-accent" :class="{ '!border-ink': errors.mileage }">
            <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Mileage</span>
            <input
              v-model="mileage"
              type="text"
              inputmode="numeric"
              class="bg-transparent font-display text-2xl font-extrabold text-ink outline-none placeholder:text-ink-muted/50"
              placeholder="e.g. 30,000"
            />
          </label>

          <button type="submit" class="flex items-center justify-center gap-2 rounded-panel bg-accent px-8 py-5 text-base font-extrabold text-accent-ink shadow-soft transition duration-300 ease-premium hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-lift">
            Get my valuation
            <AppIcon name="arrow" :size="18" />
          </button>

          <p class="text-xs text-ink-muted md:col-span-3">An estimate is fine if you don't know the exact mileage.</p>
          <p v-if="errors.reg || errors.mileage" class="text-sm font-bold text-ink md:col-span-3" role="alert">
            {{ errors.reg || errors.mileage }}
          </p>
          <div
            v-if="valued"
            class="flex flex-wrap items-center gap-4 rounded-panel bg-ink p-5 text-paper md:col-span-3"
            role="status"
          >
            <span>Cars like yours are currently valued from</span>
            <span class="price-pill !px-4 !py-1.5 !text-2xl">£18,400</span>
            <span class="text-paper/70">Our team will confirm your exact figure.</span>
          </div>
        </form>
      </div>
    </div>

    <!-- featured cars -->
    <section class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title="Featured cars" subtitle="Freshly prepared, fully checked and ready to drive away." />
          <RouterLink to="/vehicles" class="btn-ghost" data-reveal>
            View all stock
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </div>
        <div class="grid gap-3 sm:gap-4 md:grid-cols-3">
          <div
            v-for="(vehicle, i) in featured"
            :key="vehicle.id"
            class="aspect-[4/3]"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <MosaicCard :vehicle="vehicle" />
          </div>
        </div>
      </div>
    </section>

    <!-- finance disclosure -->
    <section class="pb-8">
      <div class="container">
        <p class="mx-auto max-w-prose text-center text-xs leading-relaxed text-ink-muted">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { brokerDisclosure, representativeExample } from '../data/dealer'
import { vehicles } from '../data/vehicles'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'
import MosaicCard from '../components/shared/MosaicCard.vue'

useScrollReveal()

// Cheapest first, matching the homepage's "best buys" ordering.
const featured = [...vehicles].sort((a, b) => a.price - b.price).slice(0, 3)

const reg = ref('')
const mileage = ref('')
const valued = ref(false)
const errors = reactive({ reg: '', mileage: '' })

// The valuation is mocked, as on the homepage band: no registration lookup yet.
function onSubmit() {
  errors.reg = reg.value.trim().length >= 2 ? '' : 'Please enter your registration.'
  errors.mileage = /^\d[\d,]*$/.test(mileage.value.trim()) ? '' : 'Please enter your mileage.'
  valued.value = !errors.reg && !errors.mileage
}
</script>
