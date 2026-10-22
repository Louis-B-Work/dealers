<template>
  <div>
    <PageHero
      title="Breakdown"
      intro="Help when you need it most. If you’ve broken down, talk to our team about your next steps."
    >
      <div class="flex flex-wrap justify-center gap-4" data-intro>
        <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-accent">
          <AppIcon name="phone" :size="16" />
          Call {{ dealer.phone }}
        </a>
        <RouterLink
          to="/contact"
          class="btn inline-flex border border-white/25 text-white hover:border-white"
        >
          Ask our team
        </RouterLink>
      </div>
    </PageHero>

    <!-- safety note -->
    <section class="bg-paper pt-14 md:pt-16">
      <div class="container">
        <div
          class="mx-auto flex max-w-4xl items-start gap-4 rounded-panel border border-accent bg-paper-soft p-6"
          role="note"
          data-reveal
        >
          <AppIcon name="shield" :size="22" class="mt-0.5 shrink-0 text-accent" />
          <p class="text-ink-soft">
            <span class="font-semibold text-ink">In immediate danger or an unsafe place?</span>
            Call the emergency services first. Our number is for non-urgent help.
          </p>
        </div>
      </div>
    </section>

    <!-- intro -->
    <section class="bg-paper py-14 md:py-16">
      <div class="container grid items-center gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <h2 class="u-display text-3xl sm:text-4xl md:text-[2.75rem]" data-reveal>
          Broken down? We’re here to help
        </h2>
        <p class="text-ink-soft" data-reveal data-reveal-delay="100">
          You don’t have to work out your next steps alone. If your car has a fault or won’t start,
          our team will advise on recovery and what to do next.
        </p>
      </div>
    </section>

    <!-- on the road -->
    <section class="border-y border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading
          title="If you break down on the road"
          subtitle="Where it’s safe to do so, follow these steps before you contact us."
          center
        />

        <ol class="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
          <li
            v-for="(tip, i) in safety"
            :key="tip.title"
            class="flex items-start gap-4 rounded-panel border border-line bg-white p-6 shadow-soft"
            data-reveal
            :data-reveal-delay="(i % 2) * 80"
          >
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-paper-soft text-accent"
            >
              <AppIcon :name="tip.icon" :size="22" />
            </span>
            <div>
              <h3 class="font-display text-lg text-ink">{{ tip.title }}</h3>
              <p class="text-sm text-ink-soft">{{ tip.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- what happens next -->
    <section class="bg-paper py-20 md:py-28">
      <div class="container flex flex-col gap-12">
        <SectionHeading
          title="What happens next"
          subtitle="We’ll always confirm the details with you before anything goes ahead."
          center
        />

        <ol class="grid gap-6 md:grid-cols-3">
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

    <!-- cta -->
    <section class="border-t border-line bg-paper-soft py-20 md:py-28">
      <div class="container flex flex-col items-center gap-6 text-center">
        <SectionHeading
          title="Need a hand?"
          subtitle="Call us during opening hours, or send a message and we’ll get back to you."
          center
        />
        <div class="flex flex-wrap justify-center gap-4" data-reveal data-reveal-delay="120">
          <a :href="`tel:${dealer.phone.replace(/\s/g, '')}`" class="btn-accent">
            <AppIcon name="phone" :size="16" />
            Call {{ dealer.phone }}
          </a>
          <RouterLink to="/contact" class="btn-ghost">Ask our team</RouterLink>
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
import SellContact from '../components/shared/SellContact.vue'

useScrollReveal()

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
