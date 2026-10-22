<template>
  <div class="bg-paper">
    <!-- valuation: the whole thing is one friendly pill bar on the dark slab -->
    <PageHeader
      wide
      title="Looking to part-exchange or sell your car?"
      subtitle="Get a free, instant valuation so you know exactly how much you can put towards your next car."
    >
      <form class="mt-8 w-full" novalidate @submit.prevent="onSubmit">
        <div
          class="flex flex-col gap-2 rounded-panel bg-paper-soft p-2 shadow-card sm:rounded-full sm:flex-row sm:items-stretch"
        >
          <label class="flex flex-1 flex-col justify-center rounded-full px-5 py-2 sm:min-w-0">
            <span class="text-xs font-semibold text-ink-muted">Registration</span>
            <input
              v-model="reg"
              type="text"
              class="bg-transparent font-display text-lg font-semibold uppercase tracking-wide text-ink outline-none placeholder:text-ink-muted/60"
              placeholder="Enter reg"
              maxlength="8"
              autocomplete="off"
              :aria-invalid="!!errors.reg"
            />
          </label>

          <label class="flex flex-1 flex-col justify-center rounded-full px-5 py-2 sm:min-w-0 sm:border-l sm:border-line">
            <span class="text-xs font-semibold text-ink-muted">Mileage</span>
            <input
              v-model="mileage"
              type="text"
              inputmode="numeric"
              class="bg-transparent font-display text-lg font-semibold text-ink outline-none placeholder:text-ink-muted/60"
              placeholder="e.g. 30,000"
              :aria-invalid="!!errors.mileage"
            />
          </label>

          <button type="submit" class="btn-primary !px-8 sm:!py-4">
            Get my valuation
            <AppIcon name="arrow" :size="16" />
          </button>
        </div>

        <p class="mt-3 px-5 text-xs text-ink-inverse/70">
          An estimate is fine if you don't know the exact mileage.
        </p>
        <p v-if="errors.reg || errors.mileage" class="mt-2 px-5 text-sm font-semibold text-highlight-wash" role="alert">
          {{ errors.reg || errors.mileage }}
        </p>
        <p
          v-if="valued"
          class="mt-4 rounded-tile bg-white/10 px-5 py-4 text-sm text-ink-inverse"
          role="status"
        >
          Cars like yours are currently valued from
          <span class="font-display text-lg font-semibold text-accent-soft">£18,400</span>. Our team will confirm your exact figure.
        </p>
      </form>

      <ul class="mt-6 flex flex-wrap gap-2">
        <li
          v-for="point in points"
          :key="point"
          class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-ink-inverse"
        >
          <AppIcon name="check" :size="14" class="text-accent-soft" />
          {{ point }}
        </li>
      </ul>
    </PageHeader>

    <!-- stock -->
    <section class="u-section">
      <div class="u-gutter-wide flex flex-col gap-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Featured cars" subtitle="Freshly prepared, fully checked and ready to drive away." />
          <RouterLink to="/vehicles" class="btn-ghost shrink-0">
            View all stock
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </div>
        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="vehicle in featured" :key="vehicle.id">
            <VehicleCard :vehicle="vehicle" />
          </li>
        </ul>
      </div>
    </section>

    <!-- finance disclosure -->
    <section class="pb-8">
      <div class="u-gutter-wide">
        <p class="u-legal mx-auto max-w-prose text-center">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { brokerDisclosure, representativeExample } from '../data/dealer'
import { vehicles } from '../data/vehicles'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'
import VehicleCard from '../components/shared/VehicleCard.vue'

const featured = vehicles.slice(0, 4)
const points = ['Free valuation', 'No obligation', 'We can settle your finance']

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
