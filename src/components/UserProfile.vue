<template>
    <div id="body">
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <div class="profile-container">
            <div v-if="userId" class="profile-card">
                <div class="profile-header">
                    <img v-if="userInfo && userInfo.pfp" :src="userInfo.pfp" alt="Profile Picture"
                        class="profile-pic" />
                    <img v-else src="https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg"
                        alt="Default Profile Picture" class="profile-pic" />
                    <div class="profile-info">
                        <h2 class="profile-name">{{ userInfo.name }}</h2>
                        <p class="profile-email">{{ userInfo.email }}</p>
                    </div>
                </div>
                <div class="profile-body">
                    <p>
                        <strong>Status:</strong>
                        {{ isLoggedIn ? "Logged In" : "Logged Out" }}
                    </p>
                    <div class="profile-actions">
                        <button class="btn btn-danger" @click="handleLogout">Logout</button>
                        <button class="btn btn-edit">Edit profile</button>
                    </div>
                </div>
            </div>
            <div v-else class="not-logged-in">
                <p>You are not logged in.</p>
                <router-link to="/login" class="btn btn-primary">Login</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
#body {
    font-family: Arial, sans-serif;
    background-color: #f6f8fa;
    padding: 20px;
}

#header {
    display: flex;
    margin-bottom: 20px;
}

.profile-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 80vh;
}

.profile-card {
    /* background-color: #ffffff; */
    border: 1px solid #d0d7de;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 30%;
    padding: 20px;
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #d0d7de;
    margin-right: 20px;
}

.profile-info {
    display: flex;
    flex-direction: column;
}

.profile-name {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
}

.profile-email {
    font-size: 14px;
    color: #57606a;
    margin: 5px 0 0;
}

.profile-body {
    margin-top: 20px;
}

.profile-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

.btn-danger {
    background-color: #d73a49;
    color: #ffffff;
}

.btn-danger:hover {
    background-color: #c5303f;
}

.btn-edit {
    background-color: #0366d6;
    color: #ffffff;
}

.btn-edit:hover {
    background-color: #0353b4;
}

.btn-primary {
    background-color: #2ea44f;
    color: #ffffff;
    text-decoration: none;
    text-align: center;
    display: inline-block;
    padding: 10px 15px;
    border-radius: 5px;
}

.btn-primary:hover {
    background-color: #22863a;
}

.not-logged-in {
    text-align: center;
}
</style>
<script setup>
import { ref, watch } from 'vue'
import { useCurrentUserId } from "@/composables/useCurrentUserId.js"
import { getUserInfo } from "@/composables/useUserInfo.js"
import { authStateListener } from "@/composables/authStateListener.js"
import logout from "@/composables/userLogout.js"
import { useRouter } from "vue-router"

const { currentUserId } = useCurrentUserId()
const userId = currentUserId
const userInfo = ref(null)
const isLoggedIn = ref(false)
const router = useRouter()

// 1) Watch userId
watch(userId, async (newVal) => {
    if (newVal) {
        try {
            const user = await getUserInfo(newVal)
            userInfo.value = user
        } catch (error) {
            console.error("Error fetching user info:", error)
        }
    } else {
        userInfo.value = null
    }
})

// 2) Listen to auth changes for isLoggedIn
authStateListener((status) => {
    isLoggedIn.value = status
})

// 3) Handle logout
const handleLogout = async () => {
    try {
        await logout()
        router.push("/")
    } catch (error) {
        console.error("Logout failed:", error)
    }
}
</script>