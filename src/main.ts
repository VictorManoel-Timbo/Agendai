import '@/style.sass'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { PrimeVue } from '@primevue/core'
import Aura from '@primeuix/themes/aura'
import { setExemplo } from './modules/exemplo.module'

const app = createApp(App)

setExemplo(app)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.my-app-dark',
            cssLayer: false
        }
    }
})

app.use(router)

app.mount('#app')
