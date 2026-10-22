<template>
  <div class="bg-paper">
    <PageHeader
      title="Body Shop"
      subtitle="From minor scuffs to accident repairs, we’ll help restore your car’s finish."
    >
      <div class="mt-7 flex flex-wrap gap-3">
        <RouterLink :to="{ hash: '#enquire' }" class="btn-primary">
          Send an enquiry
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-on-dark">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro -->
    <section class="u-section">
      <div class="u-gutter grid items-center gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <h2 class="u-display text-[1.65rem] sm:text-[2rem] md:text-[2.35rem]">Restore your car to its best</h2>
        <p class="u-lead max-w-prose">
          Everyday driving brings scratches, scuffs and dents, even for the most careful owners. Tell us what’s
          happened and our team will advise on the right repair, whether it’s a quick fix or something bigger.
        </p>
      </div>
    </section>

    <!-- repairs -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading title="Repairs we can help with" center />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="repair in repairs" :key="repair.title" class="card flex items-start gap-4 p-5">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent">
              <AppIcon :name="repair.icon" :size="22" />
            </span>
            <div>
              <h3 class="font-display text-base font-semibold text-ink">{{ repair.title }}</h3>
              <p class="mt-1 text-sm text-ink-soft">{{ repair.body }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- how it works: a row of soft pills, no numbers -->
    <section class="u-section">
      <div class="u-gutter">
        <div class="rounded-block bg-paper-sink/70 px-6 py-12 md:px-12 md:py-14">
          <SectionHeading title="How it works" center />

          <ol class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <li v-for="step in steps" :key="step.title" class="rounded-panel bg-paper-soft p-6 shadow-card">
              <h3 class="font-display text-base font-semibold text-accent">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- enquiry -->
    <section id="enquire" class="pb-4 sm:pb-8">
      <div class="u-gutter flex flex-col gap-10">
        <SectionHeading
          title="Enquire about a body shop repair"
          subtitle="Tell us about your car and the damage, and we’ll get back to you."
          center
        />
        <div class="mx-auto w-full max-w-3xl">
          <ServiceEnquiry message-label="Describe the damage" />
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const repairs = [
  { icon: 'camera', title: 'Scratches and chips', body: 'Paintwork scratches and stone chips restored to a smooth finish.' },
  { icon: 'car', title: 'Bumper scuffs', body: 'Car park knocks and scrapes on bumpers repaired and refinished.' },
  { icon: 'door', title: 'Dents', body: 'Dents and dings assessed and repaired so panels look right again.' },
  { icon: 'gear', title: 'Kerbed alloy wheels', body: 'Scuffed and kerbed alloys refurbished to look like new.' },
  { icon: 'clock', title: 'General wear', body: 'The small marks that build up over time, put right in one visit.' },
  { icon: 'shield', title: 'Accident repair', body: 'Larger repairs after an incident, discussed with you before any work starts.' },
]

const steps = [
  { title: 'Send us the details', body: 'Tell us about your car and the damage, with photos if you can.' },
  { title: 'We review and reply', body: 'Our team looks at your request and gets back to discuss the work.' },
  { title: 'Closer inspection', body: 'We arrange a convenient time to take a proper look at the car.' },
  { title: 'Agree before we start', body: 'We confirm the details with you before any work begins.' },
]
</script>
