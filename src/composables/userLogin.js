import { db, auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

/**
 * Logs in a user using their username and password.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The logged-in user object.
 * @throws {Error} - If login fails or user data is not found.
 */
export async function loginUser(username, password) {
    try {
        // First, get the user document to find their email
        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User not found.");
        }

        const userData = userDoc.data();

        // Use the email from the user document to sign in
        const userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            password
        );

        return {
            ...userData,
            uid: userCredential.user.uid,
        };
    } catch (error) {
        console.error("Error in loginUser:", error);
        throw error;
    }
}
