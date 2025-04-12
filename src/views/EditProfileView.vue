<template>
    <div>
        <h1>Edit Profile</h1>
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
import {
    updateProfileInfo,
    deleteUserAccount,
} from "@/composables/userAccount";
import { uploadToGitHub } from "@/composables/uploadToGitHub";

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
            name: newName.value.trim(),
            email: newEmail.value.trim(),
            profilePicture: newProfilePicture.value,
        };

        await updateProfileInfo(updates);
        alert("Profile updated successfully!");

        // Redirect to the user's profile using their UID
        const userId = auth.currentUser?.uid;
        if (userId) {
            router.push(`/profile/${userId}`);
        } else {
            alert("Failed to retrieve user ID. Redirecting to home.");
            router.push("/");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message || "Failed to update profile. Please try again.");
    } finally {
        loading.value = false;
    }
};

const deleteAccount = async () => {
    if (!auth.currentUser) {
        alert("You must be logged in to delete your account.");
        router.push("/login");
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmation) return;

    loading.value = true;

    try {
        await deleteUserAccount();
        alert("Account deleted successfully!");
        router.push("/"); // Redirect to the home page after account deletion
    } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
    } finally {
        loading.value = false;
    }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
            alert(
                "Invalid file type. Please upload a JPEG, PNG, or GIF image."
            );
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert(
                "The selected file is too large. Please upload a file smaller than 5 MB."
            );
            return;
        }

        loading.value = true;

        try {
            const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            newProfilePicture.value = await uploadToGitHub(file, fileName);
            alert("Profile picture uploaded successfully!");
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture. Please try again.");
        } finally {
            loading.value = false;
        }
    }
};
</script>
