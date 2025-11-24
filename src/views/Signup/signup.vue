<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
    data() {
        return {}
    },
    props: {
        isDark: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit("changeMode", true)
        }
    }
})
</script>

<template>
    <main class="items-center justify-center">
        <!-- Signup
        <RouterLink to="/login">Login</RouterLink> -->
        <router-view :isDark="isDark" @changeMode="sendChangeTheme"/>
    </main>
</template>