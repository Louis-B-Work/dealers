<template>
  <div class="bg-paper">
    <PageHeader
      title="Body Shop"
      subtitle="From minor scuffs to accident repairs, we’ll help restore your car’s finish."
    >
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <RouterLink :to="{ hash: '#enquire' }" class="btn-primary">
          Send an enquiry
          <AppIcon name="arrow" :size="14" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="14" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro: a single statement -->
    <section class="py-24 md:py-32">
      <div class="u-gutter w-full">
        <p
          class="u-display mx-auto max-w-4xl text-center text-[1.5rem] leading-[1.4] sm:text-[1.9rem] md:text-[2.2rem]"
          data-reveal
        >
          Everyday driving brings scratches, scuffs and dents. Tell us what has happened and we will advise on
          the right repair.
        </p>
      </div>
    </section>

    <!-- repairs: cells on a ruled grid -->
    <section class="border-t border-line py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading title="Repairs we can help with" center />

        <ul class="grid border-t border-ink md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(repair, i) in repairs"
            :key="repair.title"
            class="repair flex flex-col gap-3 border-b border-line px-0 py-10 md:px-10"
            data-reveal
            :data-reveal-delay="(i % 3) * 80"
          >
            <h3 class="u-display-caps text-[0.82rem]">{{ repair.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft sm:text-base">{{ repair.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- process: four columns beneath a single drawn rule, no counters -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading title="How it works" center />

        <ol class="grid gap-10 border-t border-ink pt-10 md:grid-cols-2 lg:grid-cols-4">
          <li v-for="(step, i) in steps" :key="step.title" class="flex flex-col gap-3" data-reveal :data-reveal-delay="i * 80">
            <h3 class="u-display text-xl">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- enquiry -->
    <section id="enquire" class="py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading
          title="Enquire about a body shop repair"
          subtitle="Tell us about your car and the damage, and we’ll get back to you."
          center
        />
        <div class="mx-auto w-full max-w-4xl" data-reveal>
          <ServiceEnquiry message-label="Describe the damage" />
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { dealer } from '../data/dealer'
import PageHeader from '../components/shared/PageHeader.vue'
import SectionHeading from '../components/shared/SectionHeading.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import ServiceEnquiry from '../components/shared/ServiceEnquiry.vue'
import ContactPanel from '../components/shared/ContactPanel.vue'

useScrollReveal()

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const repairs = [
  { title: 'Scratches and chips', body: 'Paintwork scratches and stone chips restored to a smooth finish.' },
  { title: 'Bumper scuffs', body: 'Car park knocks and scrapes on bumpers repaired and refinished.' },
  { title: 'Dents', body: 'Dents and dings assessed and repaired so panels look right again.' },
  { title: 'Kerbed alloy wheels', body: 'Scuffed and kerbed alloys refurbished to look like new.' },
  { title: 'General wear', body: 'The small marks that build up over time, put right in one visit.' },
  { title: 'Accident repair', body: 'Larger repairs after an incident, discussed with you before any work starts.' },
]

const steps = [
  { title: 'Send us the details', body: 'Tell us about your car and the damage, with photos if you can.' },
  { title: 'We review and reply', body: 'Our team looks at your request and gets back to discuss the work.' },
  { title: 'Closer inspection', body: 'We arrange a convenient time to take a proper look at the car.' },
  { title: 'Agree before we start', body: 'We confirm the details with you before any work begins.' },
]
</script>

<style scoped>
/* Vertical rules between the grid cells on wider screens only. */
@media (min-width: 768px) {
  .repair:nth-child(odd) {
    @apply border-r border-line;
  }
}
@media (min-width: 1024px) {
  .repair:nth-child(odd) {
    @apply border-r-0;
  }
  .repair:not(:nth-child(3n)) {
    @apply border-r border-line;
  }
}
</style>
