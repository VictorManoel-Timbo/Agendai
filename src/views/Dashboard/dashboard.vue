<script lang="ts">
import { defineComponent } from 'vue'
import { User } from '@/models/user.model'
import { UserService } from '../user.service'
import { JournalEventService } from '../event.service'
import type { JournalEvent } from '@/models/event.model'

type EventToEdit = { id: number | null, date: string }

export default defineComponent({
    data() {
        return {
            currentDate: new Date(),
            dateFilter: '',
            selectedCategory: '',
            data: new User(),
            dayEvents: [] as JournalEvent[],
            showFilterMenu: false,
            filterNodes: [
                {
                    key: '0',
                    label: 'Institucional',
                    icon: 'pi pi-fw pi-globe'
                },
                {
                    key: '1',
                    label: 'Disciplina',
                    icon: 'pi pi-fw pi-book'
                },
                {
                    key: '2',
                    label: 'Particular',
                    icon: 'pi pi-fw pi-user'
                }
            ],
            showCreateEventModal: false,
            eventToEdit: {
                id: 0,
                date: ''
            } as EventToEdit,
        }
    },
    mounted() {
        this.handleDateUpdate(new Date())
        this.getUser()
    },
    methods: {
        openCreateEvent(id?: number) {
            this.eventToEdit.id = id!
            this.showCreateEventModal = true
        },
        closeCreateEvent() {
            this.showCreateEventModal = false
            this.eventToEdit.id = null
        },
        onEventSaved() {
            this.showCreateEventModal = false
            this.getEvents({ data: this.dateFilter, categoria: this.selectedCategory })
        },
        getUser(): void {
            this.userService.user.pipe().subscribe({
                next: (response) => {
                    this.data = response
                },
            })
            this.userService.getUser()
        },
        getEvents(params?: { data?: string, categoria?: string }): void {
            const finalParams: { data?: string, categoria?: string } = { data: params?.data }

            if (params?.categoria && params.categoria !== '') {
                finalParams.categoria = params.categoria
            }

            this.eventService.event.pipe().subscribe({
                next: (response) => {
                    this.dayEvents = response
                }
            })
            this.eventService.getEvents(finalParams)
        },
        handleDateUpdate(newDate: Date): void {
            this.currentDate = newDate

            const year = newDate.getFullYear()
            const month = String(newDate.getMonth() + 1).padStart(2, '0')
            const day = String(newDate.getDate()).padStart(2, '0')

            this.dateFilter = `${year}-${month}-${day}`
            this.eventToEdit.date = this.dateFilter
            this.getEvents({ data: this.dateFilter, categoria: this.selectedCategory })
        },
        toggleFilterMenu(): void {
            this.showFilterMenu = !this.showFilterMenu
        },
        onNodeSelect(node: any): void {
            this.selectedCategory = node.label
            this.showFilterMenu = false

            this.getEvents({ data: this.dateFilter, categoria: this.selectedCategory })
        },
        removeFilter(): void {
            this.selectedCategory = ''
            this.getEvents({ data: this.dateFilter, categoria: this.selectedCategory })
        },
        setIconEvent(event: JournalEvent): string {
            const icon: Record<string, string> = {
                'particular': 'pr-user',
                'institucional': 'pr-globe',
                'disciplina': 'pr-book',
            }
            const categoryKey = event.categoria?.toLowerCase() ?? ''
            return icon[categoryKey] ?? 'pr-question'
        },
        setBackgroundIconEvent(event: JournalEvent): string {
            const background: Record<string, string> = {
                'particular': 'bg-fuchsia-600',
                'institucional': 'bg-green-600',
                'disciplina': 'bg-blue-600',
            }
            const categoryKey = event.categoria?.toLowerCase() ?? ''
            return background[categoryKey] ?? 'bg-primary-500'
        },
        formatHours(hour: string) {
            const parsed = this.parseHourToParts(hour)

            if (!parsed) {
                return hour || ''
            }

            const { localHours, localMinutes } = this.convertTimeToLocal(parsed.hours, parsed.minutes)
            const pad = (num: number) => String(num).padStart(2, '0')

            return `${pad(localHours)}:${pad(localMinutes)}H`
        },
        convertTimeToLocal(utcHours: number, utcMinutes: number): { localHours: number, localMinutes: number } {
            const date = new Date()

            date.setHours(0, 0, 0, 0)
            date.setUTCHours(utcHours, utcMinutes, 0, 0)
            const localHours = date.getHours()
            const localMinutes = date.getMinutes()

            return { localHours, localMinutes }
        },
        parseHourToParts(hour: string): { hours: number, minutes: number } | null {
            if (!hour || typeof hour !== 'string') {
                return null
            }

            const partes = hour.split(':')
        
            if (partes.length < 2) {
                return null
            }

            const [horasStr, minutosStr] = partes
            const horas = parseInt(horasStr)
            const minutos = parseInt(minutosStr)

            if (isNaN(horas) || isNaN(minutos)) {
                return null
            }
            if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
                return null
            }

            return { hours: horas, minutes: minutos }
        }
    },
    computed: {
        userService(): UserService {
            return new UserService()
        },
        eventService(): JournalEventService {
            return new JournalEventService()
        },
        displayWeekday(): string {
            const date = this.currentDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
            return date.charAt(0).toUpperCase() + date.slice(1)
        },
        displayDay(): string {
            return this.currentDate.getDate().toString()
        }
    }
})
</script>

