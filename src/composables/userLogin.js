import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function loginUser(email, password) {
    try {
        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Check if the Firestore user document exists using the username
        const username = user.displayName; // Ensure `displayName` is set during registration
        if (!username) {
            throw new Error("Username is missing. Please contact support.");
        }

        const userDocRef = doc(db, "users", username); // Use username as the document ID
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            // If the Firestore document does not exist, log out the user
            await signOut(auth);
            throw new Error(
                "This account has been deleted. Please contact support."
            );
        }

        return user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}
