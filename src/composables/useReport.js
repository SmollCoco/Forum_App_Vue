import { ref } from "vue";
import { db } from "@/firebase";
import {
    doc,
    getDocs,
    collection,
    query,
    where,
    updateDoc,
    increment,
    getDoc,
    arrayUnion,
} from "firebase/firestore";

export function useReport() {
    const isLoading = ref(false);
    const error = ref(null);

    const reportMessage = async (messageId, userId, reason) => {
        try {
            isLoading.value = true;
            const messageRef = doc(db, "discussions", messageId);
            const messageDoc = await getDoc(messageRef);

            if (!messageDoc.exists()) {
                console.error("Discussion not found:", messageId);
                return false;
            }

            await updateDoc(messageRef, {
                reports: increment(1),
                lastReportedAt: new Date(),
                reportedBy: arrayUnion(userId),
                reportReasons: arrayUnion({
                    userId,
                    reason,
                    timestamp: new Date(),
                }),
            });
            return true;
        } catch (err) {
            console.error("Error reporting message:", err);
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const dismissReport = async (messageId) => {
        try {
            isLoading.value = true;
            const messageRef = doc(db, "discussions", messageId);
            const messageDoc = await getDoc(messageRef);

            if (!messageDoc.exists()) {
                console.error("Discussion not found:", messageId);
                return false;
            }

            await updateDoc(messageRef, {
                reports: 0,
                lastReportedAt: null,
                reportedBy: [],
                reportReasons: [],
            });
            return true;
        } catch (err) {
            console.error("Error dismissing report:", err);
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const getReportedMessages = async () => {
        try {
            isLoading.value = true;
            const messagesRef = collection(db, "discussions");
            const q = query(messagesRef, where("reports", ">", 0));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (err) {
            console.error("Error getting reported messages:", err);
            error.value = err.message;
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    const canReport = async (userId, messageId) => {
        try {
            const messageRef = doc(db, "discussions", messageId);
            const messageDoc = await getDoc(messageRef);

            if (!messageDoc.exists()) {
                console.error("Discussion not found:", messageId);
                return false;
            }

            const message = messageDoc.data();
            console.log("Message data:", message); // Debug log

            // If reportedBy doesn't exist or is empty, user can report
            if (!message.reportedBy || message.reportedBy.length === 0) {
                return true;
            }

            // Check if user has already reported
            const hasReported = message.reportedBy.includes(userId);
            console.log("User has reported:", hasReported); // Debug log
            return !hasReported;
        } catch (err) {
            console.error("Error checking if can report:", err);
            error.value = err.message;
            return false;
        }
    };

    return {
        isLoading,
        error,
        reportMessage,
        dismissReport,
        getReportedMessages,
        canReport,
    };
}
