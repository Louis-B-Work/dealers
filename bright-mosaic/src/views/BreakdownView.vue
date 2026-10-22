<template>
  <div class="bg-paper pt-[84px]">
    <!-- header -->
    <div class="border-b border-line bg-paper-soft">
      <div class="container flex flex-col gap-5 py-12 md:py-16">
        <h1 class="u-display text-3xl sm:text-4xl md:text-5xl" data-intro>Breakdown</h1>
        <p class="max-w-prose text-ink-soft sm:text-lg" data-intro>
          Help when you need it most. If you’ve broken down, talk to our team about your next steps.
        </p>
        <div class="flex flex-wrap gap-3" data-intro>
          <a :href="telHref" class="btn-accent">
            <AppIcon name="phone" :size="16" />
            Call {{ dealer.phone }}
          </a>
          <RouterLink to="/contact" class="btn-ghost">Ask our team</RouterLink>
        </div>
      </div>
    </div>

    <!-- safety note + intro: two tiles -->
    <section class="pt-8 md:pt-10">
      <div class="container grid gap-4 lg:grid-cols-2">
        <div class="flex items-start gap-4 rounded-panel border-2 border-ink bg-surface p-6" role="note" data-reveal>
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-ink text-paper">
            <AppIcon name="shield" :size="22" />
          </span>
          <p class="text-ink-soft">
            <span class="block font-display font-extrabold text-ink">In immediate danger or an unsafe place?</span>
            Call the emergency services first. Our number is for non-urgent help.
          </p>
        </div>
        <div class="rounded-panel bg-accent p-6 text-accent-ink" data-reveal data-reveal-delay="80">
          <h2 class="font-display text-xl font-extrabold">Broken down? We’re here to help</h2>
          <p class="mt-2 text-accent-ink/85">
            You don’t have to work out your next steps alone. If your car has a fault or won’t start, our team will
            advise on recovery and what to do next.
          </p>
        </div>
      </div>
    </section>

    <!-- on the road -->
    <section class="py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading
          title="If you break down on the road"
          subtitle="Where it’s safe to do so, follow these steps before you contact us."
          center
        />

        <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(tip, i) in safety"
            :key="tip.title"
            class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 shadow-soft"
            :class="i === 3 ? '!border-transparent !bg-ink !text-paper' : ''"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-control"
              :class="i === 3 ? 'bg-white/15 text-paper' : 'bg-paper-sink text-accent'"
            >
              <AppIcon :name="tip.icon" :size="22" />
            </span>
            <h3 class="font-display text-base font-extrabold" :class="i === 3 ? 'text-paper' : 'text-ink'">{{ tip.title }}</h3>
            <p class="text-sm leading-relaxed" :class="i === 3 ? 'text-paper/75' : 'text-ink-soft'">{{ tip.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- what happens next -->
    <section class="border-y border-line bg-paper-soft py-16 md:py-24">
      <div class="container flex flex-col gap-10">
        <SectionHeading
          title="What happens next"
          subtitle="We’ll always confirm the details with you before anything goes ahead."
          center
        />

        <ol class="grid gap-4 md:grid-cols-3">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="rounded-panel border border-line bg-surface p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <h3 class="font-display text-lg font-extrabold text-accent">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- invitation -->
    <section class="py-16 md:py-24">
      <div class="container">
        <div class="flex flex-col items-start justify-between gap-8 rounded-panel bg-ink p-8 text-paper md:flex-row md:items-center md:p-12" data-reveal>
          <div class="max-w-xl">
            <h2 class="u-display text-3xl !text-paper sm:text-4xl">Need a hand?</h2>
            <p class="mt-3 text-paper/75">Call us during opening hours, or send a message and we’ll get back to you.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a :href="telHref" class="btn-accent">
              <AppIcon name="phone" :size="16" />
              Call {{ dealer.phone }}
            </a>
            <RouterLink to="/contact" class="btn bg-paper/10 text-paper hover:bg-paper/20">Ask our team</RouterLink>
          </div>
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
import ContactPanel from '../components/shared/ContactPanel.vue'

useScrollReveal()

const telHref = computed(() => `tel:${dealer.phone.replace(/\s/g, '')}`)

const safety = [
  { icon: 'car', title: 'Move off the road', body: 'Where it’s safe, move your vehicle off the carriageway, away from traffic.' },
  { icon: 'spark', title: 'Hazard lights on', body: 'Switch on your hazard lights so other drivers can see you.' },
  { icon: 'pin', title: 'Get to safety', body: 'On a motorway, leave by the left-hand door and wait behind the barrier, away from traffic.' },
  { icon: 'phone', title: 'Then contact us', body: 'Once you’re safe, call us and we’ll take it from there.' },
]

const steps = [
  { title: 'We take the details', body: 'Tell us about your car and what’s gone wrong.' },
  { title: 'We point you onwards', body: 'We’ll direct you to recovery, an inspection booking or repair advice.' },
  { title: 'You confirm first', body: 'Nothing goes ahead until we’ve agreed the details with you.' },
]
</script>
