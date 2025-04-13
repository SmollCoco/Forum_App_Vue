// src/composables/useUserInfo.js
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Fetches user information based on their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Object|null>} - A JSON object containing user info or null if not found.
 */
export async function getUserInfo(username) {
    if (!username) {
        throw new Error("Username is required to fetch user info.");
    }
    try {
        const userDocRef = doc(db, "users", username); // Use username as the document ID
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.warn(`No user found with username: ${username}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}
