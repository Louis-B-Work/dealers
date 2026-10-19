<template>
  <section class="u-gutter w-full u-section">
    <div class="grid items-center gap-8 rounded-panel bg-paper-dark p-7 text-ink-inverse sm:p-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <h2 class="u-display text-[1.75rem] text-ink-inverse sm:text-[2.1rem]">
          Got a car to sell? We will buy it.
        </h2>
        <p class="mt-4 max-w-prose text-sm leading-relaxed text-ink-inverse/70 sm:text-base">
          Free valuation, no obligation, and we will buy your car whether you are buying one from us
          or not. Still on finance? We will settle it direct with your lender.
        </p>

        <ul class="mt-6 flex flex-wrap gap-2">
          <li v-for="point in points" :key="point" class="rounded-control border border-white/20 px-3 py-1.5 text-xs font-medium text-ink-inverse/80">
            {{ point }}
          </li>
        </ul>
      </div>

      <form class="rounded-panel bg-paper-soft p-5 text-ink sm:p-6" @submit.prevent="submit">
        <label :for="regId" class="field-label">Enter your registration</label>

        <!-- The plate keeps its statutory yellow and its blue GB flash. The
             colour is legally part of what a UK number plate is, so it is the
             one element in the template outside the palette. -->
        <div class="plate">
          <span class="plate-flash">
            <span class="plate-stars" aria-hidden="true">★</span>
            UK
          </span>
          <input
            :id="regId"
            v-model="reg"
            type="text"
            class="plate-input"
            placeholder="AB12 CDE"
            maxlength="8"
            autocomplete="off"
            spellcheck="false"
            @input="onRegInput"
          />
        </div>
        <p v-if="error" class="mt-2 text-xs font-semibold text-danger">{{ error }}</p>

        <label :for="mileageId" class="field-label mt-4">Current mileage</label>
        <input
          :id="mileageId"
          v-model="mileage"
          type="text"
          inputmode="numeric"
          class="field"
          placeholder="48,000"
          autocomplete="off"
        />

        <button type="submit" class="btn-primary mt-5 w-full">
          Get my free valuation
          <AppIcon name="arrow" :size="16" />
        </button>

        <p v-if="submitted" class="mt-4 rounded-tile bg-accent-wash px-4 py-3 text-sm font-medium text-accent">
          Thanks, we will text a valuation for {{ reg }} straight over.
        </p>

        <p class="u-legal mt-4">
          Valuations are indicative and subject to inspection. No obligation to sell.
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'
import AppIcon from '../shared/AppIcon.vue'

const regId = useId()
const mileageId = useId()

const reg = ref('')
const mileage = ref('')
const error = ref('')
const submitted = ref(false)

const points = ['Free valuation', 'We settle outstanding finance', 'Same-day payment', 'No obligation']

function onRegInput(event: Event) {
  reg.value = (event.target as HTMLInputElement).value.toUpperCase()
  if (error.value) error.value = ''
  submitted.value = false
}

function submit() {
  if (reg.value.replace(/\s/g, '').length < 5) {
    error.value = 'Please enter your full registration.'
    submitted.value = false
    return
  }
  error.value = ''
  submitted.value = true
}
</script>

<style scoped>
.plate {
  @apply mt-0 flex items-stretch overflow-hidden rounded-tile border-2 border-ink;
  background: #ffd307;
}

.plate-flash {
  @apply flex w-11 shrink-0 flex-col items-center justify-center gap-0.5 py-2 text-[0.55rem] font-bold leading-none text-white;
  background: #0b3d91;
}

.plate-stars {
  @apply text-[0.6rem] leading-none;
  color: #ffd307;
}

.plate-input {
  @apply w-full border-0 bg-transparent px-3 py-3 font-display text-2xl font-bold uppercase tracking-[0.08em] text-black outline-none placeholder:text-black/35;
}
</style>
