import { createApp } from 'vue'
import './style.css'
import pinia from './store/config'
import App from './App.vue'

createApp(App).use(pinia).mount('#app')
