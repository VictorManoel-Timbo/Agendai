import type { App } from "vue"
import { OhVueIcon, addIcons } from "oh-vue-icons"
import * as PrIcons from "oh-vue-icons/icons/pr"

const icons = Object.values({
    ...PrIcons,
})

addIcons(...icons)

export function setIcons(app: App) {
    app.component('v-icon', OhVueIcon)
}