<template>
  <div v-if="page">
    <PageHeader :title="page.title" :current="page.title" :eyebrow="page.eyebrow" :subtitle="page.intro" />

    <div class="u-gutter space-y-12 py-10">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <section class="panel bg-ink p-6 text-paper sm:p-8" aria-labelledby="lead-title">
          <AppIcon :name="page.icon" :size="28" class="text-orange-300" />
          <h2 id="lead-title" class="mt-4 text-2xl font-bold">{{ page.leadTitle }}</h2>
          <p class="mt-3 max-w-prose text-sm leading-relaxed text-paper/75">{{ page.leadText }}</p>
          <ul class="mt-6 border-t border-paper/15">
            <li v-for="item in page.checklist" :key="item" class="flex items-start gap-3 border-b border-paper/15 py-3 text-sm text-paper/85">
              <AppIcon name="check" :size="16" class="mt-0.5 shrink-0 text-orange-300" />
              {{ item }}
            </li>
          </ul>
        </section>

        <aside class="panel p-6 sm:p-8">
          <h2 class="text-lg font-semibold">Start with the right details</h2>
          <p class="mt-2 text-sm leading-relaxed text-ink-soft">
            Whether you bought from us or are just exploring options, agree the scope and price before committing.
            This is a fictional dealership preview: services and appointments cannot be purchased or booked here.
          </p>
          <RouterLink :to="{ path: '/contact', query: { subject: page.subject } }" class="btn-accent mt-5">
            {{ page.action }}
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </aside>
      </div>

      <section aria-labelledby="steps-title">
        <h2 id="steps-title" class="u-h2 mb-6">What to expect</h2>
        <ol class="grid gap-5 md:grid-cols-3">
          <li v-for="(step, index) in page.steps" :key="step.title" class="panel p-6">
            <span class="tabular text-3xl font-bold text-accent">0{{ index + 1 }}</span>
            <h3 class="mt-4 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-ink-soft">{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <FaqList :faqs="page.faqs" />

      <nav aria-label="Other care pages">
        <h2 class="u-h2 mb-4">More care and support</h2>
        <ul class="grid gap-3 sm:grid-cols-3">
          <li v-for="other in others" :key="other.slug">
            <RouterLink :to="other.path" class="panel flex items-center gap-3 p-4 transition hover:border-ink">
              <AppIcon :name="other.icon" :size="20" class="text-accent" />
              <span class="font-semibold">{{ other.navLabel }}</span>
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
