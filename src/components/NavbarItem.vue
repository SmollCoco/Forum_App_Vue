<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfo } from "@/composables/useUserInfo";
import SearchBar from "./SearchBar.vue";

const props = defineProps({
    username: {
        type: String,
        default: "",
    },
});

let user_connected = ref(false);
let currentUser = ref(null);
let username = ref("");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        user_connected.value = true;
        currentUser.value = user;

        // Fetch the username from Firestore
        const userInfo = await getUserInfo(user.displayName);
        if (userInfo) {
            username.value = userInfo.username; // Set the username
        } else {
            console.warn("User info not found in Firestore.");
        }
    } else {
        user_connected.value = false;
        currentUser.value = null;
        username.value = "";
    }
});

const logout = async () => {
    try {
        await auth.signOut();
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to log out. Please try again.");
    }
};
</script>

<template>
    <div
        class="navbar navbar-expand d-flex justify-content-between p-3 border-bottom"
    >
        <!-- Logo -->
        <div>
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>

        <!-- Search Bar -->
        <search-bar class="my-2" />

        <!-- User Actions -->
        <div>
            <div v-if="user_connected" class="d-flex gap-3">
                <!-- Create Button -->
                <router-link
                    :to="`/submit/${currentUser?.displayName || 'user'}`"
                    class="btn btn-secondary rounded-pill text-white fw-bold"
                >
                    Create
                </router-link>

                <!-- Profile Button -->
                <router-link
                    :to="`/profile/${currentUser?.displayName || 'user'}`"
                    class="btn btn-primary rounded-pill text-white fw-bold"
                >
                    Profile
                </router-link>
                <button
                    class="btn btn-danger rounded-pill fw-bold"
                    @click="logout"
                >
                    Logout
                </button>
            </div>
            <div v-else class="d-flex gap-3">
                <!-- Login Button -->
                <router-link
                    to="/login"
                    class="btn btn-primary rounded-pill text-white fw-bold"
                >
                    Login
                </router-link>

                <!-- Register Button -->
                <router-link
                    to="/register"
                    class="btn btn-success rounded-pill text-white fw-bold"
                >
                    Register
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.navbar {
    background-color: white;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 20px;
}

button:hover {
    background-color: var(--danger-hover);
}

.btn {
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

.fx-w {
    position: relative;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>
