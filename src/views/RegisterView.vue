<template>
    <div id="register">
        <div id="header">
            <router-link to="/">
                <img src="../assets/logo.png" width="120px" alt="Logo" />
            </router-link>
        </div>
        <form @submit.prevent="handleRegister">
            <div>
                <label>Email</label>
                <input v-model="email" type="email" required />
            </div>
            <div>
                <label>Password</label>
                <input v-model="password" type="password" required />
            </div>
            <div>
                <label>Confirm Password</label>
                <input v-model="confirmPassword" type="password" required />
            </div>
            <div>
                <label>Username</label>
                <input v-model="username" type="text" required />
            </div>
            <div>
                <label>Profile Picture</label>
                <input
                    type="file"
                    @change="handleFileUpload"
                    :disabled="isUploading"
                />
                <span v-if="isUploading">Uploading...</span>
                <img
                    :src="profilePicture || DEFAULT_PROFILE_PICTURE"
                    alt="Profile Preview"
                    class="profile-preview"
                />
            </div>
            <button type="submit" :disabled="loading">
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

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const username = ref("");
const profilePicture = ref(null);
const errorMessage = ref("");
const loading = ref(false);
const isUploading = ref(false);

const DEFAULT_PROFILE_PICTURE = "@/src/assets/user.png";
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
form {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
    padding: 20px;
    width: 100%;
    max-width: 400px;
    margin: auto;
}

form div {
    margin-bottom: 16px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
}

button:hover {
    background-color: var(--primary-hover);
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
