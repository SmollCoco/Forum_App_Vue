<template>
    <div>
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <form @submit.prevent="handleLogin">
            <div class="formitem">
                <label for="username"> Username: </label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div class="formitem">
                <label for="password"> Password: </label>
                <div class="password-container">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        v-model="password"
                        required
                    />
                    <button
                        type="button"
                        @click="togglePasswordVisibility"
                        class="toggle-password"
                    >
                        {{ showPassword ? "Hide" : "Show" }}
                    </button>
                </div>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUser } from "@/composables/userLogin";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
    try {
        await loginUser(username.value, password.value);
        alert("Login successful!");
        router.push(`/profile/${username.value}`);
    } catch (loginError) {
        console.error("Login failed:", loginError);
        alert("Login failed. Please check your credentials.");
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

<style scoped>
form {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
    padding: 20px;
    width: 100%;
    max-width: 400px;
    margin: auto;
}

form div {
    margin-bottom: 16px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
}

button:hover {
    background-color: var(--primary-hover);
}

.formitem {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.password-container {
    display: flex;
    align-items: center;
    gap: 10px;
}
.toggle-password {
    background: none;
    border: none;
    color: #25699f;
    cursor: pointer;
    font-size: 14px;
}
.toggle-password:hover {
    text-decoration: underline;
}
</style>
