import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function loginUser(username, password) {
    try {
        // Validate input values
        if (!username || username.trim() === "") {
            throw new Error("Username cannot be empty.");
        }
        if (!password || password.trim() === "") {
            throw new Error("Password cannot be empty.");
        }

        // Query Firestore to find the user document by username
        const userDocRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            throw new Error("No user found with the provided username.");
        }

        // Get the user's email from the Firestore document
        const userData = userSnapshot.data();
        const email = userData.email;

        if (!email) {
            throw new Error("No email associated with this username.");
        }

        // Sign in the user with the retrieved email and provided password
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        return user;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}
