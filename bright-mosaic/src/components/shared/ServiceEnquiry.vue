<template>
  <div class="rounded-panel border border-line bg-surface p-6 shadow-soft md:p-10">
    <div v-if="submitted" class="flex flex-col items-center gap-4 py-10 text-center" role="status">
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
        <AppIcon name="check" :size="26" />
      </span>
      <h3 class="font-display text-2xl font-extrabold text-ink">Thanks, {{ form.name.split(' ')[0] }}</h3>
      <p class="max-w-prose text-ink-soft">We’ve got your enquiry and will be in touch during opening hours.</p>
    </div>

    <form v-else class="grid gap-5 sm:grid-cols-2" novalidate @submit.prevent="onSubmit">
      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Name</span>
        <input v-model="form.name" type="text" autocomplete="name" class="field" :aria-invalid="!!errors.name" />
        <span v-if="errors.name" class="text-xs font-bold text-ink" role="alert">{{ errors.name }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Email</span>
        <input v-model="form.email" type="email" autocomplete="email" class="field" :aria-invalid="!!errors.email" />
        <span v-if="errors.email" class="text-xs font-bold text-ink" role="alert">{{ errors.email }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Phone <span class="font-medium normal-case tracking-normal">(optional)</span></span>
        <input v-model="form.phone" type="tel" autocomplete="tel" class="field" />
      </label>

      <label v-if="types?.length" class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Enquiry type</span>
        <select v-model="form.type" class="field" :aria-invalid="!!errors.type">
          <option value="" disabled>Please choose…</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
        <span v-if="errors.type" class="text-xs font-bold text-ink" role="alert">{{ errors.type }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Make</span>
        <input v-model="form.make" type="text" class="field" />
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Model</span>
        <input v-model="form.model" type="text" class="field" />
      </label>

      <label v-if="showReg" class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">Registration <span class="font-medium normal-case tracking-normal">(optional)</span></span>
        <input v-model="form.reg" type="text" maxlength="8" class="field uppercase" />
      </label>

      <label class="flex flex-col gap-2 sm:col-span-2">
        <span class="text-xs font-bold uppercase tracking-micro text-ink-muted">{{ messageLabel }}</span>
        <textarea v-model="form.message" rows="4" class="field"></textarea>
      </label>

      <div class="flex flex-col gap-3 sm:col-span-2">
        <button type="submit" class="btn-accent self-start">
          {{ submitLabel }}
          <AppIcon name="arrow" :size="16" />
        </button>
        <p class="text-xs text-ink-muted">Enquiries are answered during opening hours. For anything urgent, please call us.</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    types?: string[]
    showReg?: boolean
    messageLabel?: string
    submitLabel?: string
  }>(),
  { showReg: false, messageLabel: 'Message', submitLabel: 'Send enquiry' },
)

const form = reactive({ name: '', email: '', phone: '', type: '', make: '', model: '', reg: '', message: '' })
const errors = reactive({ name: '', email: '', type: '' })
const submitted = ref(false)

function onSubmit() {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Please enter a valid email.'
  errors.type = !props.types?.length || form.type ? '' : 'Please choose an enquiry type.'
  if (Object.values(errors).some(Boolean)) return

  // TODO: send to the enquiry endpoint. Nothing is submitted yet.
  submitted.value = true
}
</script>
