<template>
  <form
    role="search"
    aria-label="Search the collection"
    class="grid overflow-hidden rounded-panel border border-line sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
    @submit.prevent="submit"
  >
    <div class="border-b border-line px-5 py-3 sm:border-b-0 sm:border-r">
      <label class="field-label mb-1" for="hero-make">Marque</label>
      <select id="hero-make" v-model="make" class="w-full cursor-pointer bg-transparent py-1 text-base text-ink focus:outline-none" @change="model = ''">
        <option value="">Any marque</option>
        <option v-for="option in makes" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <div class="border-b border-line px-5 py-3 sm:border-b-0 sm:border-r">
      <label class="field-label mb-1" for="hero-model">Model</label>
      <select
        id="hero-model"
        v-model="model"
        class="w-full cursor-pointer bg-transparent py-1 text-base text-ink focus:outline-none disabled:cursor-not-allowed disabled:text-ink-muted"
        :disabled="!make"
      >
        <option value="">{{ make ? 'Any model' : 'Choose a marque first' }}</option>
        <option v-for="option in models" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <button type="submit" class="btn-accent rounded-none px-8 py-5">
      <span>
        Search <span class="tabular">{{ count }}</span> {{ count === 1 ? 'car' : 'cars' }}
      </span>
      <AppIcon name="arrow" :size="15" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { makesInStock, modelsFor } from '../../composables/useCollectionSearch'
import { vehicles } from '../../data/vehicles'
import AppIcon from '../shared/AppIcon.vue'

const router = useRouter()
const makes = makesInStock()
const make = ref('')
const model = ref('')
const models = computed(() => modelsFor(make.value))

const count = computed(
  () => vehicles.filter((v) => (!make.value || v.make === make.value) && (!model.value || v.model === model.value)).length,
)

function submit() {
  const query: Record<string, string> = {}
  if (make.value) query.make = make.value
  if (model.value) query.model = model.value
  router.push({ path: '/vehicles', query })
}
</script>
