<template>
  <form
    v-if="!submitted"
    class="flex flex-col gap-4"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div v-if="vehicleName" class="rounded-control border border-line bg-paper-soft px-4 py-3 text-sm">
      <span class="text-ink-muted">Enquiring about</span>
      <span class="font-semibold text-ink"> {{ vehicleName }}</span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-ink-soft">Full name</span>
        <input
          v-model.trim="form.name"
          type="text"
          class="field"
          :class="{ 'border-red-400': errors.name }"
          placeholder="Jane Smith"
          autocomplete="name"
        />
        <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-ink-soft">Phone</span>
        <input
          v-model.trim="form.phone"
          type="tel"
          class="field"
          :class="{ 'border-red-400': errors.phone }"
          placeholder="07700 900000"
          autocomplete="tel"
        />
        <span v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</span>
      </label>
    </div>

    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-ink-soft">Email</span>
      <input
        v-model.trim="form.email"
        type="email"
        class="field"
        :class="{ 'border-red-400': errors.email }"
        placeholder="jane@example.com"
        autocomplete="email"
      />
      <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
    </label>

    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-ink-soft">Message</span>
      <textarea
        v-model.trim="form.message"
        rows="4"
        class="field resize-none"
        :class="{ 'border-red-400': errors.message }"
        :placeholder="messagePlaceholder"
      ></textarea>
      <span v-if="errors.message" class="text-xs text-red-500">{{ errors.message }}</span>
    </label>

    <button type="submit" class="btn-accent w-full sm:w-auto">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="16" />
    </button>
    <p class="text-xs text-ink-muted">
      By submitting you agree to be contacted about your enquiry. We never share your details.
    </p>
  </form>

  <div
    v-else
    class="flex flex-col items-center gap-4 rounded-panel border border-line bg-paper-soft px-6 py-12 text-center"
  >
    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
      <AppIcon name="check" :size="26" />
    </span>
    <h3 class="font-display text-xl text-ink">Thank you, {{ form.name || 'there' }}.</h3>
    <p class="max-w-sm text-sm text-ink-soft">
      Your enquiry has been received. A member of our team will be in touch very shortly.
    </p>
    <button type="button" class="btn-ghost" @click="reset">Send another enquiry</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    vehicleName?: string
    submitLabel?: string
    messagePlaceholder?: string
  }>(),
  {
    submitLabel: 'Send enquiry',
    messagePlaceholder: 'Tell us how we can help…',
  },
)

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

const form = reactive<FormState>({ name: '', email: '', phone: '', message: '' })
const errors = reactive<Record<keyof FormState, string>>({
  name: '',
  email: '',
  phone: '',
  message: '',
})
const submitted = ref(false)

function validate(): boolean {
  errors.name = form.name.length < 2 ? 'Please enter your name.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.phone = form.phone.replace(/\D/g, '').length >= 10 ? '' : 'Enter a valid phone number.'
  errors.message = form.message.length < 10 ? 'Please add a little more detail.' : ''
  return !errors.name && !errors.email && !errors.phone && !errors.message
}

function onSubmit() {
  if (validate()) submitted.value = true
}

function reset() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.message = ''
  submitted.value = false
}

// Prefill message when a vehicle context is provided
if (props.vehicleName) {
  form.message = `I'm interested in the ${props.vehicleName}. Please could you send me more information?`
}
</script>