<template>
    <main class="items-start justify-center overflow-y-auto lg:overflow-hidden flex-col-reverse gap-4 px-4">

        <section class="flex flex-col gap-12 min-h-screen h-full w-full lg:w-3/4 lg:pr-[1.5vw] py-6">

            <div class="text-center mb-10">
                <div class="mb-3 font-semibold ">
                    <h3 class="text-2xl">{{ displayWeekday }}</h3>
                    <h2 class="text-4xl">{{ displayDay }}</h2>
                </div>
            </div>

            <div
                class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center justify-between relative gap-4 sm:gap-0 lg:gap-4">

                <div class="flex justify-between items-center min-w-fit w-full max-w-1/2 sm:gap-4">
                    <h2 class="font-bold text-2xl">Eventos de hoje</h2>

                    <Button class="!px-2 !sm:px-3 w-fit h-12" @click="openCreateEvent()">
                        <span>Novo evento</span>
                        <v-icon name="pr-plus" scale="1.5" />
                    </Button>
                </div>

                <div class="relative w-full flex justify-start sm:justify-end lg:justify-start">
                    <div class="flex flex-row sm:flex-row-reverse lg:flex-row gap-8 2xl:gap-16 items-center min-h-11">
                        <v-icon name="pr-filter" scale="1.5" class="cursor-pointer" @click="toggleFilterMenu" />
                        <Chip v-if="selectedCategory" :label="selectedCategory"
                            :pt="{ root: 'border border-gray-300 dark:border-gray-700' }" removable
                            @remove="removeFilter" />
                    </div>
                    <transition name="slide-down">
                        <div v-if="showFilterMenu"
                            class="absolute left-0 sm:left-auto lg:left-0 sm:right-0 top-full z-10 mt-2 p-1 w-fit bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                            <Tree :value="filterNodes" selectionMode="single" @nodeSelect="onNodeSelect"
                                :pt="{ root: '!px-1', nodeToggleButton: '!hidden' }" />
                        </div>
                    </transition>
                </div>
            </div>

            <div class="flex flex-col gap-4 lg:overflow-y-auto lg:max-h-[70vh] lg:pr-2">
                <template v-for="(event) in dayEvents" :key="event.id_evento">
                    <article
                        class="flex items-center gap-3 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-gray-800 px-4 py-3 rounded-md shadow-sm">

                        <div class="rounded-full py-1 px-1.5" :class="setBackgroundIconEvent(event)">
                            <v-icon :name="setIconEvent(event)" scale="1.2" />
                        </div>

                        <div class="w-full">
                            <h3 class="font-semibold text-lg">{{ event.nome }}</h3>
                            <div class="flex gap-2">
                                <span>{{ formatHours(event.horario_inicio!) }}</span> -
                                <span>{{ formatHours(event.horario_termino!) }}</span>
                            </div>
                        </div>

                        <div v-if="event.is_proprietario" class="flex gap-10">
                            <button class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
                                @click="openCreateEvent(event.id_evento)">
                                <v-icon name="pr-pencil" scale="1.2" class="cursor-pointer" />
                            </button>
                            <button class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800">
                                <v-icon name="pr-trash" scale="1.2" class="cursor-pointer" />
                            </button>
                        </div>

                    </article>
                </template>
            </div>

        </section>
        <Calendar @update:selected="handleDateUpdate"></Calendar>
        <ModalEvent :visible="showCreateEventModal" :email="data.email" :event-to-edit="eventToEdit"
            @close="closeCreateEvent" @saved="onEventSaved" />
    </main>
</template>

<style scoped>
.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-down-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.slide-down-enter-active {
    transition: all 0.18s ease-out;
}

.slide-down-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-down-leave-active {
    transition: all 0.15s ease-in;
}
</style>