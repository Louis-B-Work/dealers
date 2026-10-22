<template>
  <div>
    <PageHeader
      title="Fewer cars. Chosen better."
      current="About"
      :subtitle="`${dealer.name} is a fictional independent dealership template. The idea is a small, carefully chosen collection, presented properly and shown in private.`"
      :image="headerImage"
    />

    <div class="u-gutter space-y-24 py-16 lg:py-20">
      <section class="grid gap-12 lg:grid-cols-2 lg:gap-20" aria-labelledby="approach-title">
        <div v-reveal>
          <h2 id="approach-title" class="u-h2">A collection, not a forecourt.</h2>
        </div>
        <div v-reveal="120" class="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            Every car is chosen for its specification, history and condition. Most people know exactly what they want
            by the time they visit, so the collection is easy to browse and every car has its price on show.
          </p>
          <p>
            When you are ready, the car is prepared and waiting, with time set aside to look, sit and drive. Questions
            about provenance, finance or a part-exchange are answered plainly and in writing.
          </p>
        </div>
      </section>

      <ul class="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(value, index) in values" :key="value.title" v-reveal="index * 100" class="bg-paper p-8">
          <h3 class="font-display text-2xl">{{ value.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-ink-soft">{{ value.text }}</p>
        </li>
      </ul>

      <section v-reveal class="grid gap-10 rounded-panel border border-line p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center" aria-labelledby="note-title">
        <div>
          <h2 id="note-title" class="font-display text-3xl">A note on this template</h2>
          <p class="mt-4 max-w-3xl leading-relaxed text-ink-soft">
            {{ dealer.name }} is a design preview. Staff, trading history and ratings are placeholders for a dealer to
            replace, and nothing on this site can be bought, reserved or booked.
          </p>
        </div>
        <RouterLink to="/vehicles" class="btn-accent">
          View the collection
          <AppIcon name="arrow" :size="15" />
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { dealer } from '../data/dealer'
import { getVehicleById } from '../data/vehicles'

const headerImage = getVehicleById('bentley-continental-2020')?.image ?? ''

const values = [
  { title: 'Curated', text: 'A small collection means every car can be known in detail, not just listed.' },
  { title: 'Transparent', text: 'Prices, specifications and finance illustrations are on show from the first visit.' },
  { title: 'Private', text: 'Viewings by appointment, with the car prepared and time set aside for you.' },
  { title: 'Supported', text: 'Aftercare pages explain MOTs, servicing, bodywork, warranty and roadside help.' },
]
</script>
