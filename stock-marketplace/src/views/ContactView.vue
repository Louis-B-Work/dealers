<template>
  <div>
    <PageHeader
      title="Get in touch"
      current="Contact"
      eyebrow="Contact"
      subtitle="A question about a car, a viewing or finance? Preview the enquiry flow below."
    />

    <div class="u-gutter grid gap-8 py-10 lg:grid-cols-[1fr_1.1fr]">
      <div class="grid content-start gap-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="panel flex items-center gap-4 p-5 transition hover:border-ink">
            <AppIcon name="phone" :size="20" class="text-accent" />
            <div>
              <p class="text-xs text-ink-muted">Call us</p>
              <p class="tabular font-semibold">{{ dealer.phone }}</p>
            </div>
          </a>
          <a :href="`mailto:${dealer.email}`" class="panel flex items-center gap-4 p-5 transition hover:border-ink">
            <AppIcon name="mail" :size="20" class="shrink-0 text-accent" />
            <div class="min-w-0">
              <p class="text-xs text-ink-muted">Email us</p>
              <p class="truncate font-semibold">{{ dealer.email }}</p>
            </div>
          </a>
        </div>

        <div class="panel p-5">
          <div class="flex items-start gap-3">
            <AppIcon name="pin" :size="20" class="mt-0.5 shrink-0 text-accent" />
            <address class="text-sm not-italic">
              <p class="font-semibold">Visit the showroom</p>
              <p class="mt-1 text-ink-soft">
                {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
                {{ dealer.address.city }}, {{ dealer.address.postcode }}
              </p>
            </address>
          </div>
          <h2 class="mt-5 flex items-center gap-2 text-sm font-semibold">
            <AppIcon name="clock" :size="16" class="text-accent" /> Opening hours
          </h2>
          <ul class="mt-2 divide-y divide-line border-y border-line text-sm">
            <li v-for="hours in dealer.openingHours" :key="hours.day" class="flex justify-between py-2.5">
              <span class="text-ink-muted">{{ hours.day }}</span>
              <span class="tabular">{{ hours.hours }}</span>
            </li>
          </ul>
          <p class="mt-3 text-xs text-ink-muted">Placeholder details. Visits cannot be booked in this demo.</p>
        </div>

        <div
          class="flex aspect-[16/9] items-center justify-center rounded-panel border border-line bg-paper-soft text-center text-ink-muted"
          role="img"
          aria-label="Map placeholder"
        >
          <div>
            <AppIcon name="pin" :size="28" class="mx-auto text-accent" />
            <p class="mt-2 text-sm font-medium text-ink">{{ dealer.address.city }}</p>
            <p class="text-xs">Map placeholder</p>
          </div>
        </div>
      </div>

      <div class="panel p-6 sm:p-8">
        <h2 class="u-h2 mb-6">Send us a message</h2>
        <EnquiryForm
          :key="`${subject}-${car?.id ?? ''}`"
          :vehicle-name="car ? `${car.year} ${car.make} ${car.model}` : ''"
          :subject="subject"
          :default-message="car ? `I would like to know more about the ${car.year} ${car.make} ${car.model}, ${car.variant} (${formatCurrency(car.price)}).` : ''"
          message-placeholder="How can we help?"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import EnquiryForm from '../components/shared/EnquiryForm.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { formatCurrency } from '../composables/useStockSearch'
import { subjects } from '../data/content'
import { dealer } from '../data/dealer'
import { getVehicleById } from '../data/vehicles'

const route = useRoute()
const car = computed(() => getVehicleById(String(route.query.vehicle ?? '')))
const subject = computed(() => {
  const requested = String(route.query.subject ?? '')
  const known = (subjects as readonly string[]).includes(requested)
  return known ? requested : car.value ? 'Vehicle viewing' : 'General enquiry'
})
</script>
