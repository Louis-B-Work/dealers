<template>
  <div>
    <section class="bg-ink text-paper" aria-labelledby="home-title">
      <div class="u-gutter flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-12">
        <div>
          <p class="u-eyebrow mb-3 !text-orange-300">Used cars · Every price on show</p>
          <h1 id="home-title" class="u-h1">Find your next car.</h1>
          <p class="mt-3 max-w-xl text-base text-paper/75 sm:text-lg">
            {{ vehicles.length }} cars in stock right now. Filter by what matters, then switch to
            monthly prices to shop by budget.
          </p>
        </div>
        <ul class="grid grid-cols-3 gap-6 text-sm sm:gap-10">
          <li>
            <p class="tabular text-2xl font-bold">{{ dealer.rating.score }}</p>
            <p class="text-paper/70">{{ dealer.rating.count }} reviews</p>
          </li>
          <li>
            <p class="tabular text-2xl font-bold">{{ formatCurrency(cheapest) }}</p>
            <p class="text-paper/70">cars from</p>
          </li>
          <li>
            <p class="tabular text-2xl font-bold">{{ formatCurrency(lowestMonthly) }}</p>
            <p class="text-paper/70">a month from</p>
          </li>
        </ul>
      </div>
    </section>

    <div id="stock" class="u-gutter py-8 lg:py-10">
      <StockBrowser />
    </div>

    <section class="border-t border-line bg-surface py-14" aria-labelledby="body-title">
      <div class="u-gutter">
        <div class="mb-8 flex items-end justify-between gap-4">
          <h2 id="body-title" class="u-h2">Shop by body type</h2>
          <RouterLink to="/vehicles" class="text-sm font-semibold text-accent hover:text-accent-hover">
            All stock
            <AppIcon name="arrow" :size="14" class="ml-1 inline" />
          </RouterLink>
        </div>
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <li v-for="type in bodyTypes" :key="type.name">
            <RouterLink
              :to="{ path: '/vehicles', query: { bodyType: type.name } }"
              class="block rounded-panel border border-line p-4 transition hover:border-ink hover:shadow-soft"
            >
              <p class="font-semibold">{{ type.name === 'SUV' ? 'SUVs' : `${type.name}s` }}</p>
              <p class="mt-1 text-sm text-ink-muted">
                <span class="tabular">{{ type.count }}</span> in stock
              </p>
              <p class="tabular mt-3 text-sm">
                from <strong>{{ formatCurrency(type.from) }}</strong>
              </p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="u-gutter grid gap-6 py-14 lg:grid-cols-2" aria-label="Finance and part-exchange">
      <BudgetEstimator />
      <div class="panel flex flex-col justify-between bg-ink p-6 text-paper sm:p-8">
        <div>
          <p class="u-eyebrow !text-orange-300">Sell or part-exchange</p>
          <h2 class="u-h2 mt-2">Got a car to move on?</h2>
          <p class="mt-4 max-w-md text-sm text-paper/75">
            Tell us about your current car and we will talk you through selling it outright or putting
            it towards something in stock. A real valuation needs an inspection, and this demo gives
            no instant price.
          </p>
        </div>
        <RouterLink to="/sell" class="btn mt-8 w-full bg-paper text-ink hover:bg-orange-100 sm:w-auto sm:self-start">
          Start a valuation request
          <AppIcon name="arrow" :size="16" />
        </RouterLink>
      </div>
    </section>

    <section class="bg-paper-soft py-14" aria-labelledby="reviews-title">
      <div class="u-gutter">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 id="reviews-title" class="u-h2">What customers say</h2>
          <p class="text-xs text-ink-muted">Illustrative reviews for this design preview.</p>
        </div>
        <ul class="grid gap-5 md:grid-cols-3">
          <li v-for="review in reviews" :key="review.name" class="panel flex flex-col p-6">
            <p class="text-orange-600" role="img" aria-label="5 out of 5 stars">★★★★★</p>
            <blockquote class="mt-4 flex-1 text-base leading-relaxed">“{{ review.text }}”</blockquote>
            <p class="mt-5 text-sm font-semibold">
              {{ review.name }}
              <span class="block font-normal text-ink-muted">{{ review.detail }}</span>
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section class="u-gutter grid gap-8 py-14 lg:grid-cols-2 lg:items-center" aria-labelledby="visit-title">
      <div>
        <p class="u-eyebrow">Visit us</p>
        <h2 id="visit-title" class="u-h2 mt-2">See it in person</h2>
        <address class="mt-5 text-ink-soft not-italic">
          {{ dealer.address.line1 }}, {{ dealer.address.line2 }}<br />
          {{ dealer.address.city }}, {{ dealer.address.postcode }}
        </address>
        <ul class="mt-5 max-w-sm divide-y divide-line border-y border-line text-sm">
          <li v-for="hours in dealer.openingHours" :key="hours.day" class="flex justify-between py-2.5">
            <span class="text-ink-muted">{{ hours.day }}</span>
            <span class="tabular">{{ hours.hours }}</span>
          </li>
        </ul>
        <RouterLink to="/contact" class="btn-primary mt-6">Contact the team</RouterLink>
      </div>
      <div
        class="flex aspect-[16/10] items-center justify-center rounded-panel border border-line bg-paper-soft text-center text-ink-muted"
        role="img"
        aria-label="Map placeholder"
      >
        <div>
          <AppIcon name="pin" :size="28" class="mx-auto text-accent" />
          <p class="mt-2 text-sm font-medium text-ink">{{ dealer.address.city }}</p>
          <p class="text-xs">Map placeholder</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StockBrowser from '../components/home/StockBrowser.vue'
import BudgetEstimator from '../components/shared/BudgetEstimator.vue'
import AppIcon from '../components/shared/AppIcon.vue'
import { reviews } from '../data/content'
import { dealer } from '../data/dealer'
import { vehicles } from '../data/vehicles'
import { formatCurrency } from '../composables/useStockSearch'

const cheapest = Math.min(...vehicles.map((v) => v.price))
const lowestMonthly = Math.min(...vehicles.map((v) => v.monthlyFrom))

const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType)))
  .map((name) => {
    const cars = vehicles.filter((v) => v.bodyType === name)
    return { name, count: cars.length, from: Math.min(...cars.map((v) => v.price)) }
  })
  .sort((a, b) => b.count - a.count)
</script>
