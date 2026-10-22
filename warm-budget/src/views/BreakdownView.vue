<template>
  <div class="bg-paper">
    <PageHeader
      wide
      title="Breakdown"
      subtitle="Help when you need it most. If you’ve broken down, talk to our team about your next steps."
    >
      <div class="mt-7 flex flex-wrap gap-3">
        <a :href="telHref" class="btn-primary">
          <AppIcon name="phone" :size="16" />
          Call {{ dealer.phone }}
        </a>
        <RouterLink to="/contact" class="btn-on-dark">Ask our team</RouterLink>
      </div>
    </PageHeader>

    <!-- safety note: the template's warm highlight, never the accent teal -->
    <section class="pt-10 sm:pt-12">
      <div class="u-gutter-wide">
        <div class="flex items-start gap-4 rounded-panel bg-highlight-wash p-5 md:p-6" role="note">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-highlight-ink">
            <AppIcon name="shield" :size="22" />
          </span>
          <p class="text-highlight-ink">
            <span class="block font-display font-semibold">In immediate danger or an unsafe place?</span>
            Call the emergency services first. Our number is for non-urgent help.
          </p>
        </div>
      </div>
    </section>

    <!-- intro -->
    <section class="u-section">
      <div class="u-gutter-wide grid items-center gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <h2 class="u-display text-[1.65rem] sm:text-[2rem] md:text-[2.35rem]">Broken down? We’re here to help</h2>
        <p class="u-lead max-w-prose">
          You don’t have to work out your next steps alone. If your car has a fault or won’t start, our team will
          advise on recovery and what to do next.
        </p>
      </div>
    </section>

    <!-- on the road -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter-wide flex flex-col gap-10">
        <SectionHeading
          title="If you break down on the road"
          subtitle="Where it’s safe to do so, follow these steps before you contact us."
          center
        />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="tip in safety" :key="tip.title" class="card flex flex-col gap-4 p-6">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-accent-wash text-accent">
              <AppIcon :name="tip.icon" :size="22" />
            </span>
            <h3 class="font-display text-base font-semibold text-ink">{{ tip.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ tip.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- what happens next -->
    <section class="u-section">
      <div class="u-gutter-wide">
        <div class="rounded-block bg-paper-sink/70 px-6 py-12 md:px-12 md:py-14">
          <SectionHeading
            title="What happens next"
            subtitle="We’ll always confirm the details with you before anything goes ahead."
            center
          />

          <ol class="mt-10 grid gap-4 md:grid-cols-3">
            <li v-for="step in steps" :key="step.title" class="rounded-panel bg-paper-soft p-6 shadow-card">
              <h3 class="font-display text-base font-semibold text-accent">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- invitation -->
    <section class="pb-4 sm:pb-8">
      <div class="u-gutter-wide">
        <div class="rounded-block bg-paper-dark px-6 py-12 text-ink-inverse sm:px-12 md:py-16">
          <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
            <h2 class="u-display text-[1.65rem] !text-ink-inverse sm:text-[2rem] md:text-[2.35rem]">Need a hand?</h2>
            <p class="mt-3 max-w-xl text-ink-inverse/75">
              Call us during opening hours, or send a message and we’ll get back to you.
            </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a :href="telHref" class="btn-primary">
                <AppIcon name="phone" :size="16" />
                Call {{ dealer.phone }}
              </a>
              <RouterLink to="/contact" class="btn-on-dark">Ask our team</RouterLink>
            </div>
          </div>
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
import ContactPanel from '../components/shared/ContactPanel.vue'

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const safety = [
  { icon: 'car', title: 'Move off the road', body: 'Where it’s safe, move your vehicle off the carriageway, away from traffic.' },
  { icon: 'gauge', title: 'Hazard lights on', body: 'Switch on your hazard lights so other drivers can see you.' },
  { icon: 'pin', title: 'Get to safety', body: 'On a motorway, leave by the left-hand door and wait behind the barrier, away from traffic.' },
  { icon: 'phone', title: 'Then contact us', body: 'Once you’re safe, call us and we’ll take it from there.' },
]

const steps = [
  { title: 'We take the details', body: 'Tell us about your car and what’s gone wrong.' },
  { title: 'We point you onwards', body: 'We’ll direct you to recovery, an inspection booking or repair advice.' },
  { title: 'You confirm first', body: 'Nothing goes ahead until we’ve agreed the details with you.' },
]
</script>
