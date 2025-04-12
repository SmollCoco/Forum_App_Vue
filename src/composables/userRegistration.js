// src/composables/userRegistration.js
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * registerUser creates both the Firebase Auth user and a Firestore record
 * for that user. If your Firestore rules forbid changing isAdmin, you can
 * still pass "isAdmin: false" on creation.
 */
export async function registerUser(email, password, name, pfp) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email: email,
            name: name,
            pfp: pfp,
            isAdmin: false,
            createdAt: serverTimestamp(),
        });

        return user;
    } catch (error) {
        console.error("Error in registerUser:", error.code, error.message);
        if (error.code === "auth/email-already-in-use") {
            throw new Error(
                "This email is already in use. Please use a different email."
            );
        } else if (error.code === "auth/weak-password") {
            throw new Error(
                "The password is too weak. Please use a stronger password."
            );
        } else if (error.code === "auth/invalid-email") {
            throw new Error(
                "The email address is invalid. Please enter a valid email."
            );
        } else {
            throw new Error("Failed to register. Please try again.");
        }
    }
}
