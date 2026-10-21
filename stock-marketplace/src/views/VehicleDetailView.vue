<template>
  <div v-if="vehicle">
    <PageHeader
      :title="`${vehicle.make} ${vehicle.model}`"
      :current="`${vehicle.make} ${vehicle.model}`"
      :subtitle="`${vehicle.variant} · ${vehicle.year} · ${formatMileage(vehicle.mileage)}`"
      :crumbs="[{ label: 'Used cars', to: '/vehicles' }]"
    />

    <div class="u-gutter grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-10 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <div class="min-w-0">
        <div
          class="relative overflow-hidden rounded-panel border border-line"
          :style="{ background: `linear-gradient(135deg, rgb(${vehicle.gradient[0]}), rgb(${vehicle.gradient[1]}))` }"
        >
          <img
            :src="vehicle.image"
            :alt="`${vehicle.year} ${vehicle.make} ${vehicle.model}`"
            class="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            width="1200"
            height="900"
            fetchpriority="high"
          />
          <span
            v-if="vehicle.badge"
            class="absolute left-4 top-4 rounded bg-ink px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-paper"
          >
            {{ vehicle.badge }}
          </span>
        </div>
        <p class="mt-2 text-xs text-ink-muted">
          Illustrative photography. The exact car, trim and condition would be confirmed at a viewing.
        </p>

        <ul class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <li v-for="fact in facts" :key="fact.label" class="panel flex items-center gap-3 p-4">
            <AppIcon :name="fact.icon" :size="20" class="shrink-0 text-accent" />
            <div>
              <p class="text-xs text-ink-muted">{{ fact.label }}</p>
              <p class="tabular text-sm font-semibold">{{ fact.value }}</p>
            </div>
          </li>
        </ul>

        <section class="mt-10" aria-labelledby="about-title">
          <h2 id="about-title" class="u-h2">About this {{ vehicle.model }}</h2>
          <p class="mt-4 max-w-prose leading-relaxed text-ink-soft">{{ vehicle.description }}</p>
        </section>

        <section class="mt-10" aria-labelledby="features-title">
          <h2 id="features-title" class="u-h2">Key features</h2>
          <ul class="mt-4 grid gap-x-8 border-t border-line sm:grid-cols-2">
            <li v-for="feature in vehicle.features" :key="feature" class="flex items-center gap-3 border-b border-line py-3 text-sm">
              <AppIcon name="check" :size="16" class="shrink-0 text-accent" />
              {{ feature }}
            </li>
          </ul>
        </section>

        <section class="mt-10" aria-labelledby="spec-title">
          <h2 id="spec-title" class="u-h2">Specification</h2>
          <dl class="mt-4 grid gap-x-8 border-t border-line sm:grid-cols-2">
            <div v-for="spec in specs" :key="spec.label" class="flex justify-between gap-4 border-b border-line py-3 text-sm">
              <dt class="text-ink-muted">{{ spec.label }}</dt>
              <dd class="tabular text-right font-medium">{{ spec.value }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside class="lg:sticky lg:top-[calc(var(--nav-h)+3rem)] lg:self-start" aria-label="Price and finance">
        <div class="panel p-6">
          <p class="text-xs font-semibold uppercase tracking-micro text-ink-muted">Cash price</p>
          <p class="tabular mt-1 text-4xl font-bold">{{ formatCurrency(vehicle.price) }}</p>

          <div class="mt-5 rounded-control bg-paper-soft p-4">
            <p class="text-xs font-semibold uppercase tracking-micro text-ink-muted">Estimated monthly payment</p>
            <p class="tabular mt-1 text-3xl font-bold text-accent" aria-live="polite">
              {{ formatCurrency(monthly) }}<span class="text-base font-medium text-ink-muted"> / month</span>
            </p>

            <div class="mt-4">
              <label class="field-label flex justify-between" for="deposit">
                <span>Deposit</span>
                <span class="tabular normal-case tracking-normal text-ink">{{ formatCurrency(deposit) }}</span>
              </label>
              <input
                id="deposit"
                v-model.number="deposit"
                type="range"
                min="0"
                :max="maxDeposit"
                step="100"
                class="h-2 w-full cursor-pointer accent-[rgb(194_65_12)]"
              />
            </div>
            <div class="mt-3">
              <label class="field-label" for="term">Term</label>
              <select id="term" v-model.number="term" class="field">
                <option v-for="months in [24, 36, 48, 60]" :key="months" :value="months">
                  {{ months }} months
                </option>
              </select>
            </div>
            <p class="tabular mt-3 text-xs text-ink-muted">
              Amount of credit {{ formatCurrency(vehicle.price - deposit) }} at
              {{ REPRESENTATIVE_APR }}% APR, rounded to the nearest pound.
            </p>
          </div>

          <RouterLink :to="{ hash: '#enquire' }" class="btn-accent mt-5 w-full">
            Enquire about this car
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <RouterLink :to="{ path: '/finance', query: { vehicle: vehicle.id } }" class="btn-ghost mt-3 w-full">
            Open the full calculator
          </RouterLink>
          <RouterLink :to="{ path: '/sell', query: { vehicle: vehicle.id } }" class="btn-ghost mt-3 w-full">
            Part-exchange your car
          </RouterLink>

          <p class="mt-5 text-xs leading-relaxed text-ink-muted">
            {{ representativeExample }} {{ brokerDisclosure }} Finance is subject to status. Illustration
            only: this demo cannot sell, reserve or finance a car.
          </p>
        </div>
      </aside>
    </div>

    <section id="enquire" class="u-gutter pb-10" aria-labelledby="enquire-title">
      <div class="panel mx-auto max-w-3xl p-6 sm:p-8">
        <h2 id="enquire-title" class="u-h2 mb-6">Enquire about this {{ vehicle.model }}</h2>
        <EnquiryForm
          :key="vehicle.id"
          :vehicle-name="`${vehicle.year} ${vehicle.make} ${vehicle.model}`"
          subject="Vehicle viewing"
          :default-message="`I would like to know more about the ${vehicle.year} ${vehicle.make} ${vehicle.model}, ${vehicle.variant} (${formatCurrency(vehicle.price)}).`"
        />
      </div>
    </section>

    <section class="u-gutter pb-6" aria-labelledby="similar-title">
      <div class="mb-6 flex items-end justify-between">
        <h2 id="similar-title" class="u-h2">Similar cars in stock</h2>
        <RouterLink to="/vehicles" class="text-sm font-semibold text-accent hover:text-accent-hover">All stock</RouterLink>
      </div>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="car in similar" :key="car.id"><VehicleCard :vehicle="car" class="h-full" /></li>
      </ul>
    </section>
  </div>

  <div v-else>
    <PageHeader title="That car is not in stock" current="Not found" :crumbs="[{ label: 'Used cars', to: '/vehicles' }]" subtitle="It may have been sold, or the link may be out of date." />
    <div class="u-gutter py-10">
      <RouterLink to="/vehicles" class="btn-accent">Browse all stock</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import VehicleCard from '../components/shared/VehicleCard.vue'
import { formatCurrency, formatMileage } from '../composables/useStockSearch'
import {
  REPRESENTATIVE_APR,
  brokerDisclosure,
  monthlyPaymentFor,
  representativeExample,
} from '../data/dealer'
import { getVehicleById, vehicles } from '../data/vehicles'

const route = useRoute()
const vehicle = computed(() => getVehicleById(String(route.params.id)))

// The router sets a generic title; name the car once it is known.
watchEffect(() => {
  const v = vehicle.value
  document.title = v
    ? `${v.year} ${v.make} ${v.model} | Dealership Name`
    : 'Vehicle not found | Dealership Name'
})

const deposit = ref(0)
const term = ref(60)
// Half the price at most, in whole £100 steps, so the slider always ends on a valid value.
const maxDeposit = computed(() => Math.floor((vehicle.value?.price ?? 0) / 2 / 100) * 100)
watch(
  () => route.params.id,
  () => {
    deposit.value = 0
    term.value = 60
  },
)

const monthly = computed(() =>
  vehicle.value ? monthlyPaymentFor(vehicle.value.price - deposit.value, term.value) : 0,
)

const facts = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { label: 'Year', value: String(v.year), icon: 'calendar' },
    { label: 'Mileage', value: formatMileage(v.mileage), icon: 'gauge' },
    { label: 'Fuel', value: v.fuel, icon: 'fuel' },
    { label: 'Gearbox', value: v.transmission, icon: 'gear' },
  ]
})

const specs = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { label: 'Registration', value: v.registration },
    { label: 'Body type', value: v.bodyType },
    { label: 'Engine', value: v.engine },
    { label: 'Power', value: v.power },
    { label: 'Doors', value: String(v.doors) },
    { label: 'Seats', value: String(v.seats) },
    { label: 'Colour', value: v.colour },
    { label: 'Stock reference', value: v.id.toUpperCase() },
  ]
})

// Closest in price first, so the suggestions are genuine alternatives.
const similar = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return vehicles
    .filter((other) => other.id !== v.id)
    .sort((a, b) => Math.abs(a.price - v.price) - Math.abs(b.price - v.price))
    .slice(0, 3)
})
</script>
