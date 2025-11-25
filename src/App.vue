<script lang="ts">
import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'
import Navbar from './components/Navbar/navbar.vue'

export default defineComponent({
  data() {
    return {
      isDark: false
    }
  },
  mounted() {
    this.setInitialTheme()
  },
  computed: {
    hasNavbar(): boolean {
      return this.$route.meta.hasNavbar === true
    }
  },
  methods: {
    toggleTheme(event: Event): void {
      if (event) {
        document.documentElement.classList.toggle('my-app-dark')
      }
    },
    setInitialTheme(): void {
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDarkScheme) {
        this.isDark = true
        document.documentElement.classList.toggle('my-app-dark')
      } else {
        this.isDark = false
      }
    }
  }
})
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen w-full overflow-x-hidden">
    <Navbar v-if="hasNavbar" :isDark="isDark" @changeMode="toggleTheme($event)" />
    <RouterView
      :isDark="isDark" @changeMode="toggleTheme($event)"
      :class="hasNavbar ? 'min-h-[calc(100vh-64px)] h-[calc(100vh-64px)]' : 'min-h-screen h-screen'"
      class="flex flex-col lg:flex-row w-full px-[2.5vw]" 
      />
  </main>
</template>