<template>
  <div v-if="vehicle" class="bg-paper pb-24">
    <!-- breadcrumb -->
    <div class="border-b border-line bg-paper-soft">
      <div class="u-gutter flex w-full items-center gap-2.5 py-5 text-xs uppercase tracking-micro text-ink-muted">
        <RouterLink to="/vehicles" class="inline-flex items-center gap-2 transition hover:text-accent">
          <AppIcon name="arrow-left" :size="14" />
          All vehicles
        </RouterLink>
        <span class="text-line">/</span>
        <span class="text-ink-soft">{{ vehicle.make }} {{ vehicle.model }}</span>
      </div>
    </div>

    <div class="u-gutter grid w-full gap-10 pt-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      <!-- Left: gallery + detail -->
      <div class="flex flex-col gap-12">
        <div class="flex flex-col gap-3">
          <VehiclePlaceholder
            :gradient="vehicle.gradient"
            :badge="vehicle.badge"
            :image="vehicle.image"
            :label="`${vehicle.make} ${vehicle.model}, ${views[activeView]}`"
            :silhouette-size="170"
            class="aspect-[16/10] w-full border border-line"
          >
            <span
              class="absolute bottom-0 right-0 border-l border-t border-line bg-paper/85 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-micro text-ink-soft backdrop-blur-sm"
            >
              {{ views[activeView] }}
            </span>
          </VehiclePlaceholder>

          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="(view, i) in views"
              :key="view"
              type="button"
              class="overflow-hidden border transition duration-300 ease-premium"
              :class="i === activeView ? 'border-accent' : 'border-line opacity-60 hover:opacity-100'"
              :aria-label="`Show ${view.toLowerCase()} view`"
              :aria-pressed="i === activeView"
              @click="activeView = i"
            >
              <VehiclePlaceholder
                :gradient="vehicle.gradient"
                :image="vehicle.image"
                :label="view"
                :silhouette-size="42"
                class="aspect-[4/3] w-full"
              />
            </button>
          </div>
        </div>

        <!-- overview specs -->
        <section>
          <div class="pb-6">
            <h2 class="u-eyebrow">At a glance</h2>
          </div>
          <dl class="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
            <div
              v-for="spec in specs"
              :key="spec.label"
              class="flex items-center gap-3 border-b border-r border-line p-4"
            >
              <AppIcon :name="spec.icon" :size="18" class="shrink-0 text-accent" />
              <div class="min-w-0">
                <dt class="text-[0.55rem] font-semibold uppercase tracking-micro text-ink-muted">
                  {{ spec.label }}
                </dt>
                <dd class="truncate text-sm text-ink">{{ spec.value }}</dd>
              </div>
            </div>
          </dl>
        </section>

        <!-- description -->
        <section class="flex flex-col gap-5">
          <div>
            <h2 class="u-eyebrow">About this {{ vehicle.model }}</h2>
          </div>
          <p class="max-w-prose text-lg leading-relaxed text-ink-soft">{{ vehicle.description }}</p>
        </section>

        <!-- features -->
        <section class="flex flex-col gap-5">
          <div>
            <h2 class="u-eyebrow">Specification &amp; features</h2>
          </div>
          <ul class="grid border-t border-line sm:grid-cols-2">
            <li
              v-for="feature in vehicle.features"
              :key="feature"
              class="flex items-center gap-3 border-b border-line py-3.5 text-sm text-ink-soft sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
            >
              <AppIcon name="check" :size="15" class="shrink-0 text-accent" />
              {{ feature }}
            </li>
          </ul>
        </section>
      </div>

      <!-- Right: sticky purchase panel -->
      <aside class="lg:sticky lg:top-8 lg:h-fit">
        <div class="panel flex flex-col">
          <div class="flex flex-col gap-2 p-6">
            <p class="text-[0.6rem] font-semibold uppercase tracking-micro text-ink-muted">
              {{ vehicle.year }} · {{ vehicle.make }}
            </p>
            <h1 class="font-display text-[1.8rem] leading-tight text-ink">
              {{ vehicle.model }} <span class="text-ink-muted">{{ vehicle.variant }}</span>
            </h1>
          </div>

          <div class="grid grid-cols-2 divide-x divide-line border-y border-line">
            <div class="flex flex-col gap-1.5 p-6">
              <span class="price-label">Our price</span>
              <span class="font-display text-[2rem] leading-none text-ink">
                {{ formatCurrency(vehicle.price) }}
              </span>
            </div>
            <div class="flex flex-col gap-1.5 p-6">
              <span class="price-label">Finance from</span>
              <span class="font-display text-[2rem] leading-none text-accent">
                {{ formatCurrency(vehicle.monthlyFrom)
                }}<span class="font-sans text-sm text-ink-muted">/mo</span>
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-3 p-6">
            <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-primary w-full">
              <AppIcon name="phone" :size="16" />
              Call {{ dealer.phone }}
            </a>
            <button class="btn-ghost w-full" @click="scrollToEnquiry">
              <AppIcon name="mail" :size="16" />
              Enquire online
            </button>
          </div>

          <p class="flex items-center gap-3 border-t border-line px-6 py-4 text-sm text-ink-soft">
            <AppIcon name="shield" :size="17" class="shrink-0 text-accent" />
            Warranty &amp; nationwide delivery available
          </p>

          <!-- Regulated finance disclosure. Required wherever a monthly price
               is shown; placement is flexible, so it sits with the price. -->
          <div
            class="flex flex-col gap-2 border-t border-line px-6 py-5 text-[0.68rem] leading-relaxed text-ink-muted"
          >
            <p class="font-semibold uppercase tracking-micro text-ink-soft">
              Representative {{ REPRESENTATIVE_APR }}% APR
            </p>
            <p>{{ representativeExample }}</p>
            <p>{{ brokerDisclosure }} Finance is subject to status.</p>
          </div>
        </div>

        <div ref="enquiryEl" class="panel mt-5 p-6">
          <h2 class="font-display text-xl text-ink">Enquire about this car</h2>
          <p class="mb-6 mt-1 text-sm text-ink-soft">
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
    <section v-if="similar.length" class="u-gutter mt-20 w-full">
      <div class="flex items-end justify-between gap-6 border-t border-line pt-10">
        <div class="flex flex-col gap-4">
          <div>
            <span class="u-eyebrow">Also in stock</span>
          </div>
          <h2 class="u-display text-[2rem] sm:text-[2.4rem]">You may also like</h2>
        </div>
        <RouterLink
          to="/vehicles"
          class="hidden shrink-0 border-b border-line pb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-ink-soft transition hover:border-accent hover:text-accent sm:block"
        >
          View all
        </RouterLink>
      </div>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <VehicleCard v-for="v in similar" :key="v.id" :vehicle="v" />
      </div>
    </section>
  </div>

  <!-- not found -->
  <div v-else class="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
    <h1 class="u-display text-4xl">Vehicle not found</h1>
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

<style scoped>
.price-label {
  @apply text-[0.55rem] font-semibold uppercase tracking-micro text-ink-muted;
}
</style>
