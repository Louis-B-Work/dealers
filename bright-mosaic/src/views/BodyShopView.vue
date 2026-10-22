<template>
  <div class="bg-paper pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-5 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>Body Shop</h1>
        <p class="max-w-prose text-ink-soft sm:text-lg" data-intro>
          From minor scuffs to accident repairs, we’ll help restore your car’s finish.
        </p>
        <div class="flex flex-wrap gap-3" data-intro>
          <RouterLink :to="{ hash: '#enquire' }" class="btn-accent">
            Send an enquiry
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
          <a :href="telHref" class="btn-ghost">
            <AppIcon name="phone" :size="16" />
            {{ dealer.phone }}
          </a>
        </div>
      </div>
    </div>

    <!-- repairs: a bento led by one statement tile -->
    <section class="py-16 md:py-24">
      <div class="container grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col justify-between gap-6 rounded-panel bg-accent p-8 text-accent-ink md:col-span-2 lg:row-span-2" data-reveal>
          <h2 class="u-display text-3xl !text-accent-ink sm:text-4xl">Restore your car to its best</h2>
          <p class="text-accent-ink/85">
            Everyday driving brings scratches, scuffs and dents, even for the most careful owners. Tell us what’s
            happened and our team will advise on the right repair, whether it’s a quick fix or something bigger.
          </p>
        </div>

        <div
          v-for="(repair, i) in repairs"
          :key="repair.title"
          class="flex flex-col gap-3 rounded-panel border border-line bg-surface p-5 shadow-soft"
          :class="i === 1 || i === 4 ? '!bg-paper-sink' : ''"
          data-reveal
          :data-reveal-delay="i * 60"
        >
          <span class="flex h-10 w-10 items-center justify-center rounded-control bg-paper-soft text-accent">
            <AppIcon :name="repair.icon" :size="20" />
          </span>
          <h3 class="font-display text-base font-extrabold text-ink">{{ repair.title }}</h3>
          <p class="text-sm text-ink-soft">{{ repair.body }}</p>
        </div>
      </div>
    </section>

    <!-- how it works: four tiles in a row, no counters -->
    <section class="border-y border-line bg-paper-soft py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading title="How it works" center />

        <ol class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="rounded-panel p-6"
            :class="i % 2 === 0 ? 'bg-ink text-paper' : 'border border-line bg-surface text-ink shadow-soft'"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <h3 class="font-display text-lg font-extrabold">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed" :class="i % 2 === 0 ? 'text-paper/75' : 'text-ink-soft'">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- enquiry -->
    <section id="enquire" class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading
          title="Enquire about a body shop repair"
          subtitle="Tell us about your car and the damage, and we’ll get back to you."
          center
        />
        <div class="mx-auto w-full max-w-3xl" data-reveal>
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
