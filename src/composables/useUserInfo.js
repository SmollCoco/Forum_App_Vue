// src/composables/useUserInfo.js
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserInfo(uid) {
    try {
        const userDocRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.warn(`No user found with UID: ${uid}`);
            return { name: "Unknown User", email: "Unknown Email" }; // Provide default values
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}
