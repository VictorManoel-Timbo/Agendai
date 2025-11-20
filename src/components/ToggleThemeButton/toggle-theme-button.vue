<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ToggleThemeButton',
    data() {
        return {
            isLightTheme: false
        }
    },
    created() {
        this.isLightTheme = this.isDark
    },
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        sendChangeTheme() {
            this.isLightTheme = !this.isLightTheme
            this.$emit('changeMode', true)
        }
    }
})
</script>

<template>
    <button 
    class="bg-gray-400 dark:bg-neutral-50 text-black dark:text-dark rounded-full py-1 px-1.5 ring-2 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-gray-900 ring-gray-900 dark:ring-gray-300">
        <v-icon @click="sendChangeTheme()" :name="isLightTheme? 'pr-sun' : 'pr-moon'"/>
    </button>
</template>