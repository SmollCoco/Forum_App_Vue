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
    <div class="edit-profile-container">
        <h1 class="edit-profile-title">Edit Profile</h1>
        <form @submit.prevent="handleEdit" class="edit-profile-form">
            <div class="form-group">
                <label for="name">Name</label>
                <input
                    id="name"
                    v-model="newName"
                    type="text"
                    placeholder="Enter new name"
                />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    id="email"
                    v-model="newEmail"
                    type="email"
                    placeholder="Enter new email"
                />
            </div>
            <div class="form-group">
                <label for="profile-picture">Profile Picture</label>
                <input
                    id="profile-picture"
                    type="file"
                    @change="handleFileUpload"
                />
                <img
                    v-if="newProfilePicture"
                    :src="newProfilePicture"
                    alt="Profile Preview"
                    class="profile-preview"
                />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? "Saving Changes..." : "Save Changes" }}
            </button>
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
import {
    updateProfileInfo,
    deleteUserAccount,
} from "@/composables/userAccount";
import { getUserInfo } from "@/composables/useUserInfo";

const newName = ref("");
const newEmail = ref("");
const newProfilePicture = ref(null);
const loading = ref(false);
const router = useRouter();

onMounted(async () => {
    if (!auth.currentUser) {
        alert("You must be logged in to edit your profile.");
        router.push("/login");
        return;
    }

    // Fetch current user info
    const userInfo = await getUserInfo(auth.currentUser.displayName);
    if (userInfo) {
        newName.value = userInfo.username || "";
        newEmail.value = userInfo.email || "";
        newProfilePicture.value = userInfo.pfp || null;
    }
});

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            newProfilePicture.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

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
            name: newName.value.trim(),
            email: newEmail.value.trim(),
            profilePicture: newProfilePicture.value,
        };

        await updateProfileInfo(updates);
        alert("Profile updated successfully!");

        // Redirect to the user's profile using their username
        router.push(
            `/profile/${newName.value.trim() || auth.currentUser.displayName}`
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message || "Failed to update profile. Please try again.");
    } finally {
        loading.value = false;
    }
};

const deleteAccount = async () => {
    if (
        confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        )
    ) {
        loading.value = true;
        try {
            await deleteUserAccount();
            alert("Account deleted successfully.");
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert(
                error.message || "Failed to delete account. Please try again."
            );
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
.edit-profile-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
    background-color: var(--background-color);
}

.edit-profile-title {
    text-align: center;
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 20px;
}

.edit-profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input[type="text"],
input[type="email"],
input[type="file"] {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 14px;
}

input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 5px rgba(37, 105, 159, 0.5);
}

button {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.btn-danger {
    background-color: var(--danger-color);
    color: white;
    border: none;
}

.btn-danger:hover {
    background-color: var(--danger-hover);
}

.profile-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 10px;
    border: 2px solid var(--border-color);
}
</style>
