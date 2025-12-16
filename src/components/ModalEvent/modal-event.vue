<script lang="ts">
import { defineComponent, type PropType } from "vue"
import { JournalEventOcurrence } from "@/models/event.model"
import { JournalEventService } from "@/views/event.service"

interface SelectButtonContext {
    index: number
    active: boolean
}

interface DayOfWeek {
    label: string
    value: number | string
}

type Participant = {
    id_convidado: number
    id_usuario: number
    nome: string
    email: string
}

type RecorrenciaTipo = 'unico' | 'diario' | 'semanal' | 'diario_uteis' | null

type EventForm = {
    nome: string,
    descricao: string,
    categoria: string,
    data_inicio: Date | null,
    data_termino: Date | null,
    horario_inicio: Date | null,
    horario_termino: Date | null,
    local_padrao: string,
    recorrencia: RecorrenciaTipo,
    hours: DayOfWeek[],
    daysOfWeek: DayOfWeek[]
}

type Periodo = 'manha' | 'tarde' | 'noite' | null

type Disciplina = {
    horario: string,
    nome: string
}

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        eventToEdit: {
            type: Object as PropType<any> | null,
            required: false
        }
    },
    emits: ["close", "saved"],
    data() {
        return {
            eventForm: {} as EventForm,
            evento: new JournalEventOcurrence(),
            disciplina: {} as Disciplina | null,
            eventPeriod: null as Periodo,
            recurrenceOptions: [
                { label: "Única", value: "unico" },
                { label: "Diário", value: "diario" },
                { label: "Semanal", value: "semanal" },
                { label: "Dias Utéis", value: "diario_uteis" },
            ],
            categories: [
                { label: 'Disciplina', value: 'disciplina' },
                { label: 'Particular', value: 'particular' },
            ],
            hourOptions: [
                { label: "A", value: 0 },
                { label: "B", value: 1 },
                { label: "C", value: 2 },
                { label: "D", value: 3 },
                { label: "E", value: 4 },
                { label: "F", value: 5 },
            ],
            daysOfWeekOptions: [
                { label: "Dom", value: 1 },
                { label: "Seg", value: 2 },
                { label: "Ter", value: 3 },
                { label: "Qua", value: 4 },
                { label: "Qui", value: 5 },
                { label: "Sex", value: 6 },
                { label: "Sáb", value: 7 },
            ],
            isTeacher: true,
            emailsParticipants: [] as Participant[],
            currentEmailInput: '',
            emailInputError: '',
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        }
    },
    mounted() {
        this.evento.email_proprietario = this.email
        this.setCategories()
    },
    computed: {
        recorrencePT() {
            return {
                root: "flex w-full",
                button: ({ context }: { context: SelectButtonContext }) => ({
                    class: [
                        "flex-1 py-3 text-md font-semibold border-1",
                        "transition-all duration-200 ease-in-out rounded-lg",
                        context.active
                            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200",
                        context.index === 0 ? "rounded-r-none" : "rounded-l-none",
                    ],
                }),
            }
        },
        daysWeekPT() {
            return {
                root: "flex w-full",

                button: ({ context }: { context: SelectButtonContext }) => ({
                    class: [
                        "flex-1 py-3 text-md font-semibold border-1",

                        "transition-all duration-200 ease-in-out rounded-lg",

                        context.active
                            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200",
                    ],
                }),
            }
        },
        periodOptions() {
            return [
                { label: 'Manhã', value: 'manha' },
                { label: 'Tarde', value: 'tarde' },
                { label: 'Noite', value: 'noite' },
            ]
        },
        service(): JournalEventService {
            return new JournalEventService()
        },
        isEditing(): boolean {
            return !!this.eventToEdit && !!this.eventToEdit.id
        },
        isDisciplina(): boolean {
            return this.eventForm.categoria === 'disciplina'
        },
    },
    watch: {
        "eventForm.data_inicio"(newVal: Date | null) {
            if (this.eventForm.recorrencia === "unico" && newVal) {
                this.eventForm.data_termino = newVal
            }
        },
        "eventForm.recorrencia"(newType: RecorrenciaTipo) {
            if (newType === "unico") {
                this.eventForm.data_termino = this.eventForm.data_inicio;
            } else {
                if (this.eventForm.data_termino === this.eventForm.data_inicio) {
                    this.eventForm.data_termino = null
                }
            }
        },
        "eventForm.categoria"(newVal: string) {
            if (newVal === 'particular') {
                this.eventForm.recorrencia = 'unico'
            }
            if (newVal === 'disciplina') {
                this.eventForm.recorrencia = 'semanal'
            }
        },
        eventPeriod(newPeriod: Periodo) {
            if (this.isDisciplina && newPeriod) {
                this.eventForm.horario_inicio = this.getStartTimeByPeriod(newPeriod)
                this.eventForm.horario_termino = this.getEndTimeByPeriod(newPeriod)
            }
            if (newPeriod === 'noite') {
                const blocosNoturnosInvalidos = ['E', 'F']
                const deveLimparBlocos = this.eventForm.hours.some(
                    (hour) => blocosNoturnosInvalidos.includes(hour.label)
                )

                if (deveLimparBlocos) {
                    this.eventForm.hours = this.eventForm.hours.filter(
                        (hour) => !blocosNoturnosInvalidos.includes(hour.label)
                    )
                    console.warn('Blocos E e F removidos, pois não são permitidos no período noturno.')
                }
            }
        },
        visible(newVal: boolean) {
            if (newVal) {
                this.getEvent(this.eventToEdit.id)
            }
        },
    },
    methods: {
        getStartTimeByPeriod(period: Periodo): Date | null {
            if (!period) return null
            const date = new Date()
            date.setHours(0, 0, 0, 0)

            if (period === 'manha') {
                date.setUTCHours(7, 0, 0, 0)
            } else if (period === 'tarde') {
                date.setUTCHours(13, 0, 0, 0)
            } else if (period === 'noite') {
                date.setUTCHours(18, 0, 0, 0)
            }
            return date
        },
        getEndTimeByPeriod(period: Periodo): Date | null {
            if (!period) return null
            const date = new Date()
            date.setHours(0, 0, 0, 0)

            if (period === 'manha') {
                date.setUTCHours(12, 59, 59, 0) 
            } else if (period === 'tarde') {
                date.setUTCHours(17, 59, 59, 0) 
            } else if (period === 'noite') {
                date.setUTCHours(22, 59, 59, 0) 
            }
            return date
        },
        getEvent(id: number): void {
            if (id) {
                this.service.event.pipe().subscribe({
                    next: (response) => {
                        this.eventForm = response
                        this.eventForm.horario_inicio = this.parseTime(response.horario_inicio)
                        this.eventForm.horario_termino = this.parseTime(response.horario_termino)
                        if (response) {
                            this.getParticipants()
                        }
                    }
                })
                this.service.getDetailEvent(id)
            } else {
                this.resetForm()
            }
        },
        parseTime(timeString: string | Date): Date | null {
            if (!timeString) return null
            if (timeString instanceof Date) return timeString

            const partes = timeString.split(':')

            if (partes.length < 2) return null

            const [hoursStr, minutesStr] = partes
            const hours = parseInt(hoursStr)
            const minutes = parseInt(minutesStr)

            if (isNaN(hours) || isNaN(minutes)) return null

            const date = new Date()

            date.setHours(0, 0, 0, 0)
            date.setUTCHours(hours, minutes, 0, 0)

            return date
        },
        resetForm(): void {
            this.eventForm = this.getInitialEventForm()
            this.setCategories()
            this.evento = new JournalEventOcurrence()
            this.evento.email_proprietario = this.email
            this.eventPeriod = null
            this.emailsParticipants = []
        },
        save(): void {
            if (this.isDisciplina && this.eventPeriod) {
                this.eventForm.horario_inicio = this.getStartTimeByPeriod(this.eventPeriod)
                this.eventForm.horario_termino = this.getEndTimeByPeriod(this.eventPeriod)
            }

            const inicio = this.formatTimeUtc(this.eventForm.horario_inicio!)
            const termino = this.formatTimeUtc(this.eventForm.horario_termino!)
            this.evento = {
                ...this.eventForm,
                id_universidade: 1,
                data_inicio: this.eventForm.data_inicio?.toISOString(),
                data_termino: this.eventForm.data_termino?.toISOString(),
                horario_inicio: inicio,
                horario_termino: termino
            }

            if (this.eventForm.categoria === 'disciplina') {
                const horarioDisciplina = this.buildScheduleString()

                this.disciplina = {
                    nome: this.eventForm.nome,
                    horario: horarioDisciplina
                }
            } else {
                this.disciplina = null
            }
            const payload: { evento: JournalEventOcurrence, disciplina: Disciplina | null } = {
                evento: this.evento,
                disciplina: this.disciplina
            }

            this.service.event.pipe().subscribe({
                next: (response) => {}
            })
            this.service.create(payload)
            this.$emit("saved")
            this.resetForm()
        },
        update(): void {
            const inicio = this.formatTimeUtc(this.eventForm.horario_inicio!)
            const termino = this.formatTimeUtc(this.eventForm.horario_termino!)
            const eventUptade = {
                local: this.eventForm.local_padrao,
                data: null,
                horario_inicio: inicio,
                horario_termino: termino
            }

            this.service.event.pipe().subscribe({
                next: (response) => { }
            })
            this.service.updateOcurrenceDateEvent(
                this.eventToEdit.id,
                this.eventToEdit.date,
                eventUptade
            )
            this.$emit("saved")
        },
        close(): void {
            this.resetForm()
            this.$emit("close")
        },
        setCategories(): void {
            const role: string | string[] = this.$route?.params?.role
            if (role === 'universidade') {
                this.eventForm.categoria = 'institucional'
                this.isTeacher = false
            }
            if (role === 'aluno') {
                this.eventForm.categoria = 'particular'
                this.isTeacher = false
            }
        },
        formatTimeUtc(date: Date): string | null {
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            const seconds = date.getUTCSeconds()
            const milliseconds = date.getUTCMilliseconds()

            const pad = (num: number, length: number = 2) => String(num).padStart(length, '0')

            const formattedHours = pad(hours)
            const formattedMinutes = pad(minutes)
            const formattedSeconds = pad(seconds)
            const formattedMilliseconds = pad(milliseconds, 3)

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}Z`
        },
        getInitialEventForm(): EventForm {
            return {
                nome: "",
                descricao: "",
                categoria: "",
                data_inicio: null,
                data_termino: null,
                horario_inicio: null,
                horario_termino: null,
                local_padrao: "",
                recorrencia: "unico",
                hours: [],
                daysOfWeek: []
            }
        },
        getParticipants(): void {
            this.service.participants.pipe().subscribe({
                next: (response) => {
                    this.emailsParticipants = response
                }
            })
            this.service.getEventParticipants(this.eventToEdit.id)
        },
        addParticipant(id: number, email: string): void {
            this.service.participants.pipe().subscribe({
                next: () => { }
            })
            this.service.addParticipant(id, email)
        },
        setParticipant(): void {
            const email = this.currentEmailInput.trim().toLowerCase()
            this.emailInputError = ''

            if (!email) {
                return
            }
            if (!this.emailRegex.test(email)) {
                this.emailInputError = 'Formato de e-mail inválido.'
                return
            }
            if (this.emailsParticipants.some(p => p.email === email)) {
                this.emailInputError = 'Este e-mail já foi adicionado.'
                return
            }

            const newParticipant: Participant = {
                id_convidado: 0,
                id_usuario: 0,
                nome: '',
                email: email
            }

            if (this.isEditing) {
                this.addParticipant(this.eventToEdit.id, email)
            }

            this.emailsParticipants.push(newParticipant)
            this.currentEmailInput = ''
        },
        removeParticipant(email: string): void {
            this.emailsParticipants = this.emailsParticipants.filter(
                (participant) => participant.email !== email
            )
            if (this.isEditing) {
                this.service.participants.pipe().subscribe({
                    next: () => { }
                })
                this.service.removeParticipant(this.eventToEdit.id, email)
            }
        },
        buildScheduleString(): string {
            if (!this.eventForm.daysOfWeek || this.eventForm.daysOfWeek.length === 0) {
                return ''
            }

            const diasStr = this.eventForm.daysOfWeek
                .map(day => day.value)
                .sort((a, b) => (a as number) - (b as number))
                .join('')
            let periodo: string
            let blocosPermitidos: string[] = []

            if (this.isDisciplina) {
                if (!this.eventPeriod) return ''
                periodo = this.eventPeriod
            } else {
                const horarioInicio = this.eventForm.horario_inicio

                if (!horarioInicio) {
                    return ''
                }

                const horaInicio = horarioInicio.getHours()

                if (horaInicio >= 7 && horaInicio < 13) {
                    periodo = 'manha'
                } else if (horaInicio >= 13 && horaInicio < 18) {
                    periodo = 'tarde'
                } else if (horaInicio >= 18 && horaInicio < 23) {
                    periodo = 'noite'
                } else {
                    return ''
                }
            }
            if (periodo === 'noite') {
                blocosPermitidos = ['A', 'B', 'C', 'D']
            } else {
                blocosPermitidos = ['A', 'B', 'C', 'D', 'E', 'F']
            }

            if (!this.eventForm.hours || this.eventForm.hours.length === 0) {
                return ''
            }

            const blocosValidos = this.eventForm.hours.filter(day =>
                blocosPermitidos.includes(day.label)
            )

            if (blocosValidos.length === 0) {
                return `${diasStr}--${periodo}`
            }

            const blocosStr = blocosValidos
                .map(day => day.label)
                .sort()
                .join('')

            return `${diasStr}-${blocosStr}-${periodo}`
        }
    }
})
</script>

<template>
    <Dialog :visible="visible" @update:visible="close()" modal appendTo="body" :style="{ width: '34rem' }"
        :draggable="false">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <span class="text-xl font-bold">{{ isEditing ? 'Editar Evento' : 'Novo Evento' }}</span>
            </div>
        </template>

        <div class="flex flex-col gap-6 px-4 py-2">
            <div class="flex flex-col gap-2">
                <label for="nome" class="text-sm font-semibold">Nome do Evento:</label>

                <InputText id="nome" v-model="eventForm.nome" class="w-full py-3"
                    :disabled="isEditing ? true : false" />
            </div>

            <div class="flex flex-col gap-2">
                <template v-if="isDisciplina && isTeacher">
                    <label class="text-sm font-semibold">Período da Disciplina:</label>

                    <SelectButton v-model="eventPeriod" :options="periodOptions" optionLabel="label"
                        :disabled="isEditing ? true : false" optionValue="value" class="w-full" :pt="recorrencePT"
                        fluid />
                </template>

                <template v-else>
                    <label class="text-sm font-semibold">Horário:</label>

                    <div class="flex items-center gap-2">
                        <DatePicker v-model="eventForm.horario_inicio" timeOnly showIcon iconDisplay="input"
                            class="w-1/2 text-center">
                            <template #inputicon="slotProps">
                                <i class="pi pi-clock" @click="slotProps.clickCallback" />
                            </template>
                        </DatePicker>

                        <span class="text-xl font-light text-gray-400">—</span>

                        <DatePicker v-model="eventForm.horario_termino" timeOnly showIcon iconDisplay="input"
                            class="w-1/2 text-center">
                            <template #inputicon="slotProps">
                                <i class="pi pi-clock" @click="slotProps.clickCallback" />
                            </template>
                        </DatePicker>
                    </div>
                </template>
            </div>
            <div v-if="isTeacher" class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Categoria:</label>

                <SelectButton v-model="eventForm.categoria" :options="categories" optionLabel="label"
                    :disabled="isEditing ? true : false" optionValue="value" class="w-full" :pt="recorrencePT" fluid />
            </div>

            <div v-if="eventForm.categoria !== 'disciplina'" class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Recorrência:</label>

                <SelectButton v-model="eventForm.recorrencia" :options="recurrenceOptions" optionLabel="label"
                    :disabled="isEditing ? true : false" optionValue="value" class="w-full" :pt="recorrencePT" fluid />
            </div>

            <div v-if="eventForm.recorrencia === 'unico'" class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Dia:</label>

                <DatePicker v-model="eventForm.data_inicio" dateFormat="dd/mm/yy" showIcon :manualInput="false"
                    :disabled="isEditing ? true : false" appendTo="body" panelStyleClass="modal-calendar"
                    :touchUI="false" class="w-full" :input-class="'w-full py-3'" />
            </div>

            <div v-if="isDisciplina" class="flex flex-col gap-6">
                <div v-if="isTeacher" class="flex flex-col gap-2">
                    <label class="text-sm font-semibold">Dias da Semana:</label>
                    <SelectButton v-model="eventForm.daysOfWeek" :options="daysOfWeekOptions" optionLabel="label"
                        :disabled="isEditing ? true : false" multiple class="w-full" :pt="daysWeekPT" fluid />
                </div>

                <div v-if="isTeacher" class="flex flex-col gap-2">
                    <label class="text-sm font-semibold">Blocos de Horário:</label>
                    <SelectButton v-model="eventForm.hours" :options="hourOptions" optionLabel="label" multiple
                        :disabled="isEditing ? true : false" class="w-full" :pt="daysWeekPT" fluid />
                </div>

                
            </div>
            
            <div v-if="eventForm.recorrencia !== 'unico'" class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Período:</label>

                <div class="flex items-center gap-2">
                    <DatePicker v-model="eventForm.data_inicio" dateFormat="dd/mm/yy" showIcon :manualInput="false"
                        :disabled="isEditing ? true : false" appendTo="body" panelStyleClass="modal-calendar"
                        :touchUI="false" class="w-full" :input-class="'w-full py-3'" />

                    <span class="text-xl font-light text-gray-400">—</span>

                    <DatePicker v-model="eventForm.data_termino" dateFormat="dd/mm/yy" showIcon :manualInput="false"
                        :disabled="isEditing ? true : false" appendTo="body" panelStyleClass="modal-calendar"
                        :touchUI="false" class="w-full" :input-class="'w-full py-3'" />
                </div>
            </div>
            
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Local:</label>

                <InputText v-model="eventForm.local_padrao" class="w-full py-3" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Descrição:</label>

                <Textarea v-model="eventForm.descricao" class="w-full py-3" rows="5"
                    :disabled="isEditing ? true : false" />
            </div>

            <div v-if="isEditing" class="flex flex-col gap-2">
                <label class="text-sm font-semibold">Participantes:</label>

                <div class="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg min-h-10">
                    <Chip v-for="participant in emailsParticipants" :key="participant.id_convidado"
                        :label="participant.email" removable @remove="removeParticipant(participant.email)"
                        class="bg-gray-200 text-gray-700 text-sm font-medium" />

                    <InputText v-model="currentEmailInput" @keydown.enter.prevent="setParticipant"
                        @blur="setParticipant" type="email" placeholder="Adicionar e-mail..."
                        class="p-2 border-none focus:ring-0 flex-1 min-w-[150px]" />

                </div>

                <small v-if="emailInputError" class="text-red-500">{{ emailInputError }}</small>
            </div>
            <div v-if="isTeacher" class="flex flex-col gap-2">
            </div>

            <div class="flex justify-center mt-4">
                <Button :label="isEditing ? 'Salvar Alterações' : 'Criar Evento'"
                    class="w-full py-3 text-lg font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:shadow-none"
                    @click="isEditing ? update() : save()" />
            </div>
        </div>
    </Dialog>
</template>
