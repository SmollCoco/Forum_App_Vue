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
    </div>
    <div>
        <h1 style="text-align: center; font-size: 2rem; color: #25699f">
            Edit Profile
        </h1>
        <form @submit.prevent="handleEdit">
            <div>
                <label>Name</label>
                <input
                    v-model="newName"
                    type="text"
                    placeholder="Enter new name"
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    v-model="newEmail"
                    type="email"
                    placeholder="Enter new email"
                />
            </div>
            <div>
                <label>Profile Picture</label>
                <input type="file" @change="handleFileUpload" />
                <img
                    v-if="newProfilePicture"
                    :src="newProfilePicture"
                    alt="Profile Preview"
                    style="
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        margin-top: 10px;
                    "
                />
            </div>
            <button type="submit" :disabled="loading">Save Changes</button>
        </form>
        <button
            class="btn btn-danger mt-3"
            @click="deleteAccount"
            :disabled="loading"
        >
            Delete Account
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import { updateProfileInfo } from "@/composables/userAccount";
import { getUserInfo } from "@/composables/useUserInfo";

const newName = ref("");
const newEmail = ref("");
const newProfilePicture = ref(null);
const loading = ref(false);
const router = useRouter();

onMounted(() => {
    if (!auth.currentUser) {
        alert("You must be logged in to edit your profile.");
        router.push("/login");
    }
});

const handleEdit = async () => {
    if (!auth.currentUser) {
        alert("You must be logged in to edit your profile.");
        router.push("/login");
        return;
    }

    if (
        !newName.value.trim() &&
        !newEmail.value.trim() &&
        !newProfilePicture.value
    ) {
        alert("Please provide at least one field to update.");
        return;
    }

    loading.value = true;

    try {
        const updates = {
            username: newName.value.trim(),
            email: newEmail.value.trim(),
            profilePicture: newProfilePicture.value,
        };

        await updateProfileInfo(updates);
        alert("Profile updated successfully!");

        // Redirect to the user's profile using their username
        const userInfo = await getUserInfo(auth.currentUser.uid); // Use username
        if (userInfo?.uid) {
            router.push(`/profile/${userInfo.uid}`);
        } else {
            alert("Failed to retrieve username. Redirecting to home.");
            router.push("/");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message || "Failed to update profile. Please try again.");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 10% auto;
    padding: 20px;
    gap: 20px;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}

form div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input[type="email"],
input[type="password"],
input[type="text"],
input[type="file"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus,
input[type="file"]:focus {
    outline: none;
    border-color: #25699f;
    box-shadow: 0 0 5px rgba(37, 105, 159, 0.5);
}

button {
    padding: 10px;
    background-color: #25699f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #858d95;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.profile-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 10px;
    border: 2px solid #ccc;
}

.error {
    color: red;
    font-size: 14px;
    text-align: center;
}
</style>
