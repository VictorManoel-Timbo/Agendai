<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            studentType: '',
            institution: '',
            course: '',
            email: '',
            password: '',
            passwordConfirm: '',

            // Dados do select (Apenas de exemplo)
            institutions: [
                { label: 'UECE', value: 'uece' },
                { label: 'UFC', value: 'ufc' }
            ],
            courses: [
                { label: 'Ciência da Computação', value: 'cc' },
                { label: 'Administração', value: 'adm' }
            ],
            studentOptions: [
                { label: 'Graduação', value: 'graduacao' },
                { label: 'Pós-graduação', value: 'pos' }
            ]
        }
    },
    methods: {
        sendChangeTheme(): void{
            this.$emit("changeMode", true)
        },
        onSubmit(e: Event): void{
            e.preventDefault()
            console.log("Cadastro realizado:", {
                studentType: this.studentType,
                insitution: this.institution,
                course: this.course,
                email: this.email,
                password: this.password,
                passwordConfirm: this.passwordConfirm
            })
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
            bg-none
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
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-2xl text-black dark:text-white">
                    ←
                </button>

                <h1 class="text-3xl text-black dark:text-white">AgendAí</h1>

                <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme"/>
            </div>

            <!-- SELETOR TIPO DE ALUNO -->
            <SelectButton
                v-model="studentType"
                :options="[
                    { label: 'Graduação', value: 'graduacao' },
                    { label: 'Pós-graduação', value: 'pos' }
                ]"
                optionLabel="label"
                class="w-full text-lg"
                :pt="{
                    root: 'flex w-full',
                    button: 'flex-1 py-3 text-lg font-semibold rounded-lg'
                }"
                fluid
            />

            <!-- FORM -->
            <form @submit="onSubmit" class="flex flex-col">
                <!-- INSTITUIÇÃO -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">Instituição</label>

                    <Select
                        v-model="institution"
                        :options="institutions"
                        optionLabel="label"
                        placeholder="Selecione a instituição"
                        class="w-full"
                        :pt="{
                            root: 'rounded-lg border dark:bg-zinc-700',
                            input: 'py-3 px-3 text-lg'
                        }"
                    />
                </div>

                <!-- CURSO -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">Curso</label>

                    <Select
                        v-model="course"
                        :options="courses"
                        optionLabel="label"
                        placeholder="Selecione o curso"
                        class="w-full"
                        :pt="{
                            root: 'rounded-lg border dark:bg-zinc-700',
                            input: 'p-3 text-lg'
                        }"
                    />
                </div>

                <!-- EMAIL -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">E-mail</label>
                    <InputText v-model="email" placeholder="Digite seu email" class="w-full text-lg" />
                </div>

                <!-- SENHA -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">Senha</label>
                    <Password
                        v-model="password"
                        placeholder="Digite sua senha"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full"
                        class="w-full text-lg"
                    />
                </div>

                <!-- CONFIRMAR SENHA -->
                <div class="flex flex-col gap-2 mb-8">
                    <label class="text-xl dark:text-gray-200">Confirmar senha</label>
                    <Password
                        v-model="passwordConfirm"
                        placeholder="Confirme sua senha"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full"
                        class="w-full text-lg"
                    />
                </div>

                <!-- BOTÕES -->
                <Button type="submit" label="continuar" class="w-full mb-3" />

                <div class="flex items-center gap-3 mb-3">
                    <div class="flex-1 h-px bg-gray-300"></div>
                    <span class="text-lg text-gray-500 font-bold">ou</span>
                    <div class="flex-1 h-px bg-gray-300"></div>
                </div>

                <Button
                    label="entrar"
                    class="w-full"
                    @click="$router.push('/login')"
                />
            </form>
        </section>
    </main>
</template>