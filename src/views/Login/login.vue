<script lang="ts">
import { AuthRequest } from "@/models/auth.model"
import { defineComponent } from "vue"
import { AuthService } from "../auth.service"
import { TokenUtil } from "@/utils/token.util"

export default defineComponent({
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            authResquest: new AuthRequest('', '')
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit("changeMode", true)
        },
        login(e: Event): void {
            e.preventDefault()
            const user: AuthRequest = this.authResquest
            this.service.auth.pipe().subscribe({
                next: (response) => {
                    if (response) {
                        TokenUtil.initialize(response)
                        this.$router.push({ name: 'Dashboard', params: { role: sessionStorage.getItem('role')} })
                    }
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
    <main
        class="
            min-h-screen w-full
            flex flex-col justify-evenly
            px-[26px]
            sm:items-center
            lg:flex-row lg:justify-start 
            lg:px-0 lg:pl-16
            xl:pl-24
            2xl:pl-60
            lg:bg-[url('@/assets/AgendaAI_APP.svg')]
            lg:bg-no-repeat
            lg:bg-right
            lg:bg-contain
        "
    >
        <section
            class="
                w-full max-w-full flex flex-col gap-10
                sm:max-w-md
                sm:bg-white sm:dark:bg-zinc-800
                sm:shadow-lg sm:rounded-xl sm:border sm:border-gray-300 sm:dark:border-gray-800
                sm:py-12 sm:px-9
                lg:ml-24 lg:max-w-[480px]
                2xl:max-w-[520px]
            "
        >
            <!-- HEADER -->
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-4xl text-black dark:text-white">
                    AgendAí
                </h1>
                <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme"/>
            </div>

            <!-- FORM -->
            <form class="flex flex-col" @submit="login">
                <!-- EMAIL -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">
                        E-mail
                    </label>
                    <InputText v-model="authResquest.email" placeholder="Digite seu e-mail" class="w-full text-lg" />
                </div>

                <!-- PASSWORD -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">
                        Senha
                    </label>
                    <Password
                        v-model="authResquest.password"
                        placeholder="Digite sua senha"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full"
                        class="w-full text-lg"
                    />
                </div>

                <!-- FORGOT PASSWORD -->
                <div class="flex justify-end -mt-2 mb-12">
                    <RouterLink
                        to="/forgot-password"
                        class="text-md text-black/70 dark:text-gray-300 hover:underline"
                    >
                        esqueceu a senha?
                    </RouterLink>
                </div>

                <Button type="submit" label="Entrar" class="w-full mb-3" />
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex-1 h-px bg-gray-300"></div>
                    <span class="text-lg text-gray-500 font-bold">ou</span>
                    <div class="flex-1 h-px bg-gray-300"></div>
                </div>
                <Button
                    label="Cadastrar"
                    class="w-full"
                    @click="$router.push('/signup')"
                />
            </form>
        </section>
    </main>
</template>