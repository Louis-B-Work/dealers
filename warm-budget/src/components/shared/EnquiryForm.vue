<template>
  <form v-if="!submitted" class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
    <div
      v-if="vehicleName"
      class="rounded-tile border border-line bg-paper-sink px-4 py-3 text-sm"
    >
      <span class="text-ink-muted">Enquiring about </span>
      <span class="font-semibold text-ink">{{ vehicleName }}</span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col">
        <span class="field-label">Your name</span>
        <input
          v-model.trim="form.name"
          type="text"
          class="field"
          :class="{ 'field-invalid': errors.name }"
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
          :class="{ 'field-invalid': errors.phone }"
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
        :class="{ 'field-invalid': errors.email }"
        placeholder="jane@example.com"
        autocomplete="email"
      />
      <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
    </label>

    <label class="flex flex-col">
      <span class="field-label">How can we help?</span>
      <textarea
        v-model.trim="form.message"
        rows="4"
        class="field resize-none"
        :class="{ 'field-invalid': errors.message }"
        :placeholder="messagePlaceholder"
      ></textarea>
      <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
    </label>

    <button type="submit" class="btn-primary w-full sm:w-auto sm:self-start">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="16" />
    </button>

    <p class="u-legal">
      By sending this you agree to be contacted about your enquiry. We never share your details.
      See our
      <RouterLink to="/privacy" class="font-semibold text-accent underline underline-offset-2">
        privacy policy </RouterLink
      >.
    </p>
  </form>

  <div v-else class="card flex flex-col items-center gap-4 px-6 py-12 text-center">
    <span
      class="flex h-14 w-14 items-center justify-center rounded-full bg-accent-wash text-accent"
    >
      <AppIcon name="check" :size="26" />
    </span>
    <h3 class="u-display text-xl">Thanks, {{ form.name || 'there' }}!</h3>
    <p class="max-w-sm text-sm leading-relaxed text-ink-soft">
      We've got your message and one of the team will be in touch shortly, usually the same day.
    </p>
    <button type="button" class="btn-ghost mt-1" @click="reset">Send another message</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    vehicleName?: string
    submitLabel?: string
    messagePlaceholder?: string
  }>(),
  {
    submitLabel: 'Send message',
    messagePlaceholder: 'Tell us what you are looking for…',
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

// Prefill the message when a vehicle context is provided.
if (props.vehicleName) {
  form.message = `Hi, I'm interested in the ${props.vehicleName}. Is it still available?`
}
</script>

<style scoped>
/* Unlike template 03, this palette leaves red free to mean "wrong", so an
   invalid field is marked by colour *and* by a doubled border — never by
   colour alone. */
.form-error {
  @apply mt-1.5 text-xs font-semibold text-danger;
}
</style>
