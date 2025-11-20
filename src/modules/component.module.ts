import type { App } from "vue"
import Navbar from "@/components/Navbar/navbar.vue"
import ToggleThemeButton from "@/components/ToggleThemeButton/toggle-theme-button.vue"

export function setComponents(app: App) {
    app.component('Navbar' ,Navbar),
    app.component('ToggleThemeButton', ToggleThemeButton)
}