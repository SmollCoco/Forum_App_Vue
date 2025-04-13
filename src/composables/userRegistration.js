import { db, auth } from "@/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

/**
 * Registers a new user and ensures the username is unique.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} username - The user's desired username.
 * @param {string} pfp - The user's profile picture URL.
 * @returns {Promise<Object>} - The created user object.
 * @throws {Error} - If the username is not unique or other errors occur.
 */
export async function registerUser(email, password, username, pfp) {
    try {
        // Check if the username is unique
        const usernameDocRef = doc(db, "usernames", username);
        const usernameSnapshot = await getDoc(usernameDocRef);

        if (usernameSnapshot.exists()) {
            throw new Error(
                "This username is already taken. Please choose a different one."
            );
        }

        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Set the displayName in Firebase Authentication
        await updateProfile(user, { displayName: username });

        // Add the username mapping to Firestore
        await setDoc(usernameDocRef, {
            displayName: username, // Use the username as the unique identifier
        });

        // Add the user to the Firestore database with `username` as the document ID
        const userDocRef = doc(db, "users", username);
        await setDoc(userDocRef, {
            email: email,
            username: username,
            pfp: pfp,
            isAdmin: false, // Default to false; set to true for admins manually
            createdAt: serverTimestamp(),
        });

        return user;
    } catch (error) {
        console.error("Error in registerUser:", error);
        throw error;
    }
}
