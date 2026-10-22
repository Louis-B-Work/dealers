<template>
  <div v-if="vehicle" class="bg-paper pb-24 pt-[84px]">
    <!-- breadcrumb -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex items-center gap-2 py-5 text-sm text-ink-muted">
        <RouterLink to="/vehicles" class="inline-flex items-center gap-1.5 hover:text-ink">
          <AppIcon name="arrow-left" :size="15" />
          All vehicles
        </RouterLink>
        <span>/</span>
        <span class="text-ink">{{ vehicle.make }} {{ vehicle.model }}</span>
      </div>
    </div>

    <div class="container grid gap-10 pt-10 lg:grid-cols-[1.55fr_1fr]">
      <!-- Left: gallery + detail -->
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-3">
          <div class="overflow-hidden rounded-panel shadow-soft">
            <VehiclePlaceholder
              :gradient="vehicle.gradient"
              :badge="vehicle.badge"
              :image="vehicle.image"
              :label="`${vehicle.make} ${vehicle.model}, ${views[activeView]}`"
              :silhouette-size="170"
              class="aspect-[16/10] w-full"
            >
              <span
                class="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-soft backdrop-blur"
              >
                {{ views[activeView] }}
              </span>
            </VehiclePlaceholder>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="(view, i) in views"
              :key="view"
              type="button"
              class="overflow-hidden rounded-control border-2 transition"
              :class="i === activeView ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'"
              @click="activeView = i"
            >
              <VehiclePlaceholder
                :gradient="vehicle.gradient"
                :image="vehicle.image"
                :label="view"
                :silhouette-size="46"
                class="aspect-[4/3] w-full"
              />
            </button>
          </div>
        </div>

        <!-- overview specs -->
        <section>
          <h2 class="font-display text-2xl text-ink">At a glance</h2>
          <dl class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
            <div v-for="spec in specs" :key="spec.label" class="flex items-center gap-3 bg-surface p-4">
              <span class="flex h-9 w-9 items-center justify-center rounded-control bg-paper-soft text-accent">
                <AppIcon :name="spec.icon" :size="18" />
              </span>
              <div>
                <dt class="text-xs uppercase tracking-wider text-ink-muted">{{ spec.label }}</dt>
                <dd class="text-sm font-semibold text-ink">{{ spec.value }}</dd>
              </div>
            </div>
          </dl>
        </section>

        <!-- description -->
        <section class="flex flex-col gap-4">
          <h2 class="font-display text-2xl text-ink">About this {{ vehicle.model }}</h2>
          <p class="max-w-prose leading-relaxed text-ink-soft">{{ vehicle.description }}</p>
        </section>

        <!-- features -->
        <section class="flex flex-col gap-4">
          <h2 class="font-display text-2xl text-ink">Specification &amp; features</h2>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li
              v-for="feature in vehicle.features"
              :key="feature"
              class="flex items-center gap-3 rounded-control border border-line bg-surface px-4 py-3 text-sm text-ink-soft"
            >
              <AppIcon name="check" :size="16" class="shrink-0 text-accent" />
              {{ feature }}
            </li>
          </ul>
        </section>
      </div>

      <!-- Right: sticky purchase panel -->
      <aside class="lg:sticky lg:top-[92px] lg:h-fit">
        <div class="flex flex-col gap-6 rounded-panel border border-line bg-surface p-6 shadow-soft">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-accent">
              {{ vehicle.year }} · {{ vehicle.make }}
            </p>
            <h1 class="font-display text-2xl leading-tight text-ink">
              {{ vehicle.model }} <span class="text-ink-muted">{{ vehicle.variant }}</span>
            </h1>
          </div>

          <div class="flex items-end justify-between border-y border-line py-5">
            <div>
              <p class="text-xs text-ink-muted">{{ isMonthly && vehicle.monthlyFrom > 0 ? 'Finance from' : 'Our price' }}</p>
              <p class="font-display text-3xl text-ink">
                {{ isMonthly && vehicle.monthlyFrom > 0 ? formatCurrency(vehicle.monthlyFrom) : formatCurrency(vehicle.price) }}<span v-if="isMonthly && vehicle.monthlyFrom > 0" class="text-base text-ink-muted">/mo</span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-ink-muted">{{ isMonthly && vehicle.monthlyFrom > 0 ? 'Our price' : 'Finance from' }}</p>
              <p class="font-display text-xl text-ink">
                <template v-if="isMonthly && vehicle.monthlyFrom > 0">{{ formatCurrency(vehicle.price) }}</template>
                <template v-else>{{ formatCurrency(vehicle.monthlyFrom) }}<span class="text-sm text-ink-muted">/mo</span></template>
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-primary w-full">
              <AppIcon name="phone" :size="17" />
              Call {{ dealer.phone }}
            </a>
            <button class="btn-ghost w-full" @click="scrollToEnquiry">
              <AppIcon name="mail" :size="17" />
              Enquire online
            </button>
          </div>

          <div class="flex items-center gap-3 rounded-control bg-paper-soft px-4 py-3 text-sm text-ink-soft">
            <AppIcon name="shield" :size="18" class="text-accent" />
            Warranty &amp; nationwide delivery available
          </div>

          <!-- Regulated finance disclosure. Required wherever a monthly price
               is shown; placement is flexible, so it sits with the price. -->
          <div class="flex flex-col gap-2 border-t border-line pt-4 text-[0.7rem] leading-relaxed text-ink-muted">
            <p class="font-semibold text-ink-soft">Representative {{ REPRESENTATIVE_APR }}% APR</p>
            <p>{{ representativeExample }}</p>
            <p>{{ brokerDisclosure }}</p>
          </div>
        </div>

        <div ref="enquiryEl" class="mt-6 rounded-panel border border-line bg-surface p-6 shadow-soft">
          <h2 class="font-display text-lg text-ink">Enquire about this car</h2>
          <p class="mb-5 mt-1 text-sm text-ink-soft">
            Reserve or request more details, we’ll respond quickly.
          </p>
          <EnquiryForm :vehicle-name="`${vehicle.year} ${vehicle.make} ${vehicle.model}`" submit-label="Send enquiry" />
        </div>
      </aside>
    </div>

    <!-- similar vehicles -->
    <section v-if="similar.length" class="container mt-20">
      <div class="mb-8 flex items-end justify-between">
        <h2 class="font-display text-2xl text-ink sm:text-3xl">You may also like</h2>
        <RouterLink to="/vehicles" class="text-sm font-semibold text-ink hover:text-accent">
          View all
        </RouterLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="v in similar" :key="v.id" class="aspect-[4/3]">
          <MosaicCard :vehicle="v" />
        </div>
      </div>
    </section>
  </div>

  <!-- not found -->
  <div v-else class="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <h1 class="font-display text-3xl text-ink">Vehicle not found</h1>
    <p class="text-ink-soft">This vehicle may have been sold or moved.</p>
    <RouterLink to="/vehicles" class="btn-primary">Back to all vehicles</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getVehicleById, vehicles } from '../data/vehicles'
