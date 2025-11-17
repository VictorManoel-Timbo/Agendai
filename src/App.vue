<script lang="ts">
import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      theme: "Escuro",
      isDarkMode: false
    }
  },
  computed: {
    hasNavbar(): boolean {
      return this.$route.meta.hasNavbar === true
    }
  },
  methods: {
    toggleMode(event: Event): void {
      if (event) {
        document.documentElement.classList.toggle('my-app-dark')
        this.setTheme()
      }
    },
    setTheme() {
      this.isDarkMode = !this.isDarkMode
      this.isDarkMode ? this.theme = "Claro" : this.theme = "Escuro"
    }
  }
})
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden">
    <div v-if="hasNavbar" class="w-[100vw] h-16 bg-primary-500"></div> <!--Para indicar onde será a navbar/header/barra de navegação-->
    <RouterView 
      @changeMode="toggleMode($event)" 
      :theme="theme" 
      :class="hasNavbar ? 'min-h-[calc(100vh-64px)]' : 'min-h-screen'" 
      class="flex flex-col lg:flex-row w-full px-[2.5vw]"
      />
  </main>
</template>
