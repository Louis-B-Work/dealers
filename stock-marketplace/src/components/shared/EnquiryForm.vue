<template>
  <form
    class="flex flex-col gap-4"
    novalidate
    :aria-label="valuation ? 'Valuation request' : 'Enquiry'"
    @submit.prevent="onSubmit"
  >
    <p class="rounded-control border border-line bg-paper-soft px-4 py-3 text-sm text-ink-soft">
      <strong class="text-ink">Design preview.</strong>
      This form checks your entries but sends and stores nothing. Please use sample details.
    </p>

    <div v-if="vehicleName" class="rounded-control border border-line bg-surface px-4 py-3 text-sm">
      <span class="text-ink-muted">Enquiring about</span>
      <span class="font-semibold"> {{ vehicleName }}</span>
    </div>

    <template v-if="valuation">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="field-label" for="e-reg">Registration</label>
          <input id="e-reg" v-model.trim="form.registration" class="field uppercase" maxlength="8" placeholder="AB21 CDE" :aria-invalid="!!errors.registration" aria-describedby="e-reg-err" />
          <p id="e-reg-err" class="mt-1 text-xs text-red-700" v-if="errors.registration">{{ errors.registration }}</p>
        </div>
        <div>
          <label class="field-label" for="e-mileage">Mileage</label>
          <input id="e-mileage" v-model.trim="form.mileage" class="field" inputmode="numeric" placeholder="35000" :aria-invalid="!!errors.mileage" aria-describedby="e-mileage-err" />
          <p id="e-mileage-err" class="mt-1 text-xs text-red-700" v-if="errors.mileage">{{ errors.mileage }}</p>
        </div>
        <div>
          <label class="field-label" for="e-car">Make and model</label>
          <input id="e-car" v-model.trim="form.car" class="field" maxlength="100" placeholder="Volkswagen Golf" :aria-invalid="!!errors.car" aria-describedby="e-car-err" />
          <p id="e-car-err" class="mt-1 text-xs text-red-700" v-if="errors.car">{{ errors.car }}</p>
        </div>
        <div>
          <label class="field-label" for="e-finance">Finance outstanding?</label>
          <select id="e-finance" v-model="form.outstanding" class="field" :aria-invalid="!!errors.outstanding" aria-describedby="e-finance-err">
            <option value="">Please choose</option>
            <option>No</option>
            <option>Yes</option>
            <option>Not sure</option>
          </select>
          <p id="e-finance-err" class="mt-1 text-xs text-red-700" v-if="errors.outstanding">{{ errors.outstanding }}</p>
        </div>
      </div>
    </template>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="field-label" for="e-name">Full name</label>
        <input id="e-name" v-model.trim="form.name" class="field" autocomplete="name" maxlength="100" placeholder="Alex Taylor" :aria-invalid="!!errors.name" aria-describedby="e-name-err" />
        <p id="e-name-err" class="mt-1 text-xs text-red-700" v-if="errors.name">{{ errors.name }}</p>
      </div>
      <div>
        <label class="field-label" for="e-phone">Phone</label>
        <input id="e-phone" v-model.trim="form.phone" type="tel" class="field" autocomplete="tel" maxlength="30" placeholder="07700 900000" :aria-invalid="!!errors.phone" aria-describedby="e-phone-err" />
        <p id="e-phone-err" class="mt-1 text-xs text-red-700" v-if="errors.phone">{{ errors.phone }}</p>
      </div>
    </div>

    <div>
      <label class="field-label" for="e-email">Email</label>
      <input id="e-email" v-model.trim="form.email" type="email" class="field" autocomplete="email" maxlength="200" placeholder="alex@example.com" :aria-invalid="!!errors.email" aria-describedby="e-email-err" />
      <p id="e-email-err" class="mt-1 text-xs text-red-700" v-if="errors.email">{{ errors.email }}</p>
    </div>

    <div>
      <label class="field-label" for="e-subject">Enquiry about</label>
      <select id="e-subject" v-model="form.subject" class="field">
        <option v-for="option in subjects" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <div>
      <label class="field-label" for="e-message">Message</label>
      <textarea id="e-message" v-model.trim="form.message" rows="4" maxlength="2000" class="field resize-y" :placeholder="messagePlaceholder" :aria-invalid="!!errors.message" aria-describedby="e-message-err"></textarea>
      <p id="e-message-err" class="mt-1 text-xs text-red-700" v-if="errors.message">{{ errors.message }}</p>
    </div>

    <div>
      <label class="flex items-start gap-3 text-sm text-ink-soft">
        <input v-model="form.consent" type="checkbox" class="mt-0.5 h-4 w-4 accent-[rgb(194_65_12)]" :aria-invalid="!!errors.consent" aria-describedby="e-consent-err" />
        <span>
          I understand this is a demo and nothing will be sent. See the
          <RouterLink to="/privacy" class="underline underline-offset-2">privacy information</RouterLink>.
        </span>
      </label>
      <p id="e-consent-err" class="mt-1 text-xs text-red-700" v-if="errors.consent">{{ errors.consent }}</p>
    </div>

    <button type="submit" class="btn-accent w-full sm:w-auto sm:self-start">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="16" />
    </button>

    <p
      v-if="checked"
      ref="notice"
      role="status"
      tabindex="-1"
      class="rounded-control border border-line bg-paper-soft px-4 py-3 text-sm"
    >
      {{
        valuation
          ? 'Demo valuation request checked. Nothing has been sent, saved or valued. A real valuation needs an inspection, the car’s condition and any finance settlement.'
          : 'Demo enquiry checked. Nothing has been sent or saved, and no booking or credit application has been made.'
      }}
      You can edit the sample details and preview again.
    </p>
  </form>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { subjects } from '../../data/content'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    vehicleName?: string
    valuation?: boolean
    subject?: string
    defaultMessage?: string
    submitLabel?: string
    messagePlaceholder?: string
  }>(),
  {
    vehicleName: '',
    valuation: false,
    subject: 'General enquiry',
    defaultMessage: '',
    submitLabel: 'Preview enquiry',
    messagePlaceholder: 'How can we help?',
  },
)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: props.subject,
  message: props.defaultMessage,
  consent: false,
  registration: '',
  mileage: '',
  car: '',
  outstanding: '',
})
const errors = reactive<Record<string, string>>({})
const checked = ref(false)
const notice = ref<HTMLElement | null>(null)

function validate(): boolean {
  errors.name = form.name.length < 2 ? 'Please enter your name.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.phone =
    form.phone && form.phone.replace(/\D/g, '').length < 10 ? 'Enter a valid phone number, or leave it blank.' : ''
  errors.message = form.message.length < 10 ? 'Please add a little more detail.' : ''
  errors.consent = form.consent ? '' : 'Please confirm you understand this is a demo.'
  if (props.valuation) {
    errors.registration = form.registration.length < 2 ? 'Enter the registration.' : ''
    errors.mileage = /^\d{1,7}$/.test(form.mileage.replace(/,/g, '')) ? '' : 'Enter the mileage as a number.'
    errors.car = form.car.length < 2 ? 'Tell us the make and model.' : ''
    errors.outstanding = form.outstanding ? '' : 'Please choose an option.'
  }
  return Object.values(errors).every((message) => !message)
}

async function onSubmit() {
  checked.value = false
  if (!validate()) return
  checked.value = true
  await nextTick()
  notice.value?.focus()
}
</script>
