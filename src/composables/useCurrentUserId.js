import { ref, onMounted, onUnmounted } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const currentUserId = ref(null);

export function useCurrentUserId() {
    let unsubscribe;

    onMounted(() => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            currentUserId.value = user ? user.uid : null;
        });
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    return {
        currentUserId,
    };
}
