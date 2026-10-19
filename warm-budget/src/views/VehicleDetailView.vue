<template>
  <div v-if="vehicle" class="bg-paper pb-20">
    <div class="u-gutter w-full pt-6">
      <RouterLink to="/vehicles" class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
        <AppIcon name="arrow-left" :size="16" />
        Back to all cars
      </RouterLink>
    </div>

    <div class="u-gutter grid w-full items-start gap-6 pt-5 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
      <div>
        <!-- Gallery -->
        <div class="card overflow-hidden">
          <div class="relative aspect-[16/10]">
            <VehiclePlaceholder
              :image="vehicle.image"
              :gradient="vehicle.gradient"
              object-position="center 70%"
              :label="title"
              class="h-full w-full"
            />
            <span
              class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur-sm"
            >
              <AppIcon name="camera" :size="14" />
              {{ activeFrame + 1 }} of {{ photos }}
            </span>
            <span v-if="vehicle.badge" class="badge absolute right-4 top-4 shadow-card">
              {{ vehicle.badge }}
            </span>
          </div>

          <!-- Thumbnail strip. Every frame is the same stand-in photo until
               real per-vehicle galleries land, so the strip is about proving
               the layout rather than about the pictures. -->
          <ul class="flex gap-2 overflow-x-auto p-3">
            <li v-for="n in Math.min(photos, 8)" :key="n" class="shrink-0">
              <button
                type="button"
                class="thumb"
                :class="{ 'is-active': activeFrame === n - 1 }"
                :aria-label="`Show photo ${n}`"
                :aria-current="activeFrame === n - 1"
                @click="activeFrame = n - 1"
              >
                <VehiclePlaceholder
                  :image="vehicle.image"
                  :gradient="vehicle.gradient"
                  object-position="center 70%"
                  :label="`${title} photo ${n}`"
                  class="h-full w-full"
                />
              </button>
            </li>
          </ul>
        </div>

        <!-- Overview -->
        <section class="card mt-5 p-5 sm:p-7">
          <h1 class="u-display text-2xl sm:text-[1.9rem]">{{ title }}</h1>
          <p class="mt-1 text-base text-ink-soft">{{ vehicle.registration }} {{ vehicle.variant }}</p>

          <ul class="mt-4 flex flex-wrap gap-1.5">
            <li v-for="chip in chips" :key="chip" class="chip">{{ chip }}</li>
          </ul>

          <p class="mt-5 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
            {{ vehicle.description }}
          </p>
        </section>

        <!-- Specification -->
        <section class="card mt-5 p-5 sm:p-7">
          <h2 class="font-display text-lg font-semibold">Specification</h2>
          <dl class="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2">
            <div v-for="row in specs" :key="row.label" class="flex justify-between gap-4 border-b border-line py-2.5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
              <dt class="text-sm text-ink-muted">{{ row.label }}</dt>
              <dd class="text-sm font-semibold text-ink">{{ row.value }}</dd>
            </div>
          </dl>
        </section>

        <!-- Equipment -->
        <section class="card mt-5 p-5 sm:p-7">
          <h2 class="font-display text-lg font-semibold">What's included</h2>
          <ul class="mt-4 grid gap-2.5 sm:grid-cols-2">
            <li v-for="feature in vehicle.features" :key="feature" class="flex items-start gap-2.5 text-sm text-ink-soft">
              <AppIcon name="check" :size="17" class="mt-0.5 shrink-0 text-accent" />
              {{ feature }}
            </li>
          </ul>
        </section>

        <!-- Enquiry -->
        <section id="enquire" class="card mt-5 p-5 sm:p-7">
          <h2 class="font-display text-lg font-semibold">Ask us about this car</h2>
          <p class="mt-1 text-sm text-ink-soft">
            Book a viewing, arrange a test drive or just ask a question. We usually reply the same
            day.
          </p>
          <div class="mt-5">
            <EnquiryForm :vehicle-name="title" submit-label="Send enquiry" />
          </div>
        </section>
      </div>

      <!-- Purchase panel -->
      <aside class="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
        <div class="card p-5 sm:p-6">
          <p class="text-sm text-ink-soft">Our price</p>
          <p class="font-display text-4xl font-semibold leading-none text-ink">{{ priceLabel }}</p>

          <template v-if="financeAvailable">
            <p class="mt-2 text-sm text-ink-soft">
              or from
              <span class="font-display text-xl font-semibold text-accent">
                {{ formatCurrency(vehicle.monthlyFrom) }}
              </span>
              a month over {{ QUOTE_TERM_MONTHS / 12 }} years with no deposit
            </p>

            <div class="mt-5 rounded-panel bg-paper-sink p-4">
              <p class="text-sm font-semibold text-ink">Work out your payment</p>

              <div class="mt-3 flex items-baseline justify-between gap-3">
                <label :for="depositId" class="field-label mb-0">Deposit</label>
                <output :for="depositId" class="font-display text-base font-semibold text-ink">
                  {{ formatCurrency(deposit) }}
                </output>
              </div>
              <input
                :id="depositId"
                v-model.number="deposit"
                type="range"
                min="0"
                :max="maxDeposit"
                :step="100"
                class="mt-2.5"
              />

              <span class="field-label mt-4">Over how long?</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in termOptions"
                  :key="option"
                  type="button"
                  class="term-btn"
                  :class="{ 'is-active': term === option }"
                  :aria-pressed="term === option"
                  @click="term = option"
                >
                  {{ option / 12 }} yrs
                </button>
              </div>

              <dl class="mt-4 flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
                <div class="flex justify-between gap-3">
                  <dt class="text-ink-muted">Amount of credit</dt>
                  <dd class="font-semibold">{{ formatCurrency(amountOfCredit) }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-ink-muted">Monthly payment</dt>
                  <dd class="font-semibold text-accent">{{ formatCurrency(monthlyPayment) }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-ink-muted">Representative APR</dt>
                  <dd class="font-semibold">{{ REPRESENTATIVE_APR }}%</dd>
                </div>
              </dl>
            </div>
          </template>

          <p v-else class="mt-3 rounded-tile bg-paper-sink px-4 py-3 text-sm text-ink-soft">
            <span class="font-semibold text-ink">Cash sale only.</span>
            Finance is not available on vehicles at this price, so no monthly figure is quoted.
          </p>

          <div class="mt-5 flex flex-col gap-2">
            <a href="#enquire" class="btn-primary w-full">
              <AppIcon name="mail" :size="16" />
              Enquire about this car
            </a>
            <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-ghost w-full">
              <AppIcon name="phone" :size="16" />
              {{ dealer.phone }}
            </a>
          </div>

          <ul class="mt-5 flex flex-col gap-2 border-t border-line pt-4">
            <li v-for="point in reassurance" :key="point" class="flex items-start gap-2 text-sm text-ink-soft">
              <AppIcon name="check-circle" :size="16" class="mt-0.5 shrink-0 text-accent" />
              {{ point }}
            </li>
          </ul>

          <!-- The representative example and the broker disclosure sit next to
               the price, not once per page, because this panel is where the
               monthly figure is quoted. -->
          <template v-if="financeAvailable">
            <p class="u-legal mt-5">{{ calculatorDisclaimer }}</p>
            <p class="u-legal mt-2">{{ representativeExample }}</p>
            <p class="u-legal mt-2">{{ brokerDisclosure }} {{ lenderPanelDisclosure }}</p>
          </template>
        </div>
      </aside>
    </div>

    <!-- Similar cars -->
    <section v-if="similar.length" class="u-gutter w-full pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          :title="`More ${vehicle.bodyType.toLowerCase()}s in stock`"
          size="sm"
        />
        <RouterLink :to="{ name: 'vehicles', query: { bodyType: vehicle.bodyType } }" class="btn-ghost shrink-0">
          View all
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>

      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="item in similar" :key="item.id">
          <VehicleCard :vehicle="item" />
        </li>
      </ul>
    </section>
  </div>

  <div v-else class="u-gutter w-full py-24 text-center">
    <h1 class="u-display text-2xl">We can't find that car</h1>
    <p class="mt-3 text-sm text-ink-soft">It may have been sold. Have a look at what else is in stock.</p>
    <RouterLink to="/vehicles" class="btn-primary mt-6">Browse all cars</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getVehicleById, photoCount, vehicles } from '../data/vehicles'
import {
  brokerDisclosure,
  calculatorDisclaimer,
  dealer,
  lenderPanelDisclosure,
  monthlyPaymentFor,
  QUOTE_TERM_MONTHS,
  representativeExample,
  REPRESENTATIVE_APR,
} from '../data/dealer'
import { formatCurrency, formatMileage } from '../composables/useVehicleFilters'
import AppIcon from '../components/shared/AppIcon.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import VehicleCard from '../components/shared/VehicleCard.vue'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'

const route = useRoute()
const depositId = useId()

const vehicle = computed(() => getVehicleById(String(route.params.id)))

const title = computed(() =>
  vehicle.value ? `${vehicle.value.make} ${vehicle.value.model}` : 'Vehicle',
)

const photos = computed(() => (vehicle.value ? photoCount(vehicle.value.id) : 0))
const activeFrame = ref(0)

const priceLabel = computed(() =>
  vehicle.value && vehicle.value.price > 0 ? formatCurrency(vehicle.value.price) : 'POA',
)

const financeAvailable = computed(
  () => !!vehicle.value && vehicle.value.price > 0 && vehicle.value.monthlyFrom > 0,
)

const termOptions = [36, 48, 60]
// Opens on the longest term so the calculator's first reading matches the
// "from" figure directly above it.
const term = ref(QUOTE_TERM_MONTHS)
const deposit = ref(0)

const maxDeposit = computed(() =>
  vehicle.value ? Math.max(500, Math.floor((vehicle.value.price * 0.5) / 100) * 100) : 500,
)

const amountOfCredit = computed(() =>
  Math.max(0, (vehicle.value?.price ?? 0) - deposit.value),
)

/**
 * The calculator's own figure, for the deposit and term the shopper picked.
 * Distinct from `vehicle.monthlyFrom`, which is always the longest term with
 * no deposit — that is what makes the headline a "from" price.
 */
const monthlyPayment = computed(() => monthlyPaymentFor(amountOfCredit.value, term.value))

const chips = computed(() =>
  vehicle.value
    ? [
        formatMileage(vehicle.value.mileage),
        vehicle.value.fuel,
        vehicle.value.transmission,
        vehicle.value.bodyType,
        `${vehicle.value.doors} doors`,
      ]
    : [],
)

const specs = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { label: 'Registration', value: v.registration },
    { label: 'Mileage', value: formatMileage(v.mileage) },
    { label: 'Engine', value: v.engine },
    { label: 'Power', value: v.power },
    { label: 'Fuel', value: v.fuel },
    { label: 'Gearbox', value: v.transmission },
    { label: 'Body type', value: v.bodyType },
    { label: 'Doors', value: String(v.doors) },
    { label: 'Seats', value: String(v.seats) },
    { label: 'Colour', value: v.colour },
  ]
})

