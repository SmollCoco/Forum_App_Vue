import { ref } from "vue";
import { db } from "@/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";

export function useModerator() {
    const isLoading = ref(false);
    const error = ref(null);

    const assignModerator = async (userId) => {
        try {
            isLoading.value = true;
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                role: "moderator",
            });
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const removeModerator = async (userId) => {
        try {
            isLoading.value = true;
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                role: "user",
            });
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const getModerators = async () => {
        try {
            isLoading.value = true;
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("role", "==", "moderator"));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (err) {
            error.value = err.message;
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    const isModerator = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            return userDoc.data()?.role === "moderator";
        } catch (err) {
            error.value = err.message;
            return false;
        }
    };

    return {
        isLoading,
        error,
        assignModerator,
        removeModerator,
        getModerators,
        isModerator,
    };
}
