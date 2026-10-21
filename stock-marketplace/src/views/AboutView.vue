<template>
  <div>
    <PageHeader
      title="Straightforward car buying"
      current="About"
      eyebrow="About us"
      :subtitle="`${dealer.name} is a fictional independent dealership template. The idea is simple: every car and every price on show, and a team to help once you have narrowed it down.`"
    />

    <div class="u-gutter space-y-14 py-10">
      <ul class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <li v-for="stat in stats" :key="stat.label" class="panel p-5">
          <p class="tabular text-3xl font-bold">{{ stat.value }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ stat.label }}</p>
        </li>
      </ul>

      <section class="grid gap-8 lg:grid-cols-2 lg:items-start" aria-labelledby="story-title">
        <div>
          <h2 id="story-title" class="u-h2">Why we put the stock first</h2>
          <p class="mt-4 leading-relaxed text-ink-soft">
            Most people start by looking, not by talking. So the stock is the first thing you see here,
            with its price, mileage and a monthly figure up front, and the tools to narrow it down quickly.
          </p>
          <p class="mt-4 leading-relaxed text-ink-soft">
            When you are ready for a conversation, the team is here for the details: a viewing, a test
            drive, finance options or a part-exchange. Nothing here is a hard sell.
          </p>
          <RouterLink to="/vehicles" class="btn-accent mt-6">
            Browse the stock
            <AppIcon name="arrow" :size="16" />
          </RouterLink>
        </div>
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="value in values" :key="value.title" class="panel p-5">
            <AppIcon :name="value.icon" :size="22" class="text-accent" />
            <h3 class="mt-3 font-semibold">{{ value.title }}</h3>
            <p class="mt-1 text-sm text-ink-soft">{{ value.text }}</p>
          </li>
        </ul>
      </section>

      <section class="panel bg-ink p-6 text-paper sm:p-8" aria-labelledby="demo-title">
        <h2 id="demo-title" class="text-xl font-bold">A note on this template</h2>
        <p class="mt-3 max-w-prose text-sm leading-relaxed text-paper/75">
          {{ dealer.name }} is a design preview. Staff, trading history, awards and customer ratings are
          placeholders for a dealer to replace, and nothing on this site can be bought, reserved or booked.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '../components/shared/AppIcon.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { dealer } from '../data/dealer'
import { vehicles } from '../data/vehicles'

const stats = [
  { value: String(vehicles.length), label: 'cars in stock' },
  { value: dealer.established, label: 'trading since (placeholder)' },
  { value: String(dealer.rating.score), label: `${dealer.rating.source} rating (placeholder)` },
  { value: '4', label: 'care services' },
]

const values = [
  { icon: 'tag', title: 'Prices on show', text: 'The cash price and a monthly figure sit on every listing, so there is nothing to uncover later.' },
  { icon: 'search', title: 'Easy to compare', text: 'Filter, sort and switch between cash and monthly prices to see what fits.' },
  { icon: 'shield', title: 'Prepared properly', text: 'In a real dealership, preparation, history checks and warranty terms would be confirmed in writing.' },
  { icon: 'key', title: 'Support after the sale', text: 'MOT, servicing, bodywork and roadside guidance are covered in the care pages.' },
]
</script>
