<template>
  <section class="relative overflow-hidden bg-ink pt-[calc(var(--nav-h)+3rem)] text-white">
    <img
      src="/hero-poster.svg"
      alt=""
      class="absolute inset-0 h-full w-full object-cover opacity-40"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/80"></div>

    <div class="container relative flex flex-col items-center gap-10 pb-16 md:pb-24">
      <div class="flex flex-col items-center gap-4 text-center">
        <h1
          class="u-display text-2xl !text-white min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:whitespace-nowrap"
          data-intro
        >
          Looking to part-exchange or sell your car?
        </h1>
        <p class="max-w-prose text-lg text-white/80" data-intro>
          Get a free, instant valuation so you know exactly how much you can put towards your next
          car.
        </p>
      </div>

      <form
        class="flex w-full max-w-md flex-col gap-5 rounded-panel bg-white p-6 text-ink shadow-lift md:p-8"
        novalidate
        data-intro
        @submit.prevent="onSubmit"
      >
        <div class="flex flex-col gap-2">
          <label for="sell-reg" class="text-sm font-medium">Enter your vehicle registration</label>
          <div class="reg-plate-wrap">
            <span class="reg-badge" aria-hidden="true">UK</span>
            <input
              id="sell-reg"
              v-model="reg"
              type="text"
              class="reg-plate"
              placeholder="ENTER REG"
              maxlength="8"
              autocomplete="off"
              :aria-invalid="!!errors.reg"
            />
          </div>
          <p v-if="errors.reg" class="text-sm text-accent" role="alert">{{ errors.reg }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label for="sell-mileage" class="text-sm font-medium">Mileage</label>
          <p class="text-xs text-ink-muted">An estimate is fine if you don't know the exact figure.</p>
          <input
            id="sell-mileage"
            v-model="mileage"
            type="text"
            inputmode="numeric"
            class="field"
            placeholder="e.g. 30,000"
            :aria-invalid="!!errors.mileage"
          />
          <p v-if="errors.mileage" class="text-sm text-accent" role="alert">{{ errors.mileage }}</p>
        </div>

        <button type="submit" class="btn-accent justify-center">
          Get my valuation
          <AppIcon name="arrow" :size="16" />
        </button>

        <p v-if="valued" class="rounded-control bg-paper-soft p-4 text-sm" role="status">
          Cars like yours are currently valued from
          <span class="font-semibold text-accent">£18,400</span>. Our team will confirm your exact
          figure.
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'

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
.reg-plate-wrap {
  @apply flex overflow-hidden rounded-control border-2 border-ink bg-[#f6c744];
}
.reg-badge {
  @apply flex w-11 shrink-0 items-end justify-center bg-[#1d4ea3] pb-1.5 text-xs font-semibold text-white;
}
.reg-plate {
  @apply w-full bg-transparent px-4 py-3 text-center font-display text-xl font-semibold uppercase tracking-widest text-ink outline-none placeholder:text-ink/50;
}
</style>
