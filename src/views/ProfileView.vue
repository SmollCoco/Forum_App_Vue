<template>
    <div id="all">
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <div id="body">
            <div class="profile-container">
                <div v-if="loading" class="loading-container">
                    <p>Loading profile...</p>
                </div>
                <div v-else-if="userInfo" class="profile-card">
                    <div class="profile-header">
                        <img
                            v-if="userInfo.pfp"
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
                            <h2 class="profile-name">
                                {{ username }}
                            </h2>
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
                    <p>User not found.</p>
                    <router-link to="/login" class="btn btn-primary">
                        Login
                    </router-link>
                </div>
            </div>
            <div id="discussions-container">
                <div class="user-discussions">
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

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserInfo } from "@/composables/useUserInfo";
import { useStore } from "@/composables/getDiscussions";
import logout from "@/composables/userLogout";

const route = useRoute();
const router = useRouter();
const username = route.params.username; // Get username from route params
const userInfo = ref(null);
const discussions = ref([]);
const loading = ref(true);
const isLoggedIn = ref(false);

const { discussions: allDiscussions, fetchDiscussions } = useStore();

onMounted(async () => {
    try {
        loading.value = true;

        // Fetch user info by username
        userInfo.value = await getUserInfo(username);
        console.log(userInfo.value);
        if (!userInfo.value) {
            alert("User not found.");
            router.push("/"); // Redirect to home if user not found
            return;
        }

        // Fetch discussions authored by the user
        await fetchDiscussions();
        discussions.value = allDiscussions.value.filter(
            (discussion) => discussion.auteur === username
        );
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Failed to load profile. Please try again.");
    } finally {
        loading.value = false;
    }
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

// Navigate to edit profile
const navigateToEditProfile = () => {
    router.push("/profile/edit");
};
</script>

<style scoped>
#all {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
}

#body {
    font-family: Arial, sans-serif;
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
}

#header {
    display: flex;
    height: 20%;
}

.profile-container {
    display: flex;
    min-height: 80vh;
}

.loading-container {
    text-align: center;
    font-size: 18px;
    color: #57606a;
}

.profile-card {
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

#discussions-container {
    display: flex;
    width: 80%;
    height: 100%;
    padding-left: 5%;
}

.user-discussions {
    height: 100%;
    width: 100%;
}

.user-discussions ul {
    list-style-type: none;
    padding: 0;
}

.discussion-item {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #d0d7de;
    width: 100%;
}
</style>
