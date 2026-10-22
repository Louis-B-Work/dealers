import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { installRangeSteppers } from './rangeSteppers'

createApp(App).use(router).mount('#app')
installRangeSteppers()
