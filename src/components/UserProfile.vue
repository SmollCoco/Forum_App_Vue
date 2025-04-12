<template>
    <div class="user-profile-container">
        <h2>User Profile</h2>
        <div v-if="userId">
            <p><strong>User ID:</strong> {{ userId }}</p>
            <p>
                <strong>Status:</strong>
                {{ isLoggedIn ? "Logged In" : "Logged Out" }}
            </p>
            <button class="btn btn-danger" @click="handleLogout">Logout</button>
        </div>
        <div v-else>
            <p>You are not logged in.</p>
            <router-link to="/login" class="btn btn-primary">Login</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useCurrentUserId } from "@/composables/useCurrentUserId.js";
import logout from "@/composables/userLogout.js";
import { authStateListener } from "@/composables/authStateListener.js";
import { useRouter } from "vue-router";

const { currentUserId } = useCurrentUserId(); // Get the current user ID
const userId = currentUserId;
const isLoggedIn = ref(false); // Track login status
const router = useRouter();

authStateListener((status) => {
    isLoggedIn.value = status; // Update login status
});

const handleLogout = async () => {
    try {
        await logout(); // Use the logout composable
        router.push("/"); // Redirect to the home page
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
</script>

<style scoped>
.user-profile-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;
}
</style>
