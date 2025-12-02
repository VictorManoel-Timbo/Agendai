<script lang="ts">
import { Teacher } from "@/models/user.model"
import { AuthService } from "@/views/auth.service"
import { defineComponent } from "vue"

export default defineComponent({
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            institution: 1,
            passwordConfirm: '',
            user: new Teacher(undefined, undefined, '', '', '', ''),
            institutions: [
                { label: 'UECE', value: 1 }
               
            ],
        
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit("changeMode", true)
        },
        signup(e: Event): void {
            e.preventDefault()
            this.user.idUniversidade = 1
            this.service.auth.pipe().subscribe({
                next: (response) => {
                    this.$router.push('/')
                }
            })
            this.service.signup(this.user)
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
                mt-10 mb-10
                sm:max-w-md
                sm:bg-white sm:dark:bg-zinc-800
                sm:shadow-lg sm:rounded-xl sm:border sm:border-gray-300 sm:dark:border-gray-800
                sm:py-12 sm:px-9
                lg:ml-24 lg:max-w-[500px]
                xl:max-w-[560px]
            "
        >
            <!-- HEADER -->
            <div class="flex items-center justify-between mb-2">
                <button @click="$router.back()" class="text-2xl text-black dark:text-white">
                   <v-icon name="pr-arrow-left" class="1.2" />
                </button>

                <h1 class="text-3xl text-black dark:text-white">AgendAí</h1>

                <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme"/>
            </div>
            <!-- FORM -->
            <form
                @submit="signup"
                class="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
                <!-- NOME -->
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-xl dark:text-gray-200">Nome</label>
                    <InputText
                        v-model="user.nome"
                        placeholder="Digite seu nome"
                        class="w-full text-lg h-[48px]"
                        :pt="{ root: 'h-[48px]' }"
                    />
                </div>
                <!-- INSTITUIÇÃO -->
                <div class="flex flex-col gap-2">
                    <label class="text-xl dark:text-gray-200">Instituição</label>
                    <Select
                        v-model="institution"
                        :options="institutions"
                        optionLabel="label"
                        placeholder="UECE"
                        disabled
                        class="w-full h-[48px]"
                        :pt="{
                            root: 'w-full h-[48px] rounded-lg border dark:bg-zinc-700 flex items-center',
                            input: 'px-3 text-lg'
                        }"
                    />
                </div>
                
                <!-- CPF -->
                <div class="flex flex-col gap-2">
                    <label class="text-xl dark:text-gray-200">CPF</label>
                    <InputText
                        v-model="user.cpf"
                        placeholder="Digite seu CPF"
                        class="w-full text-lg h-[48px]"
                        :pt="{ root: 'h-[48px]' }"
                    />
                </div>
                <!-- EMAIL -->
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-xl dark:text-gray-200">E-mail</label>
                    <InputText
                        v-model="user.email"
                        placeholder="Digite seu email"
                        class="w-full text-lg h-[48px]"
                        :pt="{ root: 'h-[48px]' }"
                    />
                </div>
                <!-- SENHA -->
                <div class="flex flex-col gap-2">
                    <label class="text-xl dark:text-gray-200">Senha</label>
                    <Password
                        v-model="user.senha"
                        placeholder="Digite sua senha"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full h-[48px]"
                        class="text-lg"
                        :pt="{ root: 'w-full', input: 'h-[48px] px-3 text-lg' }"
                    />
                </div>
                <!-- CONFIRMAR SENHA -->
                <div class="flex flex-col gap-2 mb-5">
                    <label class="text-xl dark:text-gray-200">Confirmar senha</label>
                    <Password
                        v-model="passwordConfirm"
                        placeholder="Confirme sua senha"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full h-[48px]"
                        class="text-lg"
                        :pt="{ root: 'w-full', input: 'h-[48px] px-3 text-lg' }"
                    />
                </div>
                <!-- CONTINUAR -->
                <Button
                    type="submit"
                    label="continuar"
                    class="w-full md:col-span-2 mt-2"
                />
                <!-- OU -->
                <div class="flex items-center gap-3 md:col-span-2 -mt-1">
                    <div class="flex-1 h-px bg-gray-300"></div>
                    <span class="text-lg text-gray-500 font-bold">ou</span>
                    <div class="flex-1 h-px bg-gray-300"></div>
                </div>
                <!-- ENTRAR -->
                <Button
                    label="entrar"
                    class="w-full md:col-span-2 -mt-2"
                    @click="$router.push('/login')"
                />
            </form>
        </section>
    </main>
</template>
