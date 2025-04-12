import { auth, db } from "@/firebase";
import { updateEmail, deleteUser, sendEmailVerification } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * Update the user's profile information.
 * @param {string} name - The new name for the user.
 * @param {string} email - The new email for the user.
 * @param {string} profilePicture - The new profile picture for the user.
 */
export async function updateProfileInfo({ name, email, profilePicture }) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in.");
    }

    const userDocRef = doc(db, "users", user.uid);

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (profilePicture) updates.pfp = profilePicture;

    try {
        // Update Firestore user document
        await updateDoc(userDocRef, updates);

        // Update email in Firebase Auth if provided
        if (email) {
            await updateEmail(user, email);
        }
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            throw new Error(
                "This email is already in use. Please use a different email."
            );
        } else if (error.code === "auth/invalid-email") {
            throw new Error(
                "The email address is invalid. Please enter a valid email."
            );
        } else {
            console.error("Error updating profile info:", error);
            throw error;
        }
    }
}

/**
 * Delete the user's account.
 */
export async function deleteUserAccount() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in.");
    }

    const userDocRef = doc(db, "users", user.uid);

    try {
        await deleteDoc(userDocRef);
        await deleteUser(user);
    } catch (error) {
        if (error.code === "auth/requires-recent-login") {
            throw new Error("You need to log in again to delete your account.");
        } else {
            console.error("Error deleting user account:", error);
            throw error;
        }
    }
}

/**
 * Send an email verification to the current user.
 */
export async function sendVerificationEmail() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in.");
    }

    try {
        await sendEmailVerification(user);
        alert("Verification email sent. Please check your inbox.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email. Please try again.");
    }
}
