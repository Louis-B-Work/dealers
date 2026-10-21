<template>
  <div>
    <PageHeader
      title="Your details stay yours"
      current="Privacy"
      eyebrow="Legal"
      subtitle="What this design preview does, and does not do, with the information you enter."
    />

    <article class="u-gutter max-w-3xl space-y-8 py-10 text-sm leading-relaxed text-ink-soft">
      <p class="text-xs font-semibold uppercase tracking-micro text-ink-muted">Preview information · Updated October 2026</p>

      <section v-for="section in sections" :key="section.title">
        <h2 class="text-xl font-bold text-ink">{{ section.title }}</h2>
        <p class="mt-2">{{ section.text }}</p>
      </section>

      <RouterLink to="/" class="btn-primary">Back to the homepage</RouterLink>
    </article>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeader from '../components/shared/PageHeader.vue'
import { dealer } from '../data/dealer'

const sections = [
  { title: 'This is a design demonstration', text: `${dealer.name} is fictional. This preview is not a dealership, credit broker, valuation service or emergency contact. No purchases, reservations, finance applications or appointments can be made through it.` },
  { title: 'Enquiry and valuation forms', text: 'Form entries stay in your browser. Submitting runs local checks and shows a demo notice; it does not send an enquiry or store your details in a database, cookie or browser storage. Please use sample details instead of personal information. Entries disappear when the page is reloaded.' },
  { title: 'Stock filters and calculators', text: 'Your filters, sort order and budget choices are saved in the page address so a search can be bookmarked or shared. Do not type personal information into the search box. Finance calculations run on your device and perform no credit searches. Your browser may keep visited addresses in its history.' },
  { title: 'Images, fonts and links', text: 'Some photographs load from Pexels and Unsplash and the typeface loads from Google Fonts. Those providers receive normal request information, such as your IP address, when their files load. Bundled vehicle photos are served from this site. Each provider has its own privacy terms.' },
  { title: 'Hosting and analytics', text: 'This template adds no analytics, advertising trackers or application cookies. Whoever hosts the site may keep standard access and security logs under their own policies. This statement describes the template code only.' },
  { title: 'Before using this for a real dealership', text: 'Replace this preview text with an accurate privacy notice naming the data controller, contact details, lawful bases, processors, retention periods, individual rights and complaint routes. Review any live forms, finance integrations, analytics or cookies before launch.' },
]
</script>
