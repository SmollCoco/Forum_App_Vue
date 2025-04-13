import { auth, db } from "@/firebase";
import { deleteUser, signOut, updateEmail, updateProfile } from "firebase/auth";
import {
    doc,
    deleteDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    getDoc,
    setDoc,
} from "firebase/firestore";

/**
 * Delete the user's account and related discussions.
 */
export async function deleteUserAccount() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in.");
    }

    const username = user.displayName; // Use the username as the identifier
    const userDocRef = doc(db, "users", username);

    try {
        // Delete all discussions authored by the user
        const discussionsQuery = query(
            collection(db, "discussions"),
            where("auteur", "==", username)
        );
        const discussionsSnapshot = await getDocs(discussionsQuery);

        if (!discussionsSnapshot.empty) {
            const batch = writeBatch(db);
            discussionsSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // Delete the user's Firestore document
        await deleteDoc(userDocRef);

        // Delete the user's Firebase Auth account
        await deleteUser(user);

        // Log out the user
        await signOut(auth);
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
 * Update the user's profile information.
 * @param {Object} updates - The updates to apply (e.g., name, email, profilePicture).
 */
export async function updateProfileInfo({ name, email, profilePicture }) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in.");
    }

    const currentUsername = user.displayName; // Current username
    const userDocRef = doc(db, "users", currentUsername);

    const updates = {};
    if (name) updates.username = name; // Update username in Firestore
    if (email) updates.email = email;
    if (profilePicture) updates.pfp = profilePicture;

    try {
        // Update Firestore user document
        await updateDoc(userDocRef, updates);

        // If the username is being updated, rename the Firestore document
        if (name && name !== currentUsername) {
            const newUserDocRef = doc(db, "users", name);

            // Copy the existing document to the new username
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                await setDoc(newUserDocRef, userSnapshot.data());
                await deleteDoc(userDocRef); // Delete the old document
            }

            // Update the username in Firebase Auth
            await updateProfile(user, { displayName: name });

            // Update the author's name in all discussions
            const discussionsQuery = query(
                collection(db, "discussions"),
                where("auteur", "==", currentUsername)
            );
            const discussionsSnapshot = await getDocs(discussionsQuery);
            const batch = writeBatch(db);
            discussionsSnapshot.forEach((doc) => {
                batch.update(doc.ref, { auteur: name });
            });
            await batch.commit();
        }

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
