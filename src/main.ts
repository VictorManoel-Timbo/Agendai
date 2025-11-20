import '@/style.sass'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { PrimeVue } from '@primevue/core'
import { setPrimeComponents } from './modules/primevue-component.module'
import { setComponents } from './modules/component.module'
import { setMyPreset } from './assets/preset'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import { setIcons } from './modules/icon-component.module'

const app = createApp(App)
const MyPreset = setMyPreset()

setPrimeComponents(app)
setComponents(app)
setIcons(app)

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
})

app.use(ToastService)
app.use(DialogService)
app.use(router)

app.mount('#app')
