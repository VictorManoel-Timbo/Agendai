import type { App } from "vue";
import Button from "primevue/button"

export function setExemplo(app: App) {
    app.component('Button', Button)
}