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
  <RouterView @changeMode="toggleMode($event)" :theme="theme"/>
</template>
