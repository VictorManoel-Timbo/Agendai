<script lang="ts">
import { defineComponent } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { AuthService } from "../auth.service"

export default defineComponent({
  name: 'ForgotPassword',
  components: { Button, InputText, Password },
  props: {
    isDark: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      step: 1,
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      error: '',
    }
  },
  computed: {
    service(): AuthService {
      return new AuthService()
    }
  },
  methods: {
    sendChangeTheme(): void {
      this.$emit("changeMode", true)
    },
    
    handleSubmitEmail() {
      this.error = ''
      if (!this.email || !this.email.includes('@')) {
        this.error = 'Digite um e-mail válido'
        return
      }
      this.loading = true
      
      this.service.resetCode.pipe().subscribe({
        next: (response: any) => {
          this.loading = false
          if (response.success) {
            this.step = 2
            this.error = ''
          } else {
            this.error = response.error?.response?.data?.detail || response.error?.message || 'Erro ao enviar código. Verifique o e-mail e tente novamente.'
          }
        }
      })
      this.service.sendResetCode(this.email)
    },

    handleSubmitCode() {
      this.error = ''
      if (!this.code || this.code.length !== 6) {
        this.error = 'Digite o código de 6 dígitos'
        return
      }
      this.loading = true
      
      this.service.verifyCode.pipe().subscribe({
        next: (response: any) => {
          this.loading = false
          if (response.success) {
            this.step = 3
            this.error = ''
          } else {
            this.error = response.error?.response?.data?.detail || response.error?.message || 'Código inválido ou expirado.'
          }
        }
      })
      this.service.verifyResetCode(this.code)
    },

    handleSubmitPassword() {
      this.error = ''
      if (!this.newPassword || this.newPassword.length < 6) {
        this.error = 'A senha deve ter pelo menos 6 caracteres'
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'As senhas não coincidem'
        return
      }
      this.loading = true
      
      this.service.resetPasswordObs.pipe().subscribe({
        next: (response: any) => {
          this.loading = false
          if (response.success) {
            this.$router.push('/login')
          } else {
            this.error = response.error?.response?.data?.detail || response.error?.message || 'Erro ao redefinir senha. Tente novamente.'
          }
        }
      })
      this.service.resetPassword(this.newPassword, this.confirmPassword)
    },

    goBack() {
      if (this.step > 1) {
        this.step--
      } else {
        this.service.clearRecoveryToken()
        this.$router.push('/login')
      }
    }
  },
  beforeUnmount() {
    this.service.clearRecoveryToken()
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
            <div class="flex items-center justify-between mb-4">
                <button @click="$router.back()" class="text-2xl text-black dark:text-white">
                    <v-icon name="pr-arrow-left" scale="1.2" />
                </button>

                <h1 class="text-3xl text-black dark:text-white">AgendAí</h1>

                <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme" />
            </div>

      <!-- Step 1: E-mail -->
      <form v-if="step === 1" class="flex flex-col" @submit.prevent="handleSubmitEmail">
        <p class="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
          Digite o e-mail cadastrado para atualizar a sua senha
        </p>

        <div class="flex flex-col gap-2 mb-6">
          <label class="text-xl dark:text-gray-200">E-mail</label>
          <InputText
            v-model="email"
            type="email"
            placeholder="Digite seu e-mail"
            class="w-full text-lg"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mb-4">{{ error }}</p>

        <Button type="submit" label="recuperar" class="w-full" :loading="loading" />
      </form>

      <!-- Step 2: Código -->
      <form v-if="step === 2" class="flex flex-col" @submit.prevent="handleSubmitCode">
        <p class="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
          Digite o código de 6 dígitos enviado para <strong>{{ email }}</strong>
        </p>

        <div class="flex flex-col gap-2 mb-6">
          <label class="text-xl dark:text-gray-200">Código</label>
          <InputText
            v-model="code"
            type="text"
            placeholder="123456"
            maxlength="6"
            class="w-full text-lg"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mb-4">{{ error }}</p>

        <Button type="submit" label="confirmar" class="w-full" :loading="loading" />
      </form>

      <!-- Step 3: Nova Senha -->
      <form v-if="step === 3" class="flex flex-col" @submit.prevent="handleSubmitPassword">
        <p class="text-sm text-gray-700 dark:text-gray-300 text-center mb-6">
          Crie sua nova senha
        </p>

        <div class="flex flex-col gap-2 mb-6">
          <label class="text-xl dark:text-gray-200">Nova senha</label>
          <Password
            v-model="newPassword"
            placeholder="Digite sua senha (mínimo 6 caracteres)"
            :feedback="false"
            toggleMask
            inputClass="w-full"
            class="w-full text-lg"
            :disabled="loading"
          />
        </div>

        <div class="flex flex-col gap-2 mb-6">
          <label class="text-xl dark:text-gray-200">Confirme a senha</label>
          <Password
            v-model="confirmPassword"
            placeholder="Confirme sua senha"
            :feedback="false"
            toggleMask
            inputClass="w-full"
            class="w-full text-lg"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mb-4">{{ error }}</p>

        <Button type="submit" label="redefinir" class="w-full" :loading="loading" />
      </form>
    </section>
  </main>
</template>