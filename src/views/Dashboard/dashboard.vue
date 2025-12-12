<script lang="ts">
import { defineComponent } from 'vue'
import { Student, Teacher, User } from '@/models/user.model'
import { UserService } from '../user.service'
import DeletEvent from '@/components/DeletEvent/delet-event.vue'
import Button from 'primevue/button'

export default defineComponent({
    name: 'DashboardView',
    components: { DeletEvent, Button },
    data() {
        return {
            data: new User() as Student || Teacher,
            events: [
              { id: 1, title: 'Extensão 3', start: '2025-12-12' },
              { id: 2, title: 'Apresentação APS', start: '2025-12-15' },
              { id: 3, title: 'Final do Semestre', start: '2025-12-22' }
            ] as Array<Record<string, any>>,
            selectedEvent: null as Record<string, any> | null
        }
    },
    mounted() {
        this.getUser()
    },
    methods: {
        getUser(): void {
            this.service.user.pipe().subscribe({
                    next: (response) => {
                        this.data = response
                    },
                })
            this.service.getUser()
        },

        openDeleteModal(evt: Record<string, any>) {
            this.selectedEvent = evt
           const modal = this.$refs.deleteModal as InstanceType<typeof DeletEvent>
            modal.open()
        },

        async confirmDelete(evtFromModal: Record<string, any> | null) {
            const evt = evtFromModal || this.selectedEvent
            if (!evt || !evt.id) return

            this.events = this.events.filter(e => e.id !== evt.id)
            this.selectedEvent = null
        },

        onCancelDelete() {
            this.selectedEvent = null
        }
    },
    computed: {
        service(): UserService {
            return new UserService()
        }
    }
})
</script>

<template>
    <main class="p-6">
        <div class="w-full mb-6 flex items-center justify-between">
            <div>
              <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">Dash</span>
            </div>

            <div class="flex gap-4">
              <RouterLink to="/login" class="text-sm text-gray-700 dark:text-gray-300">Login</RouterLink>
              <RouterLink to="/signup" class="text-sm text-gray-700 dark:text-gray-300">Signup</RouterLink>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          <aside class="w-full md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <h3 class="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">Eventos</h3>

            <div class="space-y-2">
              <div v-for="event in events" :key="event.id" class="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                <div class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ event.title }}</div>

                <div>
                  <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click.stop="openDeleteModal(event)"/>
                </div>
              </div>
            </div>
          </aside>

          <section class="flex-1">
            <Calendar></Calendar>
          </section>
        </div>

        <DeletEvent ref="deleteModal" :event="selectedEvent" @confirm="confirmDelete" @cancel="onCancelDelete" />
    </main>
</template>