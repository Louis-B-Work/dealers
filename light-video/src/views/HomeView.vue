<template>
  <div>
    <HeroVideo />
    <UspStrip />
    <FeaturedVehicles />
    <FinanceCta />
    <ValuationCta />
    <BrandStory />
    <Reviews />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import HeroVideo from '../components/home/HeroVideo.vue'
import UspStrip from '../components/home/UspStrip.vue'
import FeaturedVehicles from '../components/home/FeaturedVehicles.vue'
import FinanceCta from '../components/home/FinanceCta.vue'
import ValuationCta from '../components/home/ValuationCta.vue'
import BrandStory from '../components/home/BrandStory.vue'
import Reviews from '../components/home/Reviews.vue'

useScrollReveal()
</script>
