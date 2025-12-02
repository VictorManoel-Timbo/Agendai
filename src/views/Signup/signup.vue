<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  props: {
    isDark: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    sendChangeTheme(): void {
      this.$emit("changeMode", true)
    },
    selectType(type: string) {
      if (type === 'Professor') {
        this.$router.push('/signup/teacher')
      } else if (type === 'Aluno') {
        this.$router.push('/signup/student')
      }
    }
  }
})
</script>

<template>
  <main
    class="
      min-h-screen w-full flex justify-center items-center
      px-[26px]
      sm:items-center
      lg:flex-row lg:justify-start
      lg:px-0 lg:pl-16
      xl:pl-24
      2xl:pl-60
      login-background
      dark:bg-zinc-900
    "
  >
    <section
      class="
        w-full max-w-full flex flex-col gap-10
        sm:max-w-md
        bg-white dark:bg-zinc-800
        shadow-lg
        rounded-xl
        border border-gray-300 dark:border-gray-800
        py-12 px-9
        lg:ml-24 lg:max-w-[480px]
        2xl:max-w-[520px]
      "
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-2">
        <button @click="$router.back()" class="text-2xl text-black dark:text-white">
          <v-icon name="pr-arrow-left" class="text-2xl" />
        </button>

        <h1 class="text-3xl text-black dark:text-white">AgendAí</h1>

        <ToggleThemeButton :isDark="isDark" @changeMode="sendChangeTheme"/>
      </div>

      <!-- TIPO DE CADASTRO -->
      <div class="flex flex-col gap-6">
        <p class="text-xl font-semibold dark:text-gray-200">Tipo de Cadastro</p>

        <Button
          label="Professor"
          class="w-full h-[48px] text-lg"
          @click="selectType('Professor')"
        />

        <Button
          label="Aluno"
          class="w-full h-[48px] text-lg"
          @click="selectType('Aluno')"
        />
      </div>

      <!-- FOOTER -->
      <div class="text-center mt-4 md:col-span-2">
        <RouterLink
          to="/login"
          class="text-md text-black/70 dark:text-gray-300 hover:underline"
        >
          Já tem conta? <span class="underline">Login</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  .login-background {
    background-image: url('@/assets/AgendaAI_APP.svg');
    background-repeat: no-repeat;
    background-position: center right;
    background-size: contain;
  }
}
</style>
