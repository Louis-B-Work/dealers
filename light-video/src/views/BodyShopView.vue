<template>
  <div>
    <PageHero
      title="Body Shop"
      intro="From minor scuffs to accident repairs, we’ll help restore your car’s finish."
    >
      <div class="flex flex-wrap justify-center gap-4" data-intro>
        <RouterLink :to="{ hash: '#enquire' }" class="btn-accent">
          Send an enquiry
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a
          :href="`tel:${dealer.phone.replace(/\s/g, '')}`"
          class="btn inline-flex border border-white/25 text-white hover:border-white"
        >
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHero>

    <!-- intro -->
    <section class="bg-paper py-14 md:py-16">
      <div class="container grid items-center gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <h2 class="u-display text-3xl sm:text-4xl md:text-[2.75rem]" data-reveal>
          Restore your car to its best
        </h2>
        <p class="text-ink-soft" data-reveal data-reveal-delay="100">
          Everyday driving brings scratches, scuffs and dents, even for the most careful owners.
          Tell us what’s happened and our team will advise on the right repair, whether it’s a
          quick fix or something bigger.
        </p>
      </div>
    </section>

    <!-- repairs -->
    <section class="border-y border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="Repairs we can help with" center />

        <ul class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(repair, i) in repairs"
            :key="repair.title"
            class="flex items-start gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="(i % 3) * 80"
          >
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
            >
              <AppIcon :name="repair.icon" :size="22" />
            </span>
            <div>
              <h3 class="font-display text-lg text-ink">{{ repair.title }}</h3>
              <p class="text-sm text-ink-soft">{{ repair.body }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- how it works -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading title="How it works" center />

        <ol class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="flex flex-col gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="i * 80"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
              >{{ i + 1 }}</span
            >
            <h3 class="font-display text-lg text-ink">{{ step.title }}</h3>
            <p class="text-sm text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- enquiry -->
    <section id="enquire" class="border-t border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading
          title="Enquire about a body shop repair"
          subtitle="Tell us about your car and the damage, and we’ll get back to you."
          center
        />
        <div class="mx-auto w-full max-w-3xl" data-reveal>
          <ServiceEnquiry message-label="Describe the damage" submit-label="Send enquiry" />
        </div>
      </div>
    </section>

    <SellContact />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { dealer } from '../data/dealer'
import PageHero from '../components/shared/PageHero.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import SellContact from '../components/shared/SellContact.vue'

useScrollReveal()

const repairs = [
  { icon: 'spark', title: 'Scratches and chips', body: 'Paintwork scratches and stone chips restored to a smooth finish.' },
  { icon: 'car', title: 'Bumper scuffs', body: 'Car park knocks and scrapes on bumpers repaired and refinished.' },
  { icon: 'tag', title: 'Dents', body: 'Dents and dings assessed and repaired so panels look right again.' },
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