import {
  dealer,
  brokerDisclosure,
  representativeExample,
  REPRESENTATIVE_APR,
} from '../data/dealer'
import { formatCurrency, formatMileage } from '../composables/useVehicleFilters'
import { usePriceMode } from '../composables/usePriceMode'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'
import MosaicCard from '../components/shared/MosaicCard.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import AppIcon from '../components/shared/AppIcon.vue'

const route = useRoute()
const { priceMode } = usePriceMode()
const isMonthly = computed(() => priceMode.value === 'monthly')
const views = ['Exterior', 'Interior', 'Rear', 'Detail']
const activeView = ref(0)
const enquiryEl = ref<HTMLElement | null>(null)

const vehicle = computed(() => getVehicleById(route.params.id as string))

watch(
  () => route.params.id,
  () => {
    activeView.value = 0
  },
)

const specs = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return [
    { icon: 'calendar', label: 'Registered', value: v.registration },
    { icon: 'gauge', label: 'Mileage', value: formatMileage(v.mileage) },
    { icon: 'fuel', label: 'Fuel', value: v.fuel },
    { icon: 'gear', label: 'Gearbox', value: v.transmission },
    { icon: 'car', label: 'Body', value: v.bodyType },
    { icon: 'spark', label: 'Engine', value: v.engine },
    { icon: 'gauge', label: 'Power', value: v.power },
    { icon: 'seat', label: 'Seats', value: `${v.seats} seats · ${v.doors} doors` },
    { icon: 'key', label: 'Colour', value: v.colour },
  ]
})

const similar = computed(() => {
  const v = vehicle.value
  if (!v) return []
  return vehicles
    .filter((o) => o.id !== v.id && (o.bodyType === v.bodyType || o.make === v.make))
    .slice(0, 3)
})

async function scrollToEnquiry() {
  await nextTick()
  enquiryEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
