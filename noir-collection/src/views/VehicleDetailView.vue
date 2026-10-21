<template>
  <div v-if="vehicle">
    <!-- Full-bleed photograph with the name set over it, like a catalogue plate. -->
    <section class="relative isolate flex min-h-[560px] items-end overflow-hidden bg-paper-sink" style="height: 82svh; max-height: 920px">
      <img
        :src="vehicle.image"
        :alt="`${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.colour}`"
        class="absolute inset-0 -z-10 h-full w-full object-cover"
        fetchpriority="high"
        width="1600"
        height="1067"
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/30 to-black/50"></div>
      <div class="u-gutter pb-10 pt-[calc(var(--nav-h)+2rem)]">
        <nav aria-label="Breadcrumb" class="mb-6 flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
          <RouterLink to="/" class="hover:text-ink">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/vehicles" class="hover:text-ink">The Collection</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ vehicle.make }} {{ vehicle.model }}</span>
        </nav>
        <p v-if="vehicle.badge" class="u-eyebrow mb-4">{{ vehicle.badge }}</p>
        <h1 class="font-display">
          <span class="block text-sm font-medium uppercase tracking-[0.32em] text-ink-soft sm:text-base">{{ vehicle.make }}</span>
          <span class="mt-3 block text-5xl font-extralight leading-[0.95] tracking-[-0.04em] sm:text-7xl">{{ vehicle.model }}</span>
        </h1>
        <p class="tabular mt-5 text-sm text-ink-soft sm:text-base">
          {{ vehicle.variant }} · {{ vehicle.year }} · {{ formatMileage(vehicle.mileage) }} · {{ vehicle.colour }}
        </p>
      </div>
    </section>

    <div class="u-gutter grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-20 lg:py-20 xl:grid-cols-[minmax(0,1fr)_28rem]">
      <div class="min-w-0">
        <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-4">
          <div v-for="fact in facts" :key="fact.label" class="bg-paper p-5">
            <dt class="text-[0.62rem] uppercase tracking-[0.22em] text-ink-muted">{{ fact.label }}</dt>
            <dd class="tabular mt-2 font-display text-2xl">{{ fact.value }}</dd>
          </div>
        </dl>

        <section class="mt-16" aria-labelledby="about-title">
          <p class="u-eyebrow">The car</p>
          <h2 id="about-title" class="u-h2 mt-4">About this {{ vehicle.model }}</h2>
          <p class="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">{{ vehicle.description }}</p>
          <p class="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
            Illustrative photography of this model. The exact car, its history and condition would be presented in
            full at a private viewing.
          </p>
        </section>

        <section class="mt-16" aria-labelledby="spec-title">
          <h2 id="spec-title" class="font-display text-3xl">Highlights</h2>
          <ul class="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
            <li v-for="feature in vehicle.features" :key="feature" class="flex items-center gap-4 border-b border-line py-4 text-ink-soft">
              <span class="h-px w-5 shrink-0 bg-accent" aria-hidden="true"></span>
              {{ feature }}
            </li>
          </ul>
        </section>

        <section class="mt-16" aria-labelledby="sheet-title">
          <h2 id="sheet-title" class="font-display text-3xl">Specification</h2>
          <dl class="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
            <div v-for="spec in specs" :key="spec.label" class="flex justify-between gap-6 border-b border-line py-4 text-sm">
              <dt class="text-ink-muted">{{ spec.label }}</dt>
              <dd class="tabular text-right">{{ spec.value }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside class="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start" aria-label="Price and finance">
        <div class="rounded-panel border border-line bg-paper-soft p-7 sm:p-8">
          <p class="text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">Price</p>
          <p class="tabular mt-2 font-display text-4xl">{{ formatCurrency(vehicle.price) }}</p>

          <div class="mt-8 border-t border-line pt-6">
            <div class="flex items-baseline justify-between gap-4">
              <p class="text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">Estimated monthly</p>
              <p class="tabular font-display text-3xl text-accent" aria-live="polite">{{ formatCurrency(monthly) }}</p>
            </div>
            <div class="mt-6">
              <label class="field-label flex justify-between" for="deposit">
                <span>Deposit</span>
                <span class="tabular normal-case tracking-normal text-ink">{{ formatCurrency(deposit) }}</span>
              </label>
              <input id="deposit" v-model.number="deposit" type="range" min="0" :max="maxDeposit" :step="step" class="w-full cursor-pointer accent-[rgb(201_169_110)]" />
            </div>
            <fieldset class="mt-5">
              <legend class="field-label">Term</legend>
              <div class="grid grid-cols-4 overflow-hidden rounded-control border border-line">
                <label
                  v-for="months in [24, 36, 48, 60]"
                  :key="months"
                  class="cursor-pointer border-l border-line py-2.5 text-center text-sm transition first:border-l-0 has-[:checked]:bg-accent has-[:checked]:text-accent-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-accent"
                >
                  <input v-model.number="term" type="radio" name="vdp-term" :value="months" class="sr-only" />
                  <span class="tabular">{{ months }}</span>
                </label>
              </div>
            </fieldset>
            <p class="tabular mt-4 text-xs leading-relaxed text-ink-muted">
              {{ formatCurrency(vehicle.price - deposit) }} of credit over {{ term }} months at a representative
              {{ REPRESENTATIVE_APR }}% APR, rounded to the nearest pound.
            </p>
          </div>

          <div class="mt-8 grid gap-3">
            <a href="#viewing" class="btn-accent" @click.prevent="toViewing">
              Request a private viewing
              <AppIcon name="arrow" :size="15" />
            </a>
            <RouterLink :to="{ path: '/finance', query: { vehicle: vehicle.id } }" class="btn-ghost">Full finance calculator</RouterLink>
            <RouterLink :to="{ path: '/sell', query: { vehicle: vehicle.id } }" class="btn-ghost">Part-exchange your car</RouterLink>
          </div>

          <p class="mt-6 text-xs leading-relaxed text-ink-muted">
            {{ representativeExample }} {{ brokerDisclosure }} This preview cannot sell, reserve or finance a car.
          </p>
        </div>
      </aside>
    </div>

    <section id="viewing" class="border-y border-line bg-paper-soft" aria-labelledby="viewing-title">
      <div class="u-gutter grid gap-12 py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <p class="u-eyebrow">By appointment</p>
          <h2 id="viewing-title" class="u-h2 mt-5">Request a private viewing</h2>
          <p class="mt-5 max-w-md leading-relaxed text-ink-soft">
            Choose a preferred date and time. The car would be prepared under the lights, with time set aside for a
            test drive and any questions about its history.
          </p>
        </div>
        <EnquiryForm
          :key="vehicle.id"
          kind="viewing"
          :vehicle-name="`${vehicle.year} ${vehicle.make} ${vehicle.model}`"
          subject="Vehicle viewing"
          submit-label="Preview viewing request"
          :default-message="`I would like to view the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}.`"
        />
      </div>
    </section>

    <section class="u-gutter py-20" aria-labelledby="also-title">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 id="also-title" class="u-h2">Also in the collection</h2>
        <RouterLink to="/vehicles" class="btn-ghost">The full collection</RouterLink>
      </div>
      <ul class="grid gap-x-8 gap-y-12 md:grid-cols-3">
        <li v-for="car in similar" :key="car.id"><CollectionCard :car="car" /></li>
      </ul>
    </section>
  </div>

  <div v-else>
    <PageHeader
      title="That car is no longer in the collection."
      current="Not found"
      :crumbs="[{ label: 'The Collection', to: '/vehicles' }]"
      subtitle="It may have found a new home, or the link may be out of date."
    />
    <div class="u-gutter py-14">
      <RouterLink to="/vehicles" class="btn-accent">View the collection</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import CollectionCard from '../components/shared/CollectionCard.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { formatCurrency, formatMileage } from '../composables/useCollectionSearch'
import { REPRESENTATIVE_APR, brokerDisclosure, monthlyPaymentFor, representativeExample } from '../data/dealer'
import { getVehicleById, vehicles } from '../data/vehicles'

const route = useRoute()
const vehicle = computed(() => getVehicleById(String(route.params.id)))

watchEffect(() => {
  const v = vehicle.value
  document.title = v ? `${v.year} ${v.make} ${v.model} | Dealership Name` : 'Vehicle not found | Dealership Name'
})

// Deposit runs to half the price in steps that suit the car's value.
const step = computed(() => ((vehicle.value?.price ?? 0) > 50000 ? 1000 : 500))
const maxDeposit = computed(() => Math.floor((vehicle.value?.price ?? 0) / 2 / step.value) * step.value)
const deposit = ref(0)
const term = ref(48)
watch(
  vehicle,
  (v) => {
    deposit.value = v ? Math.round((v.price * 0.1) / step.value) * step.value : 0
    term.value = 48
  },
  { immediate: true },
)

const monthly = computed(() => (vehicle.value ? monthlyPaymentFor(vehicle.value.price - deposit.value, term.value) : 0))

const facts = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { label: 'Year', value: String(v.year) },
    { label: 'Mileage', value: new Intl.NumberFormat('en-GB').format(v.mileage) },
    { label: 'Power', value: v.power },
    { label: 'Gearbox', value: v.transmission },
  ]
})

const specs = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { label: 'Registration', value: v.registration },
    { label: 'Body style', value: v.bodyType },
    { label: 'Engine', value: v.engine },
    { label: 'Fuel', value: v.fuel },
    { label: 'Doors', value: String(v.doors) },
    { label: 'Seats', value: String(v.seats) },
    { label: 'Colour', value: v.colour },
    { label: 'Reference', value: v.id.toUpperCase() },
  ]
})

// Closest in price, so the suggestions are genuine alternatives.
const similar = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return vehicles
    .filter((other) => other.id !== v.id)
    .sort((a, b) => Math.abs(a.price - v.price) - Math.abs(b.price - v.price))
    .slice(0, 3)
})

function toViewing() {
  const target = document.getElementById('viewing')
  target?.scrollIntoView({ behavior: 'smooth' })
  // Move focus to the first field so keyboard users land in the form.
  window.setTimeout(() => (document.getElementById('f-date') as HTMLElement | null)?.focus({ preventScroll: true }), 400)
}
</script>
