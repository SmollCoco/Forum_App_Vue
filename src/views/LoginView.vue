<template>
    <div>
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <form @submit.prevent="handleLogin">
            <div class="formitem">
                <label for="email"> Email: </label>
                <input type="email" id="email" v-model="email" required />
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

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
    try {
        await loginUser(email.value, password.value);
        alert("Login successful!");

        try {
            await router.push("/");
        } catch (navError) {
            console.error("Navigation failed:", navError);
            alert("Redirect failed, please try manual navigation");
        }
    } catch (loginError) {
        markInvalidInputs();
        console.error("Login failed:", loginError);
        alert("Login failed. Please check your credentials.");
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const markInvalidInputs = () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    emailInput.style.borderColor = "red";
    passwordInput.style.borderColor = "red";
    emailInput.value = "";
    passwordInput.value = "";
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 10% auto;
    padding: 20px;
    gap: 50px;
    border: 2px solid #ccc;
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
button {
    padding: 10px;
    background-color: #25699f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover {
    background-color: #858d95;
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
