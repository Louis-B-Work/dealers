<template>
  <div>
    <HeroMosaic />
    <FeaturedBento />
    <FinanceCta />
    <ValuationCta />
    <Reviews />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import HeroMosaic from '../components/home/HeroMosaic.vue'
import FeaturedBento from '../components/home/FeaturedBento.vue'
import FinanceCta from '../components/home/FinanceCta.vue'
import ValuationCta from '../components/home/ValuationCta.vue'
import Reviews from '../components/home/Reviews.vue'

useScrollReveal()
</script>
