<template>
    <div id="all">
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <!-- <NavbarItem /> -->
        <div id="body">
            <div class="profile-container">
                <div v-if="loading" class="loading-container">
                    <p>Loading profile...</p>
                </div>
                <div v-else-if="userId" class="profile-card">
                    <div class="profile-header">
                        <img
                            v-if="userInfo && userInfo.pfp"
                            :src="userInfo.pfp"
                            alt="Profile Picture"
                            class="profile-pic"
                        />
                        <img
                            v-else
                            src="../assets/user.png"
                            alt="Default Profile Picture"
                            class="profile-pic"
                        />
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
                            <button
                                class="btn btn-danger"
                                @click="handleLogout"
                            >
                                Logout
                            </button>
                            <button
                                class="btn btn-edit"
                                @click="navigateToEditProfile"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="not-logged-in">
                    <p>You are not logged in.</p>
                    <router-link to="/login" class="btn btn-primary"
                        >Login</router-link
                    >
                </div>
            </div>
            <div id="discussions-container">
                <div class="user-discussions">
                    <!-- <h2>Your Discussions</h2> -->
                    <ul v-if="discussions.length === 0">
                        <li>No discussions found.</li>
                    </ul>
                    <ul>
                        <li
                            v-for="discussion in discussions"
                            :key="discussion.id"
                        >
                            <div
                                v-if="discussion.titre"
                                class="discussion-item"
                            >
                                <router-link
                                    :to="`/discussion/${discussion.id}`"
                                >
                                    <strong>{{ discussion.titre }}</strong>
                                </router-link>
                                <p>{{ discussion.contenu }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#all {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    /* background-color: #f6f8fa; */
}

#body {
    font-family: Arial, sans-serif;
    /* background-color: #f6f8fa; */
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
}

#header {
    display: flex;
    /* justify-content: center; */
    /* margin-bottom: 20px; */
    height: 20%;
}

.profile-container {
    display: flex;
    /* justify-content: center; */
    /* align-items:baseline; */
    min-height: 80vh;
}

.loading-container {
    text-align: center;
    font-size: 18px;
    color: #57606a;
}

.profile-card {
    /* background-color: #f1ebeb; */
    border: 1px solid #d0d7de;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: max-content;
    padding: 20px;
    align-self: flex-start;
    height: 100%;
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-pic {
    width: 70%;
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

/* styles for the discussions list */
#discussions-container {
    display: flex;
    width: 80%;
    height: 100%;
    padding-left: 5%;
}

.user-discussions {
    /* margin-top: 20px; */
    height: 100%;
    width: 100%;
    /* background-color: #f9f9f9; */
}

.user-discussions ul {
    list-style-type: none;
    padding: 0;
}

.discussion-item {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #d0d7de;
    /* border-radius: 5px; */

    width: 100%;
}

/* .discussion-item :hover {
    background-color: #25699f;
} */
</style>
<script setup>
import { ref, watch } from "vue";
import { useCurrentUserId } from "@/composables/useCurrentUserId.js";
import { getUserInfo } from "@/composables/useUserInfo.js";
import { authStateListener } from "@/composables/authStateListener.js";
import { useStore } from "@/composables/getDiscussions.js";
import logout from "@/composables/userLogout.js";
import { useRouter } from "vue-router";

const discussions = ref([]); // Store discussions of the logged-in user

const { discussions: allDiscussions, fetchDiscussions } = useStore();
const { currentUserId } = useCurrentUserId();
const userId = currentUserId;
const userInfo = ref(null);
const isLoggedIn = ref(false);
const loading = ref(true); // Add loading state
const router = useRouter();

// Watch userId and fetch user info
watch(userId, async (newVal) => {
    if (newVal) {
        try {
            loading.value = true; // Start loading
            const user = await getUserInfo(newVal);
            userInfo.value = user;

            // Fetch discussions of the logged-in user
            await fetchDiscussions();
            discussions.value = allDiscussions.value.filter(
                (discussion) =>
                    userInfo.value && discussion.auteur === userInfo.value.name
            );
        } catch (error) {
            console.error("Error fetching user info or discussions:", error);
        } finally {
            loading.value = false; // Stop loading
        }
    } else {
        userInfo.value = null;
        loading.value = false; // Stop loading if no user
        discussions.value = [];
    }
});

// Listen to auth changes for isLoggedIn
authStateListener((status) => {
    isLoggedIn.value = status;
});

// Handle logout
const handleLogout = async () => {
    try {
        await logout();
        router.push("/");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

const navigateToEditProfile = () => {
    try {
        router.push("/profile/edit");
    } catch (error) {
        console.error("Navigation to Edit Profile failed:", error);
        alert("Failed to navigate to Edit Profile. Please try again.");
    }
};
</script>
