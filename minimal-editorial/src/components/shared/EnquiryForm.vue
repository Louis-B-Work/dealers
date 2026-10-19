<template>
  <form v-if="!submitted" class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <div v-if="vehicleName" class="border border-line bg-paper-soft px-4 py-3.5 text-sm">
      <span class="text-ink-muted">Enquiring about</span>&nbsp;<span class="font-medium text-ink">{{
        vehicleName
      }}</span>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <label class="flex flex-col">
        <span class="field-label">Full name</span>
        <input
          v-model.trim="form.name"
          type="text"
          class="field"
          :class="{ 'is-invalid': errors.name }"
          placeholder="Jane Smith"
          autocomplete="name"
        />
        <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
      </label>

      <label class="flex flex-col">
        <span class="field-label">Phone</span>
        <input
          v-model.trim="form.phone"
          type="tel"
          class="field"
          :class="{ 'is-invalid': errors.phone }"
          placeholder="07700 900000"
          autocomplete="tel"
        />
        <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
      </label>
    </div>

    <label class="flex flex-col">
      <span class="field-label">Email</span>
      <input
        v-model.trim="form.email"
        type="email"
        class="field"
        :class="{ 'is-invalid': errors.email }"
        placeholder="jane@example.com"
        autocomplete="email"
      />
      <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
    </label>

    <label class="flex flex-col">
      <span class="field-label">Message</span>
      <textarea
        v-model.trim="form.message"
        rows="4"
        class="field resize-none"
        :class="{ 'is-invalid': errors.message }"
        :placeholder="messagePlaceholder"
      ></textarea>
      <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
    </label>

    <button type="submit" class="btn-primary w-full sm:w-auto sm:self-start">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="15" />
    </button>

    <p class="text-xs leading-relaxed text-ink-muted">
      By submitting you agree to be contacted about your enquiry. We never share your details. See
      our
      <RouterLink to="/privacy" class="text-ink underline underline-offset-4">
        privacy policy </RouterLink
      >.
    </p>
  </form>

  <div v-else class="flex flex-col items-center gap-5 border border-line px-6 py-14 text-center">
    <span class="flex h-14 w-14 items-center justify-center bg-ink text-paper">
      <AppIcon name="check" :size="24" />
    </span>
    <h3 class="u-display-caps text-base">Thank you, {{ form.name || 'there' }}</h3>
    <p class="max-w-sm text-sm leading-relaxed text-ink-soft">
      Your enquiry has been received. A member of our team will be in touch very shortly.
    </p>
    <button type="button" class="btn-ghost mt-2" @click="reset">Send another enquiry</button>
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

<style scoped>
/* The palette has no red, so an invalid field is marked by weight and a
   doubled border rather than by hue. */
.is-invalid {
  @apply border-ink shadow-[inset_0_-2px_0_0_rgb(var(--c-ink))];
}

.form-error {
  @apply mt-2 text-xs text-ink;
}
</style>
