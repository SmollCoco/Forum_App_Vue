import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Check if the Firestore user document exists
        const userDocRef = doc(db, "users", user.uid);
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
