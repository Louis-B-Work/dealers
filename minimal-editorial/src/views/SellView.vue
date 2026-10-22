<template>
  <div class="bg-paper">
    <!-- valuation: heading set left, then a single ruled bar to complete -->
    <header class="border-b border-line">
      <div class="u-gutter flex w-full flex-col gap-14 py-20 md:py-28">
        <div class="max-w-5xl">
          <h1
            class="u-display text-[1.7rem] min-[480px]:text-[2rem] sm:text-[2.4rem] lg:whitespace-nowrap lg:text-[2.6rem] xl:text-[3.2rem]"
            data-intro
          >
            Looking to part-exchange or sell your car?
          </h1>
          <p class="mt-6 max-w-prose text-ink-soft sm:text-lg" data-intro>
            Get a free, instant valuation so you know exactly how much you can put towards your next car.
          </p>
        </div>

        <form class="flex max-w-4xl flex-col gap-10" novalidate data-intro @submit.prevent="onSubmit">
          <div class="grid gap-10 md:grid-cols-2">
            <label class="flex flex-col gap-3">
              <span class="field-label !mb-0">Vehicle registration</span>
              <input
                v-model="reg"
                type="text"
                class="reg-input"
                placeholder="ENTER REG"
                maxlength="8"
                autocomplete="off"
                :aria-invalid="!!errors.reg"
              />
              <span v-if="errors.reg" class="text-xs text-ink" role="alert">{{ errors.reg }}</span>
            </label>

            <label class="flex flex-col gap-3">
              <span class="field-label !mb-0">Mileage</span>
              <input
                v-model="mileage"
                type="text"
                inputmode="numeric"
                class="reg-input !tracking-[0.08em]"
                placeholder="e.g. 30,000"
                :aria-invalid="!!errors.mileage"
              />
              <span class="text-xs text-ink-muted">An estimate is fine if you don't know the exact figure.</span>
              <span v-if="errors.mileage" class="text-xs text-ink" role="alert">{{ errors.mileage }}</span>
            </label>

            <button type="submit" class="btn-primary justify-self-start">
              Get my valuation
              <AppIcon name="arrow" :size="14" />
            </button>
          </div>

          <p v-if="valued" class="text-sm text-ink-soft" role="status">
            Cars like yours are currently valued from
            <span class="font-display text-lg font-light text-ink">£18,400</span>. Our team will confirm your exact
            figure.
          </p>
        </form>
      </div>
    </header>

    <!-- stock -->
    <section class="py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading title="Featured cars" />
          <RouterLink to="/vehicles" class="link-rule" data-reveal>View all stock</RouterLink>
        </div>
        <div class="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <VehicleCard v-for="vehicle in featured" :key="vehicle.id" :vehicle="vehicle" />
        </div>
      </div>
    </section>

    <!-- finance disclosure -->
    <section class="pb-16">
      <div class="u-gutter w-full">
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
import VehicleCard from '../components/shared/VehicleCard.vue'

useScrollReveal()

const featured = vehicles.slice(0, 3)

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

<style scoped>
/* A drawn line to write on, not a box: wide-set capitals above a hairline. */
.reg-input {
  @apply w-full border-0 border-b border-line bg-transparent px-0 py-2 font-display text-2xl font-light uppercase tracking-[0.3em] text-ink outline-none transition-colors duration-300 ease-premium placeholder:text-ink-muted/60 focus:border-ink;
}
</style>
