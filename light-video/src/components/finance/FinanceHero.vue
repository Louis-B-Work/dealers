<template>
  <PageHero
    title="Finance your vehicle"
    intro="See your monthly payment, compare HP and PCP, and check your eligibility in minutes."
  >
    <div class="flex flex-wrap justify-center gap-4" data-intro>
      <a :href="ELIGIBILITY_URL" target="_blank" rel="noopener" class="btn-accent">
        Check eligibility
        <AppIcon name="arrow" :size="16" />
      </a>
      <RouterLink
        :to="{ hash: '#calculator' }"
        class="btn inline-flex border border-white/25 text-white hover:border-white"
      >
        Use the calculator
      </RouterLink>
    </div>
  </PageHero>
</template>

<script setup lang="ts">
import { ELIGIBILITY_URL } from '../../data/dealer'
import PageHero from '../shared/PageHero.vue'
import AppIcon from '../shared/AppIcon.vue'
</script>
