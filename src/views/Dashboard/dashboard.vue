<script lang="ts">
import { defineComponent } from 'vue'
import { AuthService } from '../auth.service';
import { AuthResponse, type AuthRequest } from '@/models/auth.model';

export default defineComponent({
    data() {
        return {
            data: new AuthResponse()
        }
    },
    methods: {
        //Exemplo de como deve ser feita a requisição
        login(user: AuthRequest): void {
            this.service.auth
                .subscribe({
                    next: (response) => {
                        this.data = response
                    }
                })
            this.service.login(user)
        }
    },
    computed: {
        service(): AuthService {
            return new AuthService()
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