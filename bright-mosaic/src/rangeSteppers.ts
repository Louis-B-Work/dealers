// Adds − / + buttons under every range slider so values can be nudged precisely.
// A press steps once; holding repeats (and speeds up) until the pointer is released.
// The slider is left where Vue put it: the buttons are inserted as a sibling and
// drive the slider through ordinary `input` events, so v-model keeps working.

const HOLD_DELAY_MS = 380
const REPEAT_START_MS = 110
const REPEAT_MIN_MS = 35

function nudge(range: HTMLInputElement, direction: 1 | -1) {
  const step = parseFloat(range.step) || 1
  const min = range.min === '' ? 0 : parseFloat(range.min)
  const max = range.max === '' ? 100 : parseFloat(range.max)
  const current = parseFloat(range.value) || 0
  const next = Math.min(max, Math.max(min, Math.round((current + direction * step) / step) * step))
  if (next === current) return false
  range.value = String(next)
  range.dispatchEvent(new Event('input', { bubbles: true }))
  range.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

function makeButton(range: HTMLInputElement, direction: 1 | -1) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'range-step-btn'
  button.textContent = direction === 1 ? '+' : '−'
  const label = range.getAttribute('aria-label') ?? range.labels?.[0]?.firstChild?.textContent?.trim() ?? 'slider value'
  button.setAttribute('aria-label', `${direction === 1 ? 'Increase' : 'Decrease'} ${label}`.trim())

  let holdTimer: number | undefined
  let repeatTimer: number | undefined
  const stop = () => {
    window.clearTimeout(holdTimer)
    window.clearTimeout(repeatTimer)
  }
  const repeat = (delay: number) => {
    repeatTimer = window.setTimeout(() => {
      nudge(range, direction)
      repeat(Math.max(REPEAT_MIN_MS, delay * 0.9))
    }, delay)
  }

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    button.setPointerCapture?.(event.pointerId)
    nudge(range, direction)
    holdTimer = window.setTimeout(() => repeat(REPEAT_START_MS), HOLD_DELAY_MS)
  })
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave']) {
    button.addEventListener(type, stop)
  }
  button.addEventListener('contextmenu', (event) => event.preventDefault())
  // Keyboard activation arrives as a click with no pointer (detail 0).
  button.addEventListener('click', (event) => {
    if (event.detail === 0) nudge(range, direction)
  })
  return button
}

function enhance(range: HTMLInputElement) {
  if (range.dataset.steppers) return
  range.dataset.steppers = 'true'
  const row = document.createElement('div')
  row.className = 'range-steps'
  row.append(makeButton(range, -1), makeButton(range, 1))
  range.after(row)
}

function scan(root: ParentNode) {
  root.querySelectorAll<HTMLInputElement>('input[type="range"]:not([data-steppers])').forEach(enhance)
  // Drop button rows whose slider has been removed by a route change.
  document.querySelectorAll('.range-steps').forEach((row) => {
    if (!(row.previousElementSibling as HTMLInputElement | null)?.matches?.('input[type="range"]')) row.remove()
  })
}

export function installRangeSteppers() {
  scan(document)
  new MutationObserver(() => scan(document)).observe(document.body, { childList: true, subtree: true })
}
