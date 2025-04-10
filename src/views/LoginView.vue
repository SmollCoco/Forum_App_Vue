<template>
    <form @submit.prevent="handleLogin">
        <div class="formitem">
            <label for="email">
                Email:
            </label>
            <input type="email" id="email" v-model="email" required />
        </div>
        <div class="formitem">
            <label for="password">
                Password:

            </label>
            <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
    </form>
</template>


<script setup>
import { ref } from 'vue'
import { loginUser } from '@/composables/userLogin'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    const router = useRouter()
    try {
        await loginUser(email.value, password.value)
        alert('Login successful!')
        // Redirect to the home page or any other page after successful login
        router.push('/')
    } catch (error) {
        console.error('Login failed:', error)
        alert('Login failed. Please check your credentials.')
    }
}

</script>
