import { db } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

/**
 * Updates a user's profile information.
 * @param {string} username - The user's username (primary identifier).
 * @param {Object} updates - The fields to update (email, pfp).
 * @returns {Promise<void>}
 * @throws {Error} - If update fails or user not found.
 */
export async function updateUserProfile(username, updates) {
    try {
        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User not found.");
        }

        // Only allow updating specific fields
        const allowedUpdates = {};
        if (updates.email) allowedUpdates.email = updates.email;
        if (updates.pfp !== undefined) allowedUpdates.pfp = updates.pfp;

        await updateDoc(userDocRef, allowedUpdates);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

/**
 * Fetches a user's profile information.
 * @param {string} username - The user's username.
 * @returns {Promise<Object>} - The user's profile data.
 * @throws {Error} - If user not found.
 */
export async function getUserProfile(username) {
    try {
        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User not found.");
        }

        return userDoc.data();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}
