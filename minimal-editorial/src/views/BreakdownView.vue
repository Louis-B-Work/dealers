<template>
  <div class="bg-paper">
    <PageHeader
      title="Breakdown"
      subtitle="Help when you need it most. If you’ve broken down, talk to our team about your next steps."
    >
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <a :href="telHref" class="btn-primary">
          <AppIcon name="phone" :size="14" />
          Call {{ dealer.phone }}
        </a>
        <RouterLink to="/contact" class="btn-ghost">Ask our team</RouterLink>
      </div>
    </PageHeader>

    <!-- safety note: framed in a full-strength rule -->
    <section class="u-gutter w-full pt-16">
      <div class="mx-auto flex max-w-4xl items-start gap-5 border border-ink p-6 md:p-8" role="note" data-reveal>
        <AppIcon name="shield" :size="20" class="mt-0.5 shrink-0 text-ink" />
        <p class="text-ink-soft">
          <span class="u-display-caps mb-2 block text-[0.78rem]">In immediate danger or an unsafe place?</span>
          Call the emergency services first. Our number is for non-urgent help.
        </p>
      </div>
    </section>

    <!-- intro -->
    <section class="py-24 md:py-32">
      <div class="u-gutter w-full">
        <p
          class="u-display mx-auto max-w-4xl text-center text-[1.5rem] leading-[1.4] sm:text-[1.9rem] md:text-[2.2rem]"
          data-reveal
        >
          Broken down? You don’t have to work out your next steps alone. Our team will advise on recovery and
          what to do next.
        </p>
      </div>
    </section>

    <!-- on the road -->
    <section class="border-t border-line py-20 md:py-28">
      <div class="u-gutter grid w-full gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
        <SectionHeading
          title="If you break down on the road"
          subtitle="Where it’s safe to do so, follow these steps before you contact us."
        />

        <dl class="border-t border-ink">
          <div
            v-for="(tip, i) in safety"
            :key="tip.title"
            class="grid gap-3 border-b border-line py-8 md:grid-cols-[1fr_1.5fr] md:gap-10"
            data-reveal
            :data-reveal-delay="i * 70"
          >
            <dt class="u-display-caps text-[0.82rem]">{{ tip.title }}</dt>
            <dd class="text-sm leading-relaxed text-ink-soft sm:text-base">{{ tip.body }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- what happens next -->
    <section class="bg-paper-soft py-20 md:py-28">
      <div class="u-gutter flex w-full flex-col gap-14">
        <SectionHeading
          title="What happens next"
          subtitle="We’ll always confirm the details with you before anything goes ahead."
          center
        />

        <ol class="grid gap-10 border-t border-ink pt-10 md:grid-cols-3">
          <li v-for="(step, i) in steps" :key="step.title" class="flex flex-col gap-3" data-reveal :data-reveal-delay="i * 80">
            <h3 class="u-display text-xl">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed text-ink-soft">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- invitation -->
    <section class="bg-ink py-24 text-paper md:py-32">
      <div class="u-gutter flex w-full flex-col items-center gap-10 text-center">
        <h2 class="u-display-caps text-2xl !text-paper sm:text-3xl" data-reveal>Need a hand?</h2>
        <p class="max-w-prose text-paper/70" data-reveal data-reveal-delay="80">
          Call us during opening hours, or send a message and we’ll get back to you.
        </p>
        <div class="flex flex-wrap justify-center gap-4" data-reveal data-reveal-delay="140">
          <a
            :href="telHref"
            class="btn border border-paper bg-paper text-ink hover:bg-transparent hover:text-paper"
          >
            <AppIcon name="phone" :size="14" />
            Call {{ dealer.phone }}
          </a>
          <RouterLink to="/contact" class="btn border border-paper/60 text-paper hover:bg-paper hover:text-ink">
            Ask our team
          </RouterLink>
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
  { title: 'Move off the road', body: 'Where it’s safe, move your vehicle off the carriageway, away from traffic.' },
  { title: 'Hazard lights on', body: 'Switch on your hazard lights so other drivers can see you.' },
  { title: 'Get to safety', body: 'On a motorway, leave by the left-hand door and wait behind the barrier, away from traffic.' },
  { title: 'Then contact us', body: 'Once you’re safe, call us and we’ll take it from there.' },
]

const steps = [
  { title: 'We take the details', body: 'Tell us about your car and what’s gone wrong.' },
  { title: 'We point you onwards', body: 'We’ll direct you to recovery, an inspection booking or repair advice.' },
  { title: 'You confirm first', body: 'Nothing goes ahead until we’ve agreed the details with you.' },
]
</script>
