<template>
  <div class="bg-paper">
    <Hero>
      <SearchBar />
    </Hero>

    <BrandStrip />
    <TrendingSearches />
    <UspStrip />
    <FeaturedVehicles />
    <PromiseCards />
    <FinanceCta />
    <ValuationCta />
    <Reviews />
  </div>
</template>

<script setup lang="ts">
/**
 * One column, full width, top to bottom. No two-column spread and no sticky
 * stock rail — this template is the simple one, and a shopper who has
 * already answered "what is my budget?" in the hero should be able to fall
 * straight down the page to the stock that matches it.
 */
import BrandStrip from '../components/home/BrandStrip.vue'
import FeaturedVehicles from '../components/home/FeaturedVehicles.vue'
import FinanceCta from '../components/home/FinanceCta.vue'
import Hero from '../components/home/Hero.vue'
import PromiseCards from '../components/home/PromiseCards.vue'
import Reviews from '../components/home/Reviews.vue'
import SearchBar from '../components/home/SearchBar.vue'
import TrendingSearches from '../components/home/TrendingSearches.vue'
import UspStrip from '../components/home/UspStrip.vue'
import ValuationCta from '../components/home/ValuationCta.vue'
</script>
