<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SearchBar from "./SearchBar.vue";

const props = defineProps({
    username: {
        type: String,
        default: "",
    },
});

let user_connected = ref(false);
let currentUser = ref(null);

onAuthStateChanged(auth, (user) => {
    if (user) {
        user_connected.value = true;
        currentUser.value = user;
    } else {
        user_connected.value = false;
        currentUser.value = null;
    }
});

const logout = () => {
    auth.signOut();
};
</script>

<template>
    <div
        class="navbar navbar-expand d-flex justify-content-between p-3 border-bottom"
    >
        <div>
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <search-bar class="my-2" />
        <div>
            <div v-if="user_connected">
                <button class="btn btn-primary rounded-pill">
                    <router-link
                        :to="`/profile/${currentUser?.uid || 'user'}`"
                        class="nav-link active"
                        aria-current="page"
                    >
                        <span class="fw-bold text-white">Profile</span>
                    </router-link>
                </button>
                <button class="btn btn-danger rounded-pill" @click="logout">
                    Logout
                </button>
            </div>
            <div v-else class="d-flex gap-3">
                <button class="btn btn-primary rounded-pill">
                    <router-link
                        to="/login"
                        class="nav-link active"
                        aria-current="page"
                    >
                        <span class="fw-bold text-white">Login</span>
                    </router-link>
                </button>
                <button class="btn btn-success rounded-pill">
                    <router-link
                        to="/register"
                        class="nav-link active"
                        aria-current="page"
                    >
                        <span class="fw-bold text-white">Register</span>
                    </router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Vos styles ici */
</style>
