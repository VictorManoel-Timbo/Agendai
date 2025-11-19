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
        <RouterLink to="/dashboard/123/student">Login</RouterLink>
        <RouterLink to="/signup">Signup</RouterLink>
    </main>
</template>