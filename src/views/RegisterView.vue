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
                <label>Name</label>
                <input v-model="name" type="text" />
            </div>
            <div>
                <label>Profile Picture</label>
                <input type="file" @change="handleFileUpload" :disabled="isUploading" />
                <span v-if="isUploading">Uploading...</span>
                <img :src="profilePicture || DEFAULT_PROFILE_PICTURE" alt="Profile Preview" class="profile-preview" />
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
import { registerUser } from "@/composables/userRegistration";
import { useRouter } from "vue-router";
import { uploadToGitHub } from "@/composables/uploadToGitHub";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const profilePicture = ref(null);
const errorMessage = ref("");
const loading = ref(false);
const isUploading = ref(false);
const router = useRouter();

const DEFAULT_PROFILE_PICTURE = "@/src/assets/user.png";

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
            const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
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
    const finalProfilePicture = profilePicture.value || DEFAULT_PROFILE_PICTURE;
    errorMessage.value = "";
    loading.value = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        errorMessage.value = "Please enter a valid email address.";
        loading.value = false;
        return;
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value =
            "Passwords do not match. Please re-enter your password.";
        loading.value = false;
        return;
    }

    const nameRegex = /^[^\d]*$/;
    if (!nameRegex.test(name.value)) {
        errorMessage.value =
            "Name should only contain letters. Please remove any numbers or special characters.";
        loading.value = false;
        return;
    }

    console.log("Registering user with:", {
        email: email.value,
        password: password.value,
        name: name.value,
        profilePicture: finalProfilePicture,
    });

    try {
        const user = await registerUser(
            email.value,
            password.value,
            name.value,
            finalProfilePicture
        );
        console.log("User created:", user);
        alert("Account created successfully!");
        router.push(`/profile/${user.uid}`);
    } catch (err) {
        console.error("Registration error:", err);
        errorMessage.value =
            err.message || "Failed to create account. Please try again.";
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
    margin: 2% auto;
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
