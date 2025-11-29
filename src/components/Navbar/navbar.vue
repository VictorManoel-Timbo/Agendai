<script lang="ts">
import { TokenUtil } from '@/utils/token.util'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Navbar',
    data() {
        return {
            options: [
                { label: 'Inicio', role: 'all', action: () => { console.log("Inicio") } },
                { label: 'Horário', role: 'admin', action: () => { console.log("Horário") } },
                { label: 'Cursos', role: 'admin', action: () => { console.log("Cursos") } },
                { label: 'Período Letivo', role: 'admin', action: () => { console.log("Período Letivo") } },
                { label: 'Notificações', role: 'user', action: () => { console.log("Notificações") } },
                { label: 'Sair', role: 'all', action: () => { this.getOut() } },
            ],
            isOpen: false
        }
    },
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        visibleOptions(): any {
            const role: string | string[] = this.$route.params.role
            return this.options.filter(opt => this.canShow(role, opt.role))
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit('changeMode', true)
        },
        canShow(role: string | string[], itemRole: string): boolean {
            if (itemRole === 'all') return true
            if (role === 'admin' && itemRole === 'admin') return true
            if ((role === 'student' || role === 'teacher') && itemRole === 'user') return true
            return false
        },
        changeMenuVisibility(): void {
            this.isOpen = !this.isOpen
        },
        getOut(): void {
            this.clear()
            this.$router.push('/')
        },
        clear(): void {
            TokenUtil.clearToken()
            TokenUtil.clearRefreshToken()
            sessionStorage.clear()
        }
    }
})
</script>

<template>
    <section
        class="flex flex-row items-center justify-between w-[100vw] h-16 bg-primary-500 px-4 text-black dark:text-dark relative">
        <div class="md:hidden" @click="changeMenuVisibility()">
            <v-icon :name="isOpen? 'pr-ellipsis-v' : 'pr-bars'" scale="1.5"></v-icon>
            <transition name="slide-down">
                <div v-if="isOpen"
                    class="absolute mt-1 left-4 bg-neutral-100 dark:bg-zinc-800 w-auto text-black dark:text-white border border-zinc-400 dark:border-neutral-600 shadow-lg rounded-lg px-4 py-2 z-50">

                    <div v-for="option in visibleOptions" :key="option.label" class="py-2 cursor-pointer text-base"
                        @click="option.action(); changeMenuVisibility()">
                        {{ option.label }}
                    </div>

                </div>
            </transition>
        </div>

        <span class="text-3xl font-semibold">AgendAí</span>

        <div class="flex flex-row gap-x-[2.5vw]">
            <div class="hidden md:flex items-center justify-center gap-x-[2.5vw] 2xl:gap-x-10">
                <template v-for="option in visibleOptions" :key="option.label">
                    <span @click="option.action" class="text-base font-medium cursor-pointer">
                        {{ option.label }}
                    </span>
                </template>
            </div>

            <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme()" />
        </div>

        <div v-if="isOpen" @click="isOpen = false" 
            class="fixed inset-0 z-40 md:hidden">
        </div>

    </section>
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