<script lang="ts">
import type { Course } from '@/models/couse.model'
import { Student } from '@/models/user.model'
import { AuthService } from '@/views/auth.service'
import { CourseService } from '@/views/course.service'
import { defineComponent } from 'vue'

import { ToastHandler } from "@/utils/toast-handler.util"
import useVuelidate from '@vuelidate/core'
import { required, sameAs, minLength, maxLength } from '@vuelidate/validators'

export default defineComponent({
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            studentType: {} as any,
            institution: 1,
            course: {} as Course,
            passwordConfirm: '',
            user: new Student(undefined, undefined, '', '', '', '', ''),
            institutions: [
                { label: 'UECE', value: 1 }
            ],
            courses: [] as Course[],
            studentOptions: [
                { label: 'Graduação', value: true },
                { label: 'Pós-graduação', value: false }
            ],
            v$: null as any
        }
    },
    computed: {
        rules() {
            return {
                user: {
                    nome: { required },
                    cpf: { 
                        required,
                        minLength: minLength(11),
                        maxLength: maxLength(11)
                    },
                    matricula: { 
                        required,
                        maxLength: maxLength(7)
                    },
                    idCurso: { required },
                    email: { required },
                    senha: { 
                        required,
                        minLength: minLength(8)
                    }
                },
                passwordConfirm: {
                    required,
                    sameAsPassword: sameAs(() => this.user.senha)
                }
            }
        },
        authService(): AuthService {
            return new AuthService()
        },
        courseService(): CourseService {
            return new CourseService()
        }
    },
    created() {
        this.v$ = useVuelidate(this.rules, this)
    },
    watch: {
        studentType(newVal) {
            this.getCourses(newVal.value)
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit("changeMode", true)
        },
        signup(e: Event): void {
            e.preventDefault()

            this.v$.$touch()
            if (this.v$.$invalid) {
                ToastHandler.error("Verifique os campos obrigatórios.")
                return
            }

            this.user.email = `${this.user.email}@aluno.uece.br`
            const tempId: any = this.user.idCurso
            this.user.idCurso = tempId?.id

            this.authService.auth.pipe().subscribe({
                next: (response) => {
                    this.$router.push('/')
                }
            })
            this.authService.signup(this.user)
        },
        getCourses(isGraduating: boolean): void {
            const filter = { graduacao: isGraduating, id_universidade: 1 }
            this.courseService.course.pipe().subscribe({
                next: (response) => {
                    this.courses = response
                }
            })
            this.courseService.getCourses(filter)
        }
    }
})
</script>

<template>
    <main class="
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
        ">
        <section class="
                w-full max-w-full flex flex-col gap-10
                mt-10 mb-10
                sm:max-w-md
                sm:bg-white sm:dark:bg-zinc-800
                sm:shadow-lg sm:rounded-xl sm:border sm:border-gray-300 sm:dark:border-gray-800
                sm:py-12 sm:px-9
                lg:ml-24 lg:max-w-[500px]
                xl:max-w-[560px]
            ">
            <!-- HEADER -->
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-2xl text-black dark:text-white">
                    <v-icon name="pr-arrow-left" scale="1.2" />
                </button>

                <h1 class="text-3xl text-black dark:text-white">AgendAí</h1>

                <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme" />
            </div>
            <!-- SELECT BUTTON -->
            <SelectButton 
                v-model="studentType" 
                :options="studentOptions" 
                optionLabel="label"
                class="w-full text-lg md:col-span-2" 
                :pt="{
                    root: 'flex w-full',
                    button: 'flex-1 py-3 text-lg font-semibold rounded-lg'
                }" 
                fluid 
            />
            <!-- FORM -->
            <form @submit="signup" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <!-- NOME -->
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-xl dark:text-gray-200">Nome</label>
                    <InputText 
                        v-model="user.nome" 
                        placeholder="Digite seu nome" 
                        class="w-full text-lg h-[48px]"
                        :pt="{ root: 'h-[48px]' }" 
                    />
                    <span v-if="v$.user.nome.$error" class="text-red-500 text-sm">
                        Nome é obrigatório.
                    </span>
                </div>
                <!-- E-MAIL  -->
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-xl dark:text-gray-200">E-mail</label>
                    <div class="flex items-center w-full">
                        <InputText
                            v-model="user.email"
                            placeholder="Digite seu e-mail (sem domínio)"
                            class="w-full text-lg h-[48px] rounded-r-none"
                            :pt="{ root: 'h-[48px] !rounded-r-none px-3 text-lg' }"
                        />
                        <span
                            class="px-3 h-[48px] flex items-center border border-l-0 rounded-r-lg
                                   dark:border-zinc-700 text-lg bg-gray-100 dark:bg-zinc-700 dark:text-gray-200">
                            @aluno.uece.br
                        </span>
                    </div>
                    <span v-if="v$.user.email.$error" class="text-red-500 text-sm">
                        E-mail é obrigatório.
                    </span>
                </div>
                <!-- MATRÍCULA  -->
                <div class="flex flex-col gap-2">
                    <label class="text-xl dark:text-gray-200">Matrícula</label>
                    <InputText
                        v-model="user.matricula"
                        placeholder="Digite sua matrícula"
                        class="w-full text-lg h-[48px]"
                        :pt="{ root: 'h-[48px]' }"
                    />
                    <span v-if="v$.user.matricula.$error" class="text-red-500 text-sm">
                        Matrícula é obrigatório.
                    </span>
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
                    <span v-if="v$.user.cpf.$error" class="text-red-500 text-sm">
                        CPF é obrigatório.
                    </span>
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
                        class="w-full h-[48px] opacity-70 cursor-not-allowed" 
                        :pt="{
                            root: 'w-full h-[48px] rounded-lg border dark:bg-zinc-700 flex items-center',
                            input: 'px-3 text-lg'
                        }" 
                    />
                </div>
                <!-- CURSO -->
                <div class="flex flex-col gap-2">
                    <label class="text-xl dark:text-gray-200">Curso</label>
                    <Select 
                        v-model="user.idCurso" 
                        :options="courses" 
                        optionLabel="nome" 
                        placeholder="Selecione o curso"
                        class="w-full h-[48px]" 
                        :pt="{
                            root: 'w-full h-[48px] rounded-lg border dark:bg-zinc-700 flex items-center',
                            input: 'px-3 text-lg'
                        }" 
                    />
                    <span v-if="v$.user.idCurso.$error" class="text-red-500 text-sm">
                        Curso é obrigatório.
                    </span>
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
                    <span v-if="v$.user.senha.$error" class="text-red-500 text-sm">
                        A senha deve ter pelo menos 8 caracteres.
                    </span>
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
                    <span v-if="v$.passwordConfirm.$error" class="text-red-500 text-sm">
                        As senhas não coincidem.
                    </span>
                </div>
                <!-- CONTINUAR -->
                <Button type="submit" label="continuar" class="w-full md:col-span-2 mt-2" />
                <!-- OU -->
                <div class="flex items-center gap-3 md:col-span-2 -mt-2">
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