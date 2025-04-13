<template>
    <div class="login-wrapper">
        <form @submit.prevent="handleLogin" class="login-form">
            <h2 class="login-title">Login</h2>
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
            <button type="submit" class="submit-btn">Login</button>
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
.login-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 64px);
    background-color: #f1f2f2;
    margin-top: 64px; /* Add margin for fixed navbar */
    padding: 24px;
}

.login-form {
    background: white;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 24px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.login-title {
    font-size: 24px;
    font-weight: bold;
    color: #2b2b2b;
    margin-bottom: 24px;
    text-align: center;
}

.formitem {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.formitem label {
    font-weight: 500;
    color: #2b2b2b;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease;
}

input:focus {
    outline: none;
    border-color: #b92b27;
}

.password-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toggle-password {
    background: none;
    border: none;
    color: #b92b27;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    width: auto;
}

.toggle-password:hover {
    text-decoration: underline;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #b92b27;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.submit-btn:hover {
    background-color: #a52622;
    transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .login-wrapper {
        margin-top: 80px; /* Increase margin for mobile navbar */
        padding: 16px;
    }

    .login-form {
        padding: 20px;
    }

    .submit-btn {
        padding: 10px;
        font-size: 14px;
    }
}
</style>
