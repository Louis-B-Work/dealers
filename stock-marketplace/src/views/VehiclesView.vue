<template>
  <div>
    <PageHeader
      title="Used cars in stock"
      current="Used cars"
      eyebrow="The stock"
      :subtitle="`${vehicles.length} cars, each with its price and a monthly figure. Filters are saved in the address, so you can share a search.`"
    />
    <div class="u-gutter py-8 lg:py-10">
      <StockBrowser />
    </div>
    <div class="u-gutter pb-6">
      <BudgetEstimator target="vehicles" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StockBrowser from '../components/home/StockBrowser.vue'
import BudgetEstimator from '../components/shared/BudgetEstimator.vue'
import PageHeader from '../components/shared/PageHeader.vue'
import { vehicles } from '../data/vehicles'
</script>
