<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfo } from "@/composables/useUserInfo";
import SearchBar from "./SearchBar.vue";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const props = defineProps({
    username: {
        type: String,
        default: "",
    },
});

let user_connected = ref(false);
let currentUser = ref(null);
let displayName = ref("");
let isAdmin = ref(false);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        user_connected.value = true;
        currentUser.value = user;

        // Fetch the username from Firestore
        const userInfo = await getUserInfo(user.displayName);
        if (userInfo) {
            displayName.value = userInfo.username; // Set the username
        } else {
            console.warn("User info not found in Firestore.");
        }

        // Check if user is admin
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            isAdmin.value = userDoc.data().isAdmin === true;
            console.log("User is admin:", isAdmin.value); // Debug log
        }
    } else {
        user_connected.value = false;
        currentUser.value = null;
        displayName.value = "";
        isAdmin.value = false;
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
                <!-- Admin Panel Button -->
                <router-link
                    v-if="isAdmin"
                    to="/admin"
                    class="btn btn-warning rounded-pill text-white fw-bold"
                >
                    Admin Panel
                </router-link>

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

// ... existing code ...
<style scoped>
.navbar {
    background-color: #FFFFFF;
    border-bottom: 1px solid #E2E2E2;
    padding: 10px 20px;
}

button:hover {
    background-color: #A52622;
}

.btn {
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

.fx-w {
    position: relative;
    background-color: #F1F2F2;
}

.fx-w:hover {
    background-color: #2B2B2B;
    color: #FFFFFF;
}

.btn-primary {
    background-color: #B92B27;
    border-color: #B92B27;
}

.btn-primary:hover {
    background-color: #A52622;
    border-color: #A52622;
}

.btn-secondary {
    background-color: #636466;
    border-color: #636466;
}

.btn-secondary:hover {
    background-color: #2B2B2B;
    border-color: #2B2B2B;
}

.btn-success {
    background-color: #2E7D32;
    border-color: #2E7D32;
}

.btn-success:hover {
    background-color: #1B5E20;
    border-color: #1B5E20;
}

.btn-warning {
    background-color: #F57C00;
    border-color: #F57C00;
}

.btn-warning:hover {
    background-color: #E65100;
    border-color: #E65100;
}

.btn-danger {
    background-color: #B92B27;
    border-color: #B92B27;
}

.btn-danger:hover {
    background-color: #A52622;
    border-color: #A52622;
}
</style>
// ... existing code ...