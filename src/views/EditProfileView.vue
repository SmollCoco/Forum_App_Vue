<template>
    <div class="edit-profile-wrapper">
        <form @submit.prevent="handleEdit" class="edit-profile-form">
            <h2 class="edit-profile-title">Edit Profile</h2>
            <div class="formitem">
                <label for="name">Name</label>
                <input
                    id="name"
                    v-model="newName"
                    type="text"
                    placeholder="Enter new name"
                    required
                />
            </div>
            <div class="formitem">
                <label for="email">Email</label>
                <input
                    id="email"
                    v-model="newEmail"
                    type="email"
                    placeholder="Enter new email"
                    required
                />
            </div>
            <div class="formitem">
                <label for="profile-picture">Profile Picture</label>
                <input
                    id="profile-picture"
                    type="file"
                    @change="handleFileUpload"
                    :disabled="isUploading"
                    class="file-input"
                />
                <div class="upload-status">
                    <span v-if="isUploading" class="uploading"
                        >Uploading...</span
                    >
                    <img
                        :src="newProfilePicture || DEFAULT_PROFILE_PICTURE"
                        alt="Profile Preview"
                        class="profile-preview"
                    />
                </div>
            </div>
            <button
                type="submit"
                class="submit-btn"
                :disabled="loading || isUploading"
            >
                {{ loading ? "Saving Changes..." : "Save Changes" }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <button
                type="button"
                class="delete-btn"
                @click="deleteAccount"
                :disabled="loading || isUploading"
            >
                Delete Account
            </button>
        </form>
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
import { uploadToGitHub } from "@/composables/uploadToGitHub";
import defaultProfilePic from "@/assets/user.png";

const newName = ref("");
const newEmail = ref("");
const newProfilePicture = ref(null);
const loading = ref(false);
const isUploading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const DEFAULT_PROFILE_PICTURE = defaultProfilePic;

onMounted(async () => {
    if (!auth.currentUser) {
        errorMessage.value = "You must be logged in to edit your profile.";
        router.push("/login");
        return;
    }

    try {
        // Fetch current user info
        const userInfo = await getUserInfo(auth.currentUser.displayName);
        if (userInfo) {
            newName.value = userInfo.username || "";
            newEmail.value = userInfo.email || "";
            newProfilePicture.value = userInfo.pfp || DEFAULT_PROFILE_PICTURE;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        errorMessage.value = "Failed to load user information.";
    }
});

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
            errorMessage.value =
                "Invalid file type. Please upload a JPEG, PNG, or GIF image.";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            errorMessage.value =
                "The selected file is too large. Please upload a file smaller than 5 MB.";
            return;
        }
        isUploading.value = true;
        errorMessage.value = "";

        try {
            const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            newProfilePicture.value = await uploadToGitHub(file, fileName);
            console.log("Uploaded image URL:", newProfilePicture.value);
        } catch (error) {
            console.error(
                "Error uploading profile picture:",
                error.response?.data || error.message
            );
            newProfilePicture.value = DEFAULT_PROFILE_PICTURE;
            errorMessage.value =
                "Failed to upload profile picture. Please try again.";
        } finally {
            isUploading.value = false;
        }
    }
};

const handleEdit = async () => {
    if (!auth.currentUser) {
        errorMessage.value = "You must be logged in to edit your profile.";
        router.push("/login");
        return;
    }

    if (
        !newName.value.trim() &&
        !newEmail.value.trim() &&
        !newProfilePicture.value
    ) {
        errorMessage.value = "Please provide at least one field to update.";
        return;
    }

    loading.value = true;
    errorMessage.value = "";

    try {
        const updates = {
            name: newName.value.trim(),
            email: newEmail.value.trim(),
            profilePicture: newProfilePicture.value,
        };

        await updateProfileInfo(updates);
        router.push(
            `/profile/${newName.value.trim() || auth.currentUser.displayName}`
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        errorMessage.value =
            error.message || "Failed to update profile. Please try again.";
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
        errorMessage.value = "";

        try {
            await deleteUserAccount();
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            errorMessage.value =
                error.message || "Failed to delete account. Please try again.";
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
.edit-profile-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 64px);
    background-color: #f1f2f2;
    margin-top: 64px;
    padding: 24px;
}

.edit-profile-form {
    background: white;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 24px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.edit-profile-title {
    font-size: 24px;
    font-weight: bold;
    color: #2b2b2b;
    margin-bottom: 24px;
    text-align: center;
}

.formitem {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.formitem label {
    font-weight: 500;
    color: #2b2b2b;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease;
}

input:focus {
    outline: none;
    border-color: #b92b27;
}

.file-input {
    border: 1px dashed #e2e2e2;
    padding: 12px;
    cursor: pointer;
}

.file-input:hover {
    border-color: #b92b27;
}

.upload-status {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
}

.uploading {
    color: #636466;
    font-size: 14px;
}

.profile-preview {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 2px solid #e2e2e2;
    object-fit: cover;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #b92b27;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;
}

.submit-btn:hover:not(:disabled) {
    background-color: #a52622;
    transform: translateY(-1px);
}

.submit-btn:disabled {
    background-color: #e2e2e2;
    cursor: not-allowed;
    transform: none;
}

.delete-btn {
    width: 100%;
    padding: 12px;
    background-color: #ffffff;
    color: #b92b27;
    border: 1px solid #b92b27;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
    background-color: #ffebee;
}

.delete-btn:disabled {
    border-color: #e2e2e2;
    color: #636466;
    cursor: not-allowed;
}

.error {
    color: #b92b27;
    font-size: 14px;
    text-align: center;
    margin-top: 12px;
    padding: 8px;
    background-color: #ffebee;
    border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .edit-profile-wrapper {
        margin-top: 80px;
        padding: 16px;
    }

    .edit-profile-form {
        padding: 20px;
    }

    .submit-btn,
    .delete-btn {
        padding: 10px;
        font-size: 14px;
    }
}
</style>
