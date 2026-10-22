<template>
  <div class="bg-paper">
    <!-- valuation header -->
    <header class="border-b border-line bg-paper-soft">
      <div class="u-gutter flex w-full flex-col items-center gap-10 py-12 text-center md:py-16">
        <div class="flex flex-col items-center gap-4">
          <h1 class="u-display text-[1.7rem] min-[480px]:text-[2rem] sm:text-[2.2rem] lg:whitespace-nowrap lg:text-[2.4rem] xl:text-[2.8rem] 2xl:text-[3.2rem]" data-intro>
            Looking to part-exchange or sell your car?
          </h1>
          <p class="max-w-prose text-ink-soft" data-intro>
            Get a free, instant valuation so you know exactly how much you can put towards your
            next car.
          </p>
        </div>

        <form class="panel flex w-full max-w-md flex-col gap-5 p-6 text-left md:p-8" novalidate data-intro @submit.prevent="onSubmit">
          <div class="flex flex-col gap-2">
            <label for="sell-reg" class="calc-label">Enter your vehicle registration</label>
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
            <p v-if="errors.reg" class="text-sm text-ink" role="alert">{{ errors.reg }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <label for="sell-mileage" class="calc-label">Mileage</label>
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
            <p v-if="errors.mileage" class="text-sm text-ink" role="alert">{{ errors.mileage }}</p>
          </div>

          <button type="submit" class="btn-primary">
            Get my valuation
            <AppIcon name="arrow" :size="16" />
          </button>

          <p v-if="valued" class="border border-line bg-paper-sink p-4 text-sm text-ink-soft" role="status">
            Cars like yours are currently valued from
            <span class="font-semibold text-accent">£18,400</span>. Our team will confirm your exact
            figure.
          </p>
        </form>
      </div>
    </header>

    <!-- how it works -->
    <section class="bg-paper py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading title="Three simple steps" center />

        <ol class="grid gap-5 md:grid-cols-3">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="panel flex flex-col gap-4 p-6"
            data-reveal
            :data-reveal-delay="i * 90"
          >
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-accent">
                <AppIcon :name="step.icon" :size="21" />
              </span>
              <h3 class="font-display text-xl text-ink">{{ step.title }}</h3>
            </div>
            <p class="text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <Reviews />
    <FeaturedVehicles />

    <!-- finance disclosure -->
    <section class="bg-paper py-8">
      <div class="u-gutter w-full">
        <p class="mx-auto max-w-prose text-center text-xs text-ink-muted">
          {{ representativeExample }} {{ brokerDisclosure }}
        </p>
      </div>
    </section>

    <!-- faq -->
    <section class="u-rule bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading title="Frequently asked questions" center />
        <div class="mx-auto w-full max-w-3xl">
          <FaqList :faqs="faqs" />
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { brokerDisclosure, representativeExample } from '../data/dealer'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'
import Reviews from '../components/home/Reviews.vue'
import FeaturedVehicles from '../components/home/FeaturedVehicles.vue'

useScrollReveal()

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

const steps = [
  {
    icon: 'search',
    title: 'Get a free valuation',
    body: 'Simply enter your car’s registration and mileage. It’s quick, easy and free.',
  },
  {
    icon: 'key',
    title: 'Sell or part-exchange',
    body: 'We buy cars outright and take part-exchanges, so funding your next vehicle is simple.',
  },
  {
    icon: 'pound',
    title: 'Reduce your next cost',
    body: 'Use the proceeds from your sale or part-exchange to reduce the cost of your new vehicle.',
  },
]

const faqs = [
  {
    question: 'Can I sell my car with outstanding finance?',
    answer:
      'Yes. Ask your lender for a settlement figure and we will take care of paying it off as part of the deal. If your car is worth more than you owe, the difference goes towards your next car or to you.',
  },
  {
    question: 'Who do I need to tell that I’ve sold my car?',
    answer:
      'The DVLA needs to know the car has changed hands. We will help you complete the V5C notification, and you should also let your insurer know once the sale is done.',
  },
  {
    question: 'What documents are needed to part-exchange my car?',
    answer:
      'Bring your V5C logbook, photo ID, proof of address, the service history and all keys. If the car is on finance, bring your settlement figure from the lender too.',
  },
]
</script>

<style scoped>
.calc-label {
  @apply text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted;
}

.reg-plate-wrap {
  @apply flex overflow-hidden rounded-control border-2 border-[#0a0b0d] bg-[#f6c744];
}

.reg-badge {
  @apply flex w-11 shrink-0 items-end justify-center bg-[#1d4ea3] pb-1.5 text-xs font-semibold text-white;
}

.reg-plate {
  @apply w-full bg-transparent px-4 py-3 text-center font-display text-xl font-semibold uppercase tracking-widest text-[#0a0b0d] outline-none placeholder:text-[#0a0b0d]/50;
}
</style>
