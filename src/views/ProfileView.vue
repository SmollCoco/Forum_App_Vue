<template>
    <div id="all">
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
                                {{ userInfo.username }}
                            </h2>
                            <p class="profile-email">{{ userInfo.email }}</p>
                        </div>
                    </div>
                    <div class="profile-body">
                        <p>
                            <strong>Status:</strong>
                            {{ isLoggedIn ? "Logged In" : "Logged Out" }}
                        </p>
                        <div v-if="isOwnProfile" class="profile-actions">
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
import { auth } from "@/firebase";

const route = useRoute();
const router = useRouter();
const username = route.params.username; // Use username from route params
const userInfo = ref(null);
const discussions = ref([]);
const loading = ref(true);
const isLoggedIn = ref(false);
const isOwnProfile = ref(false);

const { discussions: allDiscussions, fetchDiscussions } = useStore();

onMounted(async () => {
    try {
        loading.value = true;

        // Fetch user info by username
        userInfo.value = await getUserInfo(username);
        if (!userInfo.value) {
            alert("User not found.");
            router.push("/"); // Redirect to home if user not found
            return;
        }
        isLoggedIn.value = !!userInfo.value;

        // Check if this is the user's own profile
        const currentUser = auth.currentUser;
        if (currentUser) {
            isOwnProfile.value = currentUser.displayName === username;
        }

        // Fetch discussions authored by the user
        await fetchDiscussions();
        discussions.value = allDiscussions.value.filter(
            (discussion) => discussion.auteur === username
        );
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Failed to load profile.");
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
    router.push(`/profile/edit`);
};
</script>

<style scoped>
#all {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 64px); /* Subtract navbar height */
    background-color: #f1f2f2;
    margin-top: 64px; /* Add margin for fixed navbar */
}

#body {
    font-family: Arial, sans-serif;
    padding: 24px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.profile-container {
    display: flex;
    min-height: calc(80vh - 64px); /* Adjust for navbar */
    width: 300px;
    flex-shrink: 0;
}

.loading-container {
    text-align: center;
    font-size: 18px;
    color: #636466;
    padding: 20px;
}

.profile-card {
    background-color: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
    padding: 24px;
    height: fit-content;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
    text-align: center;
}

.profile-pic {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #e2e2e2;
    margin-bottom: 16px;
    object-fit: cover;
}

.profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-name {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #2b2b2b;
}

.profile-email {
    font-size: 14px;
    color: #636466;
    margin: 8px 0 0;
}

.profile-body {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e2e2e2;
}

.profile-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    justify-content: center;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-danger {
    background-color: #b92b27;
    color: #ffffff;
}

.btn-danger:hover {
    background-color: #a52622;
    transform: translateY(-1px);
}

.btn-edit {
    background-color: #2b2b2b;
    color: #ffffff;
}

.btn-edit:hover {
    background-color: #6b6b6c;
    color: #ffffff;
    transform: translateY(-1px);
}

.btn-primary {
    background-color: #b92b27;
    color: #ffffff;
    text-decoration: none;
    text-align: center;
    display: inline-block;
    padding: 10px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background-color: #a52622;
    transform: translateY(-1px);
}

.not-logged-in {
    text-align: center;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

#discussions-container {
    flex: 1;
    min-width: 0;
}

.user-discussions {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 24px;
}

.user-discussions ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.discussion-item {
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.discussion-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.discussion-item a {
    color: #2b2b2b;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}

.discussion-item a:hover {
    color: #b92b27;
}

.discussion-item p {
    color: #636466;
    margin-top: 8px;
    line-height: 1.5;
}

/* Add responsive adjustments */
@media (max-width: 768px) {
    #all {
        margin-top: 80px; /* Increase margin for mobile navbar */
    }

    #body {
        flex-direction: column;
        padding: 16px;
    }

    .profile-container {
        width: 100%;
        min-height: auto;
    }

    .profile-card {
        margin-bottom: 24px;
    }

    .profile-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
