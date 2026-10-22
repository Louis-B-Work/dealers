<template>
  <div class="bg-paper">
    <PageHeader
      title="Breakdown"
      subtitle="Help when you need it most. If you’ve broken down, talk to our team about your next steps."
    >
      <div class="flex flex-wrap gap-3 pt-2">
        <a :href="telHref" class="btn-primary">
          <AppIcon name="phone" :size="16" />
          Call {{ dealer.phone }}
        </a>
        <RouterLink to="/contact" class="btn-ghost">Ask our team</RouterLink>
      </div>
    </PageHeader>

    <!-- safety note -->
    <section class="u-gutter w-full pt-12">
      <div class="panel flex items-start gap-4 border-accent/60 p-6" role="note" data-reveal>
        <AppIcon name="shield" :size="22" class="mt-0.5 shrink-0 text-accent" />
        <p class="text-ink-soft">
          <span class="font-semibold text-ink">In immediate danger or an unsafe place?</span>
          Call the emergency services first. Our number is for non-urgent help.
        </p>
      </div>
    </section>

    <!-- intro -->
    <section class="border-b border-line">
      <div class="u-gutter grid w-full items-center gap-8 py-14 md:py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 class="u-display text-[2.1rem] sm:text-[2.6rem]" data-reveal>Broken down? We’re here to help</h2>
        <p class="text-ink-soft" data-reveal data-reveal-delay="100">
          You don’t have to work out your next steps alone. If your car has a fault or won’t start,
          our team will advise on recovery and what to do next.
        </p>
      </div>
    </section>

    <!-- on the road: heading sticks while the steps scroll past -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter grid w-full gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
        <div class="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            title="If you break down on the road"
            subtitle="Where it’s safe to do so, follow these steps before you contact us."
          />
        </div>

        <ol class="flex flex-col divide-y divide-line border-y border-line">
          <li
            v-for="(tip, i) in safety"
            :key="tip.title"
            class="grid gap-3 py-7 md:grid-cols-[1fr_1.4fr] md:gap-8"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <h3 class="flex items-center gap-3 font-display text-xl text-ink">
              <AppIcon :name="tip.icon" :size="18" class="shrink-0 text-accent" />
              {{ tip.title }}
            </h3>
            <p class="text-ink-soft">{{ tip.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- what happens next -->
    <section class="bg-paper py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-12">
        <SectionHeading
          title="What happens next"
          subtitle="We’ll always confirm the details with you before anything goes ahead."
        />

        <ol class="grid gap-8 md:grid-cols-3">
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

    <!-- cta: split band -->
    <section class="u-rule bg-paper-soft py-16 md:py-20">
      <div class="u-gutter flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl" data-reveal>
          <h2 class="u-display text-[2.1rem] sm:text-[2.6rem]">Need a hand?</h2>
          <p class="mt-4 max-w-prose text-ink-soft">
            Call us during opening hours, or send a message and we’ll get back to you.
          </p>
        </div>
        <div class="flex flex-wrap gap-3" data-reveal data-reveal-delay="120">
          <a :href="telHref" class="btn-primary">
            <AppIcon name="phone" :size="16" />
            Call {{ dealer.phone }}
          </a>
          <RouterLink to="/contact" class="btn-ghost">Ask our team</RouterLink>
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
