<template>
  <div>
    <PageHeader
      title="Sell or part-exchange"
      current="Sell your car"
      eyebrow="Valuations"
      subtitle="We buy exceptional cars outright and take them in part-exchange. Tell us about yours to begin."
      :image="headerImage"
    />

    <div class="u-gutter space-y-24 py-16 lg:py-20">
      <ol class="grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
        <li v-for="(step, index) in steps" :key="step.title" class="bg-paper p-8">
          <span class="tabular font-display text-5xl text-accent">0{{ index + 1 }}</span>
          <h2 class="mt-6 font-display text-2xl">{{ step.title }}</h2>
          <p class="mt-3 leading-relaxed text-ink-soft">{{ step.text }}</p>
        </li>
      </ol>

      <section class="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20" aria-labelledby="form-title">
        <div>
          <p class="u-eyebrow">Before you begin</p>
          <h2 id="form-title" class="u-h2 mt-5">Tell us about your car</h2>
          <ul class="mt-8 border-t border-line">
            <li v-for="tip in tips" :key="tip" class="flex items-center gap-4 border-b border-line py-4 text-ink-soft">
              <span class="h-px w-5 shrink-0 bg-accent" aria-hidden="true"></span>
              {{ tip }}
            </li>
          </ul>
          <p class="mt-6 text-sm text-ink-muted">
            This is an enquiry flow, not an automated valuation. No offer, payment or finance settlement is generated.
          </p>
        </div>
        <EnquiryForm
          :key="String(route.query.vehicle ?? '')"
          kind="valuation"
          :subject="car ? 'Part-exchange' : 'Sell my car'"
          submit-label="Preview valuation request"
          :default-message="car ? `I would like to part-exchange towards the ${car.year} ${car.make} ${car.model}.` : ''"
          message-placeholder="Condition, service history, specification, anything we should know"
        />
      </section>

      <FaqList :faqs="faqs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import FaqList from '../components/shared/FaqList.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { getVehicleById } from '../data/vehicles'

const route = useRoute()
const car = computed(() => getVehicleById(String(route.query.vehicle ?? '')))
const headerImage = getVehicleById('bmw-m4-2022')?.image ?? ''

const steps = [
  { title: 'Describe your car', text: 'Registration, mileage, specification and an honest account of its condition give a valuer a useful place to start.' },
  { title: 'A considered appraisal', text: 'History, ownership and any finance all matter. A live dealership would confirm an offer only after inspecting the car.' },
  { title: 'Sell, or trade up', text: 'Sell outright, or put any agreed value towards a car from the collection. There is no obligation either way.' },
]

const tips = [
  'Have the current mileage and service history to hand',
  'Note any factory options or special specification',
  'Mention any damage or known mechanical issues',
  'Ask your lender for a settlement figure if finance is outstanding',
]

const faqs = [
  { question: 'Do you buy cars outright?', answer: 'That is the intended outright-sale option. In a live service any offer depends on the car and an inspection. This preview cannot buy vehicles.' },
  { question: 'What if there is finance outstanding?', answer: 'Ask your lender for a current settlement figure. If the agreed value is lower, the shortfall must be resolved before a sale can proceed.' },
  { question: 'Is a valuation guaranteed?', answer: 'No. This form is a demonstration. A real valuation needs accurate details and an inspection, and any offer should set out its conditions in writing.' },
]
</script>
