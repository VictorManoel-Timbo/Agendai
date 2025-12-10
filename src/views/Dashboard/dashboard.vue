<script lang="ts">
import { defineComponent } from 'vue'
import { Student, Teacher, User } from '@/models/user.model'
import { UserService } from '../user.service'
import { JournalEventService } from '../event.service'

export default defineComponent({
    data() {
        return {
            data: new User() as Student || Teacher
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
        }
    },
    computed: {
        service(): UserService {
            return new UserService()
        },
        eventService() {
            return new JournalEventService()
        }
    }
})
</script>

<template>
    <main class="items-center justify-center flex-col-reverse">
        <div class="w-full">
            Dash
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/signup">Signup</RouterLink>
        </div>
        <Calendar></Calendar>
    </main>
</template>