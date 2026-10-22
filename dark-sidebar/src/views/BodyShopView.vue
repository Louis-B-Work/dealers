<template>
  <div class="bg-paper">
    <PageHeader
      title="Body Shop"
      subtitle="From minor scuffs to accident repairs, we’ll help restore your car’s finish."
    >
      <div class="flex flex-wrap gap-3 pt-2">
        <RouterLink :to="{ hash: '#enquire' }" class="btn-primary">
          Send an enquiry
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
        <a :href="telHref" class="btn-ghost">
          <AppIcon name="phone" :size="16" />
          {{ dealer.phone }}
        </a>
      </div>
    </PageHeader>

    <!-- intro -->
    <section class="border-b border-line">
      <div class="u-gutter grid w-full items-center gap-8 py-14 md:py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="u-display text-[2.1rem] sm:text-[2.6rem]" data-reveal>Restore your car to its best</h2>
        <p class="text-ink-soft" data-reveal data-reveal-delay="100">
          Everyday driving brings scratches, scuffs and dents, even for the most careful owners.
          Tell us what’s happened and our team will advise on the right repair, whether it’s a
          quick fix or something bigger.
        </p>
      </div>
    </section>

    <!-- repairs: a single ruled grid -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading title="Repairs we can help with" />

        <ul class="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3" data-reveal>
          <li v-for="repair in repairs" :key="repair.title" class="flex flex-col gap-3 bg-paper-soft p-6 md:p-8">
            <AppIcon :name="repair.icon" :size="22" class="text-accent" />
            <h3 class="font-display text-xl text-ink">{{ repair.title }}</h3>
            <p class="text-sm text-ink-soft">{{ repair.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- how it works: horizontal rule steps, no numbers -->
    <section class="bg-paper py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading title="How it works" />

        <ol class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="flex flex-col gap-3 border-t border-accent/60 pt-5"
            data-reveal
            :data-reveal-delay="i * 80"
          >
            <h3 class="font-display text-xl text-ink">{{ step.title }}</h3>
            <p class="text-sm text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- enquiry -->
    <section id="enquire" class="u-rule bg-paper-soft py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div class="flex flex-col gap-6">
          <SectionHeading
            title="Enquire about a body shop repair"
            subtitle="Tell us about your car and the damage, and we’ll get back to you."
          />
          <p class="max-w-prose text-sm text-ink-muted" data-reveal data-reveal-delay="120">
            Photos help, so mention them in your message and we’ll tell you how to send them.
          </p>
        </div>
        <div data-reveal>
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
