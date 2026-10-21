<template>
  <form class="grid gap-5" novalidate :aria-label="formLabel" @submit.prevent="onSubmit">
    <p class="rounded-control border border-accent/30 bg-accent-soft/60 px-4 py-3 text-sm leading-relaxed text-ink-soft">
      <strong class="font-semibold text-ink">Design preview.</strong>
      This form checks your entries but sends and stores nothing. Please use sample details.
    </p>

    <p v-if="vehicleName" class="rounded-control border border-line px-4 py-3 text-sm">
      <span class="text-ink-muted">Regarding</span>
      <span class="font-display text-lg"> {{ vehicleName }}</span>
    </p>

    <div v-if="kind === 'valuation'" class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="field-label" for="f-reg">Registration</label>
        <input id="f-reg" v-model.trim="form.registration" class="field uppercase" maxlength="8" placeholder="AB21 CDE" :aria-invalid="!!errors.registration" aria-describedby="f-reg-err" />
        <p v-if="errors.registration" id="f-reg-err" class="mt-1.5 text-xs text-red-300">{{ errors.registration }}</p>
      </div>
      <div>
        <label class="field-label" for="f-mileage">Mileage</label>
        <input id="f-mileage" v-model.trim="form.mileage" class="field" inputmode="numeric" placeholder="18000" :aria-invalid="!!errors.mileage" aria-describedby="f-mileage-err" />
        <p v-if="errors.mileage" id="f-mileage-err" class="mt-1.5 text-xs text-red-300">{{ errors.mileage }}</p>
      </div>
      <div>
        <label class="field-label" for="f-car">Make and model</label>
        <input id="f-car" v-model.trim="form.car" class="field" maxlength="100" placeholder="Porsche Cayenne" :aria-invalid="!!errors.car" aria-describedby="f-car-err" />
        <p v-if="errors.car" id="f-car-err" class="mt-1.5 text-xs text-red-300">{{ errors.car }}</p>
      </div>
      <div>
        <label class="field-label" for="f-outstanding">Finance outstanding?</label>
        <select id="f-outstanding" v-model="form.outstanding" class="field" :aria-invalid="!!errors.outstanding" aria-describedby="f-outstanding-err">
          <option value="">Please choose</option>
          <option>No</option>
          <option>Yes</option>
          <option>Not sure</option>
        </select>
        <p v-if="errors.outstanding" id="f-outstanding-err" class="mt-1.5 text-xs text-red-300">{{ errors.outstanding }}</p>
      </div>
    </div>

    <div v-if="kind === 'viewing'" class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="field-label" for="f-date">Preferred date</label>
        <input id="f-date" v-model="form.date" type="date" class="field [color-scheme:dark]" :min="today" :aria-invalid="!!errors.date" aria-describedby="f-date-err" />
        <p v-if="errors.date" id="f-date-err" class="mt-1.5 text-xs text-red-300">{{ errors.date }}</p>
      </div>
      <div>
        <label class="field-label" for="f-time">Preferred time</label>
        <select id="f-time" v-model="form.time" class="field">
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Early evening</option>
        </select>
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="field-label" for="f-name">Full name</label>
        <input id="f-name" v-model.trim="form.name" class="field" autocomplete="name" maxlength="100" placeholder="Alex Taylor" :aria-invalid="!!errors.name" aria-describedby="f-name-err" />
        <p v-if="errors.name" id="f-name-err" class="mt-1.5 text-xs text-red-300">{{ errors.name }}</p>
      </div>
      <div>
        <label class="field-label" for="f-phone">Phone <span class="normal-case tracking-normal">(optional)</span></label>
        <input id="f-phone" v-model.trim="form.phone" type="tel" class="field" autocomplete="tel" maxlength="30" placeholder="07700 900000" :aria-invalid="!!errors.phone" aria-describedby="f-phone-err" />
        <p v-if="errors.phone" id="f-phone-err" class="mt-1.5 text-xs text-red-300">{{ errors.phone }}</p>
      </div>
    </div>

    <div>
      <label class="field-label" for="f-email">Email</label>
      <input id="f-email" v-model.trim="form.email" type="email" class="field" autocomplete="email" maxlength="200" placeholder="alex@example.com" :aria-invalid="!!errors.email" aria-describedby="f-email-err" />
      <p v-if="errors.email" id="f-email-err" class="mt-1.5 text-xs text-red-300">{{ errors.email }}</p>
    </div>

    <div v-if="kind === 'enquiry'">
      <label class="field-label" for="f-subject">Regarding</label>
      <select id="f-subject" v-model="form.subject" class="field">
        <option v-for="option in subjects" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <div>
      <label class="field-label" for="f-message">Message</label>
      <textarea id="f-message" v-model.trim="form.message" rows="4" maxlength="2000" class="field resize-y" :placeholder="messagePlaceholder" :aria-invalid="!!errors.message" aria-describedby="f-message-err"></textarea>
      <p v-if="errors.message" id="f-message-err" class="mt-1.5 text-xs text-red-300">{{ errors.message }}</p>
    </div>

    <div>
      <label class="flex items-start gap-3 text-sm text-ink-soft">
        <input v-model="form.consent" type="checkbox" class="mt-0.5 h-4 w-4 accent-[rgb(201_169_110)]" :aria-invalid="!!errors.consent" aria-describedby="f-consent-err" />
        <span>
          I understand this is a demo and nothing will be sent. See the
          <RouterLink to="/privacy" class="text-ink underline underline-offset-4">privacy information</RouterLink>.
        </span>
      </label>
      <p v-if="errors.consent" id="f-consent-err" class="mt-1.5 text-xs text-red-300">{{ errors.consent }}</p>
    </div>

    <button type="submit" class="btn-accent w-full sm:w-auto sm:justify-self-start">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="15" />
    </button>

    <p v-if="checked" ref="notice" role="status" tabindex="-1" class="rounded-control border border-accent/50 bg-accent-soft/60 px-4 py-3 text-sm leading-relaxed">
      {{ notices[kind] }} You can edit the sample details and preview again.
    </p>
  </form>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { subjects } from '../../data/content'
