<template>
    <div class="register-wrapper">
        <form @submit.prevent="handleRegister" class="register-form">
            <h2 class="register-title">Create Account</h2>
            <div class="formitem">
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" required />
            </div>
            <div class="formitem">
                <label for="username">Username</label>
                <input id="username" v-model="username" type="text" required />
            </div>
            <div class="formitem">
                <label for="password">Password</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                />
            </div>
            <div class="formitem">
                <label for="confirm-password">Confirm Password</label>
                <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
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
                        :src="profilePicture || DEFAULT_PROFILE_PICTURE"
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
                {{ loading ? "Creating Account..." : "Create Account" }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "@/composables/userRegistration";
import { uploadToGitHub } from "@/composables/uploadToGitHub";
import defaultProfilePic from "@/assets/user.png";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const username = ref("");
const profilePicture = ref(null);
const errorMessage = ref("");
const loading = ref(false);
const isUploading = ref(false);

const DEFAULT_PROFILE_PICTURE = defaultProfilePic;
const router = useRouter();

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
            // 5 MB limit
            errorMessage.value =
                "The selected file is too large. Please upload a file smaller than 5 MB.";
            return;
        }
        isUploading.value = true;
        try {
            const fileName = `profile-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 15)}.jpg`;
            profilePicture.value = await uploadToGitHub(file, fileName);
            console.log("Uploaded image URL:", profilePicture.value);
        } catch (error) {
            console.error(
                "Error uploading profile picture:",
                error.response?.data || error.message
            );
            profilePicture.value = null; // Reset profile picture
            errorMessage.value =
                "Failed to upload profile picture. Please try again.";
        } finally {
            isUploading.value = false;
        }
    } else {
        errorMessage.value =
            "No file selected. Please choose a profile picture.";
    }
};

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
    }

    loading.value = true;
    errorMessage.value = "";

    try {
        // eslint-disable-next-line no-unused-vars
        const user = await registerUser(
            email.value,
            password.value,
            username.value,
            profilePicture.value || DEFAULT_PROFILE_PICTURE
        );
        alert("Account created successfully!");
        router.push(`/profile/${username.value}`);
    } catch (error) {
        console.error("Registration error:", error);
        errorMessage.value = error.message || "Failed to create account.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 64px);
    background-color: #f1f2f2;
    margin-top: 64px; /* Add margin for fixed navbar */
    padding: 24px;
}

.register-form {
    background: white;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 24px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.register-title {
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
    .register-wrapper {
        margin-top: 80px; /* Increase margin for mobile navbar */
        padding: 16px;
    }

    .register-form {
        padding: 20px;
    }

    .submit-btn {
        padding: 10px;
        font-size: 14px;
    }
}
</style>
