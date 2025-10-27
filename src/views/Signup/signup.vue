<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
    data() {
        return {}
    },
    props: {
        theme: {
            type: String,
            required: true
        }
    },
    methods: {
        sendChangeTheme(): void {
            this.$emit('changeMode', true)
        }
    }
})
</script>

<template>
    <main>
        Signup
        <Button @click="sendChangeTheme()" :label="theme" />
        <RouterLink to="/login">Login</RouterLink>
    </main>
</template>