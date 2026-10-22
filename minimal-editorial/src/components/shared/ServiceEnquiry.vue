<template>
  <div>
    <div v-if="submitted" class="flex flex-col items-center gap-4 border-y border-ink py-16 text-center" role="status">
      <AppIcon name="check" :size="22" class="text-ink" />
      <h3 class="u-display-caps text-base">Thank you, {{ form.name.split(' ')[0] }}</h3>
      <p class="max-w-prose text-sm text-ink-soft sm:text-base">
        We’ve got your enquiry and will be in touch during opening hours.
      </p>
    </div>

    <form v-else class="grid gap-x-12 gap-y-9 sm:grid-cols-2" novalidate @submit.prevent="onSubmit">
      <label class="flex flex-col gap-2">
        <span class="field-label !mb-0">Name</span>
        <input v-model="form.name" type="text" autocomplete="name" class="line-input" :aria-invalid="!!errors.name" />
        <span v-if="errors.name" class="text-xs text-ink" role="alert">{{ errors.name }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="field-label !mb-0">Email</span>
        <input v-model="form.email" type="email" autocomplete="email" class="line-input" :aria-invalid="!!errors.email" />
        <span v-if="errors.email" class="text-xs text-ink" role="alert">{{ errors.email }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="field-label !mb-0">Phone <span class="normal-case tracking-normal">(optional)</span></span>
        <input v-model="form.phone" type="tel" autocomplete="tel" class="line-input" />
      </label>

      <label v-if="types?.length" class="flex flex-col gap-2">
        <span class="field-label !mb-0">Enquiry type</span>
        <select v-model="form.type" class="line-input" :aria-invalid="!!errors.type">
          <option value="" disabled>Please choose…</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
        <span v-if="errors.type" class="text-xs text-ink" role="alert">{{ errors.type }}</span>
      </label>

      <label class="flex flex-col gap-2">
        <span class="field-label !mb-0">Make</span>
        <input v-model="form.make" type="text" class="line-input" />
      </label>

      <label class="flex flex-col gap-2">
        <span class="field-label !mb-0">Model</span>
        <input v-model="form.model" type="text" class="line-input" />
      </label>

      <label v-if="showReg" class="flex flex-col gap-2">
        <span class="field-label !mb-0">Registration <span class="normal-case tracking-normal">(optional)</span></span>
        <input v-model="form.reg" type="text" maxlength="8" class="line-input uppercase tracking-[0.2em]" />
      </label>

      <label class="flex flex-col gap-2 sm:col-span-2">
        <span class="field-label !mb-0">{{ messageLabel }}</span>
        <textarea v-model="form.message" rows="3" class="line-input resize-y"></textarea>
      </label>

      <div class="flex flex-col gap-4 sm:col-span-2">
        <button type="submit" class="btn-primary self-start">
          {{ submitLabel }}
          <AppIcon name="arrow" :size="14" />
        </button>
        <p class="text-xs text-ink-muted">
          Enquiries are answered during opening hours. For anything urgent, please call us.
        </p>
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

<style scoped>
/* A drawn line to write on, not a box. */
.line-input {
  @apply w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2.5 text-base text-ink outline-none transition-colors duration-300 ease-premium placeholder:text-ink-muted/60 hover:border-ink/40 focus:border-ink;
}
</style>
