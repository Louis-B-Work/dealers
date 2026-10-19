<template>
  <div v-if="vehicle" class="bg-paper pb-24">
    <!-- breadcrumb -->
    <div class="border-b border-line">
      <div
        class="u-gutter flex w-full items-center gap-3 py-5 text-[0.62rem] uppercase tracking-micro text-ink-muted"
      >
        <RouterLink
          to="/vehicles"
          class="inline-flex items-center gap-2 text-ink transition-opacity duration-300 hover:opacity-60"
        >
          <AppIcon name="arrow-left" :size="13" />
          All vehicles
        </RouterLink>
        <span class="text-line">/</span>
        <span>{{ vehicle.make }} {{ vehicle.model }}</span>
      </div>
    </div>

    <div class="u-gutter grid w-full gap-12 pt-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
      <!-- Left: gallery + detail -->
      <div class="flex flex-col gap-14">
        <div class="flex flex-col gap-4">
          <VehiclePlaceholder
            :badge="vehicle.badge"
            :image="vehicle.image"
            :label="`${vehicle.make} ${vehicle.model}, ${views[activeView]}`"
            :silhouette-size="170"
            class="aspect-[16/10] w-full border border-line"
          >
            <span
              class="absolute bottom-0 right-0 border-l border-t border-line bg-paper px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-micro text-ink"
            >
              {{ views[activeView] }}
            </span>
          </VehiclePlaceholder>

          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="(view, i) in views"
              :key="view"
              type="button"
              class="overflow-hidden border transition duration-300 ease-premium"
              :class="i === activeView ? 'border-ink' : 'border-line opacity-50 hover:opacity-100'"
              :aria-label="`Show ${view.toLowerCase()} view`"
              :aria-pressed="i === activeView"
              @click="activeView = i"
            >
              <VehiclePlaceholder
                :image="vehicle.image"
                :label="view"
                :silhouette-size="42"
                class="aspect-[4/3] w-full"
              />
            </button>
          </div>
        </div>

        <!-- Specification, set as a label/value table in the same voice as the
             card's spec rows rather than as a grid of icon tiles. -->
        <section>
          <h2 class="u-eyebrow">At a glance</h2>
          <dl class="mt-7 grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
            <div
              v-for="spec in specs"
              :key="spec.label"
              class="spec-row border-b border-line py-4"
            >
              <dt class="spec-label w-[6.5rem]">{{ spec.label }}:</dt>
              <dd class="spec-value">{{ spec.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="flex flex-col gap-6">
          <h2 class="u-eyebrow">About this {{ vehicle.model }}</h2>
          <p class="max-w-prose text-base leading-relaxed text-ink-soft">
            {{ vehicle.description }}
          </p>
        </section>

        <section class="flex flex-col gap-6">
          <h2 class="u-eyebrow">Specification &amp; features</h2>
          <ul class="grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
            <li
              v-for="feature in vehicle.features"
              :key="feature"
              class="flex items-center gap-3.5 border-b border-line py-3.5 text-sm text-ink-soft"
            >
              <AppIcon name="check" :size="14" class="shrink-0 text-ink" />
              {{ feature }}
            </li>
          </ul>
        </section>
      </div>

      <!-- Right: sticky purchase panel -->
      <aside class="lg:sticky lg:top-[calc(var(--nav-h-scrolled)+2rem)] lg:h-fit">
        <div class="flex flex-col border border-line">
          <div class="flex flex-col gap-3 p-6">
            <p class="text-[0.6rem] uppercase tracking-micro text-ink-muted">
              {{ vehicle.year }} · {{ vehicle.make }}
            </p>
            <h1 class="u-display-caps text-base sm:text-lg">
              {{ vehicle.model }} <span class="text-ink-muted">{{ vehicle.variant }}</span>
            </h1>
          </div>

          <div class="grid grid-cols-2 gap-px border-y border-line bg-line">
            <div class="flex flex-col gap-2 bg-paper p-6">
              <span class="price-label">Our price</span>
              <span class="font-display text-[1.7rem] leading-none tabular-nums">
                {{ formatCurrency(vehicle.price) }}
              </span>
            </div>
            <div class="flex flex-col gap-2 bg-paper p-6">
              <span class="price-label">Finance from</span>
              <span class="font-display text-[1.7rem] leading-none tabular-nums">
                {{ formatCurrency(vehicle.monthlyFrom)
                }}<span class="text-sm text-ink-muted">/mo</span>
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-4 p-6">
            <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-primary w-full">
              <AppIcon name="phone" :size="15" />
              Call {{ dealer.phone }}
            </a>
            <button class="btn-ghost w-full" @click="scrollToEnquiry">
              <AppIcon name="mail" :size="15" />
              Enquire online
            </button>
          </div>

          <p class="flex items-center gap-3.5 border-t border-line px-6 py-4 text-sm text-ink-soft">
            <AppIcon name="shield" :size="16" class="shrink-0 text-ink" />
            Warranty &amp; nationwide delivery available
          </p>

          <!-- Regulated finance disclosure. Required wherever a monthly price
               is shown; placement is flexible, so it sits with the price. -->
          <div
            class="flex flex-col gap-2.5 border-t border-line px-6 py-5 text-[0.66rem] leading-relaxed text-ink-muted"
          >
            <p class="font-medium uppercase tracking-micro text-ink">
              Representative {{ REPRESENTATIVE_APR }}% APR
            </p>
            <p>{{ representativeExample }}</p>
            <p>{{ brokerDisclosure }} Finance is subject to status.</p>
          </div>
        </div>

        <div ref="enquiryEl" class="mt-6 border border-line p-6">
          <h2 class="u-display-caps text-sm">Enquire about this car</h2>
          <p class="mb-6 mt-2 text-sm text-ink-soft">
            Reserve or request more details, we’ll respond quickly.
          </p>
          <EnquiryForm
            :vehicle-name="`${vehicle.year} ${vehicle.make} ${vehicle.model}`"
            submit-label="Send enquiry"
          />
        </div>
      </aside>
    </div>

    <!-- similar vehicles -->
    <section v-if="similar.length" class="u-gutter mt-24 w-full">
      <div class="flex items-end justify-between gap-6 border-t border-line pt-12">
        <div class="flex flex-col gap-5">
          <span class="u-eyebrow">Also in stock</span>
          <h2 class="u-display-caps text-lg sm:text-xl">You may also like</h2>
        </div>
        <RouterLink to="/vehicles" class="link-rule hidden shrink-0 sm:inline-flex">
          View all
        </RouterLink>
      </div>
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <VehicleCard v-for="v in similar" :key="v.id" :vehicle="v" />
      </div>
    </section>
  </div>

  <!-- not found -->
  <div v-else class="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
    <h1 class="u-display-caps text-2xl">Vehicle not found</h1>
    <p class="text-sm text-ink-soft">This vehicle may have been sold or moved.</p>
    <RouterLink to="/vehicles" class="btn-primary mt-2">Back to all vehicles</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getVehicleById, vehicles } from '../data/vehicles'
import { dealer, brokerDisclosure, representativeExample, REPRESENTATIVE_APR } from '../data/dealer'
import { formatCurrency, formatMileage } from '../composables/useVehicleFilters'
import VehiclePlaceholder from '../components/shared/VehiclePlaceholder.vue'
import VehicleCard from '../components/shared/VehicleCard.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import AppIcon from '../components/shared/AppIcon.vue'

const route = useRoute()
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
    { label: 'Registered', value: v.registration },
    { label: 'Mileage', value: formatMileage(v.mileage) },
    { label: 'Colour', value: v.colour },
    { label: 'Fuel', value: v.fuel },
    { label: 'Gearbox', value: v.transmission },
    { label: 'Body', value: v.bodyType },
    { label: 'Engine', value: v.engine },
    { label: 'Power', value: v.power },
    { label: 'Seats', value: `${v.seats} seats · ${v.doors} doors` },
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

<style scoped>
.price-label {
  @apply text-[0.58rem] font-medium uppercase tracking-micro text-ink-muted;
}
</style>
