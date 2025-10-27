<script lang="ts">
import { defineComponent } from 'vue'

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
        Login
        <Button @click="sendChangeTheme()" :label="theme" />
        <RouterLink to="/signup">Signup</RouterLink>
    </main>
</template>