<template>
  <div>
    <PageHeader
      title="Arrange a conversation"
      current="Contact"
      subtitle="Ask about a car, request a private viewing or discuss finance. Preview the enquiry below."
    />

    <div class="u-gutter grid gap-14 py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:py-20">
      <div class="space-y-10">
        <dl class="divide-y divide-line border-y border-line">
          <div class="py-6">
            <dt class="field-label">Telephone</dt>
            <dd><a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="tabular font-display text-3xl hover:text-accent">{{ dealer.phone }}</a></dd>
          </div>
          <div class="py-6">
            <dt class="field-label">Email</dt>
            <dd><a :href="`mailto:${dealer.email}`" class="break-all font-display text-2xl hover:text-accent">{{ dealer.email }}</a></dd>
          </div>
          <div class="py-6">
            <dt class="field-label">The showroom</dt>
            <dd>
              <address class="not-italic leading-relaxed text-ink-soft">
                {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
                {{ dealer.address.city }}, {{ dealer.address.postcode }}
              </address>
            </dd>
          </div>
        </dl>

        <div>
          <h2 class="field-label">Opening hours</h2>
          <ul class="divide-y divide-line border-y border-line text-sm">
            <li v-for="hours in dealer.openingHours" :key="hours.day" class="flex justify-between py-3.5">
              <span class="text-ink-muted">{{ hours.day }}</span>
              <span class="tabular">{{ hours.hours }}</span>
            </li>
          </ul>
          <p class="mt-3 text-xs text-ink-muted">Placeholder details. Visits cannot be booked through this preview.</p>
        </div>

        <div class="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-panel border border-line bg-paper-soft" role="img" aria-label="Map placeholder">
          <div class="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(var(--c-line))_1px,transparent_1px),linear-gradient(90deg,rgb(var(--c-line))_1px,transparent_1px)] [background-size:44px_44px]"></div>
          <div class="relative text-center">
            <AppIcon name="pin" :size="26" class="mx-auto text-accent" />
            <p class="mt-3 font-display text-2xl">{{ dealer.address.city }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.2em] text-ink-muted">Map placeholder</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="u-h2 mb-8">Send a message</h2>
        <EnquiryForm
          :key="`${subject}-${car?.id ?? ''}`"
          :kind="subject === 'Vehicle viewing' ? 'viewing' : 'enquiry'"
          :vehicle-name="car ? `${car.year} ${car.make} ${car.model}` : ''"
          :subject="subject"
          :submit-label="subject === 'Vehicle viewing' ? 'Preview viewing request' : 'Preview enquiry'"
          :default-message="car ? `I would like to know more about the ${car.year} ${car.make} ${car.model} ${car.variant} (${formatCurrency(car.price)}).` : ''"
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
import { formatCurrency } from '../composables/useCollectionSearch'
import { subjects } from '../data/content'
import { dealer } from '../data/dealer'
import { getVehicleById } from '../data/vehicles'

const route = useRoute()
const car = computed(() => getVehicleById(String(route.query.vehicle ?? '')))
const subject = computed(() => {
  const requested = String(route.query.subject ?? '')
  if ((subjects as readonly string[]).includes(requested)) return requested
  return car.value ? 'Vehicle viewing' : 'General enquiry'
})
</script>
