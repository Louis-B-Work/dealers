<template>
  <div>
    <Hero />

    <!-- The page's defining split: the dealership's opening pitch runs down
         the left, the stock runs down the right, separated by a single rule
         so the two read as one spread rather than two panels. -->
    <div class="u-gutter w-full border-t border-line">
      <div class="grid w-full lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <div class="flex flex-col divide-y divide-line lg:border-r lg:border-line lg:pr-12 xl:pr-16">
          <UspStrip />
          <PremiumTiles />
          <BrandStory />
        </div>

        <div
          id="in-stock"
          class="border-t border-line pt-8 lg:border-t-0 lg:pl-12 lg:pt-0 xl:pl-16"
        >
          <StockColumn />
        </div>
      </div>
    </div>

    <!-- Once the stock column has run out the page reclaims the full width;
         holding the left margin for an empty gutter would only waste it. -->
    <div class="flex flex-col divide-y divide-line border-t border-line">
      <FinanceCta />
      <ValuationCta />
      <Reviews />
    </div>

    <!-- Mobile only: the spread unstacks on a phone, so the stock ends up a
         long way below the wizard. -->
    <StockJump />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import Hero from '../components/home/Hero.vue'
import UspStrip from '../components/home/UspStrip.vue'
import PremiumTiles from '../components/home/PremiumTiles.vue'
import BrandStory from '../components/home/BrandStory.vue'
import FinanceCta from '../components/home/FinanceCta.vue'
import ValuationCta from '../components/home/ValuationCta.vue'
import Reviews from '../components/home/Reviews.vue'
import StockColumn from '../components/home/StockColumn.vue'
import StockJump from '../components/home/StockJump.vue'

useScrollReveal()
</script>
