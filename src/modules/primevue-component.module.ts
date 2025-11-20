import type { App } from "vue"
import Button from "primevue/button"
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import CheckboxGroup from 'primevue/checkboxgroup'
import CascadeSelect from 'primevue/cascadeselect'
import ConfirmDialog from 'primevue/confirmdialog'
import Chip from 'primevue/chip'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Inplace from 'primevue/inplace'
import Menu from 'primevue/menu'
import MultiSelect from 'primevue/multiselect'
import Password from 'primevue/password'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import TreeSelect from 'primevue/treeselect'
import Toast from 'primevue/toast'

export function setPrimeComponents(app: App) {
    app.component('Button', Button),
    app.component('Card', Card),
    app.component('Checkbox', Checkbox),
    app.component('CheckboxGroup', CheckboxGroup),
    app.component('CascadeSelect', CascadeSelect),
    app.component('ConfirmDialog', ConfirmDialog),
    app.component('Chip', Chip),
    app.component('DatePicker', DatePicker),
    app.component('Dialog', Dialog),
    app.component('Divider', Divider),
    app.component('InputText', InputText),
    app.component('Inplace', Inplace),
    app.component('Menu', Menu),
    app.component('MultiSelect', MultiSelect),
    app.component('Password', Password),
    app.component('Select', Select),
    app.component('SelectButton', SelectButton),
    app.component('Textarea', Textarea),
    app.component('TreeSelect', TreeSelect),
    app.component('Toast', Toast)
}    