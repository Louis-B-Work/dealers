<template>
  <div v-if="page">
    <PageHeader :title="page.title" :current="page.title" :subtitle="page.intro" />

    <div class="u-gutter space-y-24 py-16 lg:py-20">
      <section class="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20" aria-labelledby="lead-title">
        <div>
          <AppIcon :name="page.icon" :size="30" class="text-accent" />
          <h2 id="lead-title" class="u-h2 mt-6">{{ page.leadTitle }}</h2>
          <p class="mt-5 max-w-md leading-relaxed text-ink-soft">{{ page.leadText }}</p>
          <RouterLink :to="{ path: '/contact', query: { subject: page.subject } }" class="btn-accent mt-10">
            {{ page.action }}
            <AppIcon name="arrow" :size="15" />
          </RouterLink>
        </div>
        <ul class="border-t border-line">
          <li v-for="item in page.checklist" :key="item" class="flex items-center gap-4 border-b border-line py-5 text-ink-soft">
            <span class="h-px w-5 shrink-0 bg-accent" aria-hidden="true"></span>
            {{ item }}
          </li>
        </ul>
      </section>

      <section aria-labelledby="steps-title">
        <h2 id="steps-title" class="font-display text-4xl">What to expect</h2>
        <ol class="mt-8 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
          <li v-for="step in page.steps" :key="step.title" class="bg-paper p-8">
            <h3 class="font-display text-2xl">{{ step.title }}</h3>
            <p class="mt-3 leading-relaxed text-ink-soft">{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <FaqList :faqs="page.faqs" />

      <p class="text-sm text-ink-muted">
        This is a fictional dealership preview: services, policies and appointments cannot be purchased or booked here.
      </p>

      <nav aria-label="Other aftercare pages" class="border-t border-line pt-12">
        <h2 class="field-label">More aftercare</h2>
        <ul class="mt-4 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
          <li v-for="other in others" :key="other.slug">
            <RouterLink :to="other.path" class="group flex items-center justify-between bg-paper p-6 transition hover:bg-paper-soft">
              <span class="font-display text-2xl group-hover:text-accent">{{ other.navLabel }}</span>
              <AppIcon name="arrow" :size="16" class="text-ink-muted transition group-hover:translate-x-1 group-hover:text-accent" />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import FaqList from '../components/shared/FaqList.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { servicePages } from '../data/content'

const route = useRoute()
const page = computed(() => servicePages.find((service) => service.slug === route.meta.service))
const others = computed(() => servicePages.filter((service) => service.slug !== page.value?.slug))
</script>
