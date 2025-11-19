<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
    data() {
        return {}
    },
})
</script>

<template>
    <main class="items-center justify-center">
        Signup
        <RouterLink to="/login">Login</RouterLink>
    </main>
</template>