const reassurance = [
  '120-point check and fresh MOT',
  '12 months warranty included',
  'Part-exchange welcome',
  'Nationwide delivery available',
]

// Same body type first, then anything else, so the row is always full.
const similar = computed(() => {
  const current = vehicle.value
  if (!current) return []
  const rest = vehicles.filter((v) => v.id !== current.id)
  return [
    ...rest.filter((v) => v.bodyType === current.bodyType),
    ...rest.filter((v) => v.bodyType !== current.bodyType),
  ].slice(0, 4)
})

// Navigating between vehicles reuses this component, so per-vehicle state has
// to be reset explicitly — otherwise a deposit larger than the next car's
// price would carry across.
watch(
  vehicle,
  (next) => {
    activeFrame.value = 0
    deposit.value = 0
    term.value = QUOTE_TERM_MONTHS
    if (next) document.title = `${next.make} ${next.model} ${next.variant} | ${dealer.name}`
  },
  { immediate: true },
)
</script>

<style scoped>
.thumb {
  @apply block h-14 w-20 overflow-hidden rounded-tile border-2 border-transparent transition-colors duration-150 ease-out hover:border-ink/20;
}

.thumb.is-active {
  @apply border-accent;
}

.term-btn {
  @apply rounded-control border border-line bg-paper-soft px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-ink/25 hover:text-ink;
}

.term-btn.is-active {
  @apply border-accent bg-accent-wash text-accent;
}
</style>
