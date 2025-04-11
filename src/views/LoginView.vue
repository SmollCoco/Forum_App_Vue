<template>
    <!-- Moved submit handler to form element -->
    <form @submit.prevent="handleLogin">
        <div class="formitem">
            <label for="email">
                Email:
            </label>
            <input type="email" id="email" v-model="email" required />
        </div>
        <div class="formitem">
            <label for="password">
                password:
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


const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        await loginUser(email.value, password.value)
        alert('Login successful!')

        try {
            await router.push('/')
        } catch (navError) {
            console.error('Navigation failed:', navError)
            alert('Redirect failed, please try manual navigation')
        }

    } catch (loginError) {
        console.error('Login failed:', loginError)
        alert('Login failed. Please check your credentials.')
    }
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 10% auto;
    padding: 20px;
    gap: 50px;
    border: 2px solid #ccc;
}
.formitem{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>