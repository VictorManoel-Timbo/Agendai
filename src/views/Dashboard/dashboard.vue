<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {}
    },
})
</script>

<template>
    <main class="items-center justify-center">
        Dash
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/signup">Signup</RouterLink>
    </main>
</template>