import type { App } from "vue"
import Navbar from "@/components/Navbar/navbar.vue"
import ToggleThemeButton from "@/components/ToggleThemeButton/toggle-theme-button.vue"
import Calendar from "@/components/Calendar/calendar.vue"
import ModalEvent from "@/components/ModalEvent/modal-event.vue"

export function setComponents(app: App) {
    app.component('Navbar' ,Navbar),
    app.component('ToggleThemeButton', ToggleThemeButton),
    app.component('Calendar', Calendar),
    app.component('ModalEvent', ModalEvent)
}