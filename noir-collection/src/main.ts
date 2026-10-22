import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { installRangeSteppers } from './rangeSteppers'
import { vReveal } from './composables/reveal'

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
installRangeSteppers()
