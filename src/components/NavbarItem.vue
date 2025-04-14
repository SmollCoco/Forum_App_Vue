<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfo } from "@/composables/useUserInfo";
import SearchBar from "./SearchBar.vue";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import logout from "@/composables/userLogout";
import { useRouter } from "vue-router";

const router = useRouter();

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

// Handle logout
const handleLogout = async () => {
    try {
        await logout();
        router.push("/");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

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
        const userDoc = await getDoc(doc(db, "users", user.displayName));
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
</script>

<template>
    <nav class="navbar navbar-expand-lg fixed-top bg-white border-bottom">
        <div class="container-fluid px-4">
            <!-- Logo -->
            <router-link class="navbar-brand" to="/">
                <img src="../assets/logo.png" height="40" alt="Logo" />
            </router-link>

            <!-- Search Bar -->
            <div class="search-wrapper flex-grow-1 mx-4">
                <search-bar />
            </div>

            <!-- User Actions -->
            <div class="navbar-nav align-items-center">
                <div v-if="user_connected" class="d-flex gap-2">
                    <!-- Admin Panel Button -->
                    <router-link
                        v-if="isAdmin"
                        to="/admin"
                        class="btn btn-dark rounded-pill px-3"
                    >
                        <span class="material-icons align-middle me-1"
                            >admin_panel_settings</span
                        >
                        Admin
                    </router-link>

                    <!-- Create Button -->
                    <router-link
                        :to="`/submit/${currentUser?.displayName || 'user'}`"
                        class="btn btn-secondary rounded-pill px-3"
                    >
                        <span class="material-icons align-middle me-1"
                            >add</span
                        >
                        Create
                    </router-link>

                    <!-- Profile Button -->
                    <router-link
                        :to="`/profile/${currentUser?.displayName || 'user'}`"
                        class="btn btn-primary rounded-pill px-3"
                    >
                        <span class="material-icons align-middle me-1"
                            >person</span
                        >
                        Profile
                    </router-link>

                    <!-- Logout Button -->
                    <button
                        class="btn btn-danger rounded-pill px-3"
                        @click="handleLogout"
                    >
                        <span class="material-icons align-middle me-1"
                            >logout</span
                        >
                        Logout
                    </button>
                </div>
                <div v-else class="d-flex gap-2">
                    <!-- Login Button -->
                    <router-link
                        to="/login"
                        class="btn btn-primary rounded-pill px-3"
                    >
                        <span class="material-icons align-middle me-1"
                            >login</span
                        >
                        Login
                    </router-link>

                    <!-- Register Button -->
                    <router-link
                        to="/register"
                        class="btn btn-success rounded-pill px-3"
                    >
                        <span class="material-icons align-middle me-1"
                            >person_add</span
                        >
                        Register
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    height: 64px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-wrapper {
    max-width: 600px;
    min-width: 200px;
}

.btn {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-1px);
}

.material-icons {
    font-size: 20px;
}

.btn-primary {
    background-color: #b92b27;
    border-color: #b92b27;
}

.btn-primary:hover {
    background-color: #a52622;
    border-color: #a52622;
}

.btn-secondary {
    background-color: #636466;
    border-color: #636466;
}

.btn-secondary:hover {
    background-color: #2b2b2b;
    border-color: #2b2b2b;
}

.btn-success {
    background-color: #7c7c7d;
    border-color: #7c7c7d;
}

.btn-success:hover {
    background-color: #6b6b6c;
    border-color: #6b6b6c;
}

.btn-danger {
    background-color: #b92b27;
    border-color: #b92b27;
}

.btn-danger:hover {
    background-color: #a52622;
    border-color: #a52622;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .navbar {
        height: auto;
        padding: 12px 0;
    }

    .container-fluid {
        flex-direction: column;
        gap: 12px;
    }

    .search-wrapper {
        width: 100%;
        max-width: none;
        margin: 8px 0;
    }

    .navbar-nav {
        width: 100%;
        justify-content: center;
    }

    .btn {
        padding: 6px 12px;
        font-size: 13px;
    }

    .material-icons {
        font-size: 18px;
    }
}
</style>