import AppIcon from './AppIcon.vue'

type FormKind = 'enquiry' | 'viewing' | 'valuation'

const props = withDefaults(
  defineProps<{
    kind?: FormKind
    vehicleName?: string
    subject?: string
    defaultMessage?: string
    submitLabel?: string
    messagePlaceholder?: string
  }>(),
  {
    kind: 'enquiry',
    vehicleName: '',
    subject: 'General enquiry',
    defaultMessage: '',
    submitLabel: 'Preview enquiry',
    messagePlaceholder: 'How can we help?',
  },
)

const formLabel = computed(
  () => ({ enquiry: 'Enquiry', viewing: 'Private viewing request', valuation: 'Valuation request' })[props.kind],
)
const notices: Record<FormKind, string> = {
  enquiry: 'Demo enquiry checked. Nothing has been sent or saved, and no booking or credit application has been made.',
  viewing: 'Demo viewing request checked. Nothing has been sent or saved, and no appointment has been booked.',
  valuation:
    'Demo valuation request checked. Nothing has been sent, saved or valued. A real valuation needs an inspection, the car’s condition and any finance settlement.',
}

// Local date, so "today" is correct for UK users late in the evening.
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

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
  date: '',
  time: 'Morning',
})
const errors = reactive<Record<string, string>>({})
const checked = ref(false)
const notice = ref<HTMLElement | null>(null)

function validate(): boolean {
  for (const key of Object.keys(errors)) errors[key] = ''
  errors.name = form.name.length < 2 ? 'Please enter your name.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.phone =
    form.phone && form.phone.replace(/\D/g, '').length < 10 ? 'Enter a valid phone number, or leave it blank.' : ''
  errors.message = form.message.length < 10 ? 'Please add a little more detail.' : ''
  errors.consent = form.consent ? '' : 'Please confirm you understand this is a demo.'
  if (props.kind === 'valuation') {
    errors.registration = form.registration.length < 2 ? 'Enter the registration.' : ''
    errors.mileage = /^\d{1,7}$/.test(form.mileage.replace(/,/g, '')) ? '' : 'Enter the mileage as a number.'
    errors.car = form.car.length < 2 ? 'Tell us the make and model.' : ''
    errors.outstanding = form.outstanding ? '' : 'Please choose an option.'
  }
  if (props.kind === 'viewing') {
    errors.date = !form.date ? 'Choose a preferred date.' : form.date < today ? 'Choose a date from today onwards.' : ''
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
