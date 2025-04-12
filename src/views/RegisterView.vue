<template>
    <div id="register">
        <form @submit.prevent="handleRegister">
            <div>
                <label>Email</label>
                <input v-model="email" type="email" required />
            </div>
            <div>
                <label>Password</label>
                <input v-model="password" type="password" required />
            </div>
            <div>
                <label>Confirm Password</label>
                <input v-model="confirmPassword" type="password" required />
            </div>
            <div>
                <label>Name</label>
                <input v-model="name" type="text" />
            </div>
            <div>
                <label>Profile Picture Path</label>
                <input v-model="pfp" type="text" />
            </div>
            <button type="submit">Create Account</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser } from '@/composables/userRegistration'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const pfp = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
    errorMessage.value = ''

    // Validate passwords match
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.'
        return
    }

    // Validate name does not contain numbers
    const nameRegex = /^[^\d]*$/
    if (!nameRegex.test(name.value)) {
        errorMessage.value = 'Name should not contain numbers.'
        return
    }

    try {
        const user = await registerUser(email.value, password.value, name.value, pfp.value)
        console.log('User created:', user)
        alert('Account created successfully!')
        router.push('/')
    } catch (err) {
        errorMessage.value = err.message
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>
