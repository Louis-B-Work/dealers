<template>
  <div>
    <PageHeader
      title="Sell or part-exchange your car"
      current="Sell your car"
      eyebrow="Sell your car"
      subtitle="Tell us about the car you are moving on from. We will talk you through selling it outright or putting it towards something in stock."
    />

    <div class="u-gutter space-y-10 py-10">
      <div class="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <ol class="grid gap-4">
            <li v-for="(step, index) in steps" :key="step.title" class="panel flex gap-4 p-5">
              <span class="tabular text-2xl font-bold text-accent">0{{ index + 1 }}</span>
              <div>
                <h2 class="text-base font-semibold">{{ step.title }}</h2>
                <p class="mt-1 text-sm text-ink-soft">{{ step.text }}</p>
              </div>
            </li>
          </ol>
          <ul class="mt-6 border-t border-line">
            <li v-for="tip in tips" :key="tip" class="flex items-center gap-3 border-b border-line py-3 text-sm text-ink-soft">
              <AppIcon name="check" :size="16" class="shrink-0 text-accent" />
              {{ tip }}
            </li>
          </ul>
          <p class="mt-4 text-xs text-ink-muted">
            This is an enquiry flow, not an automated valuation. No offer, payment or finance settlement is generated.
          </p>
        </div>

        <div class="panel p-6 sm:p-8">
          <h2 class="u-h2 mb-6">Tell us about your car</h2>
          <EnquiryForm
            :key="String(route.query.vehicle ?? '')"
            valuation
            :subject="car ? 'Part-exchange' : 'Sell my car'"
            submit-label="Preview valuation request"
            :default-message="car ? `I am interested in part-exchanging towards the ${car.year} ${car.make} ${car.model}.` : ''"
            message-placeholder="Condition, service history, anything we should know"
          />
        </div>
      </div>

      <FaqList :faqs="faqs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import FaqList from '../components/shared/FaqList.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { getVehicleById } from '../data/vehicles'

const route = useRoute()
const car = computed(() => getVehicleById(String(route.query.vehicle ?? '')))

const steps = [
  { title: 'Describe your car', text: 'Registration, mileage and an honest account of its condition give a valuer a useful starting point.' },
  { title: 'Talk through the details', text: 'Service history, ownership and any finance matter. A live dealership would confirm an offer after inspecting the car.' },
  { title: 'Choose your next step', text: 'Sell outright, or use any agreed value towards your next car. There is no obligation to buy from stock.' },
]

const tips = [
  'Have your current mileage and service history to hand',
  'Mention any damage or known mechanical issues',
  'Ask your lender for a settlement figure if finance is outstanding',
  'Keep the V5C logbook and proof of ownership ready for a real sale',
]

const faqs = [
  { question: 'Can I sell without buying a car?', answer: 'That is the intended outright-sale option. In a live service, any offer would depend on the car and an inspection. This preview cannot buy vehicles.' },
  { question: 'What if my car has finance outstanding?', answer: 'Ask your lender for a current settlement figure. If the agreed value is lower than the settlement, the shortfall must be resolved before a sale can proceed.' },
  { question: 'Is a valuation guaranteed?', answer: 'No. This form is a demonstration. A real valuation needs accurate details and an inspection, and any offer should set out its conditions in writing.' },
]
</script>
