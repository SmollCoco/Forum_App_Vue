<script setup>
import { ref, watch } from "vue";
import { DeleteDisc } from "../composables/SupDisc";
import { auth } from "@/firebase";
import { getUserInfo } from "@/composables/useUserInfo";
import { useRouter } from "vue-router";
import { useReport } from "@/composables/useReport";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReportConfirmationModal from "./ReportConfirmationModal.vue";

const optionsShow = ref(false);
const showReportModal = ref(false);
const router = useRouter();
const { reportMessage, canReport } = useReport();

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
});

const disable = ref([false, false]); // [Edit Disabled, Delete Disabled]

watch(
    () => [props.id, props.username],
    async () => {
        const user = auth.currentUser;
        if (user) {
            const userInfo = await getUserInfo(user.displayName);
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userRole = userDoc.data()?.role;

            // Disable edit if not the owner
            disable.value[0] = user.displayName !== props.username;

            // Enable delete if user is owner, admin, or moderator
            disable.value[1] = !(
                user.displayName === props.username ||
                userInfo?.isAdmin ||
                userRole === "moderator"
            );
        } else {
            disable.value = [true, true]; // Disable all actions if not logged in
        }
    },
    { immediate: true }
);

const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this discussion?")) {
        await DeleteDisc(props.id, router);
    }
};

const handleReport = async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to report content");
        return;
    }

    console.log("Checking if user can report...");
    const canUserReport = await canReport(user.uid, props.id);
    console.log("Can user report:", canUserReport);

    if (!canUserReport) {
        alert("You have already reported this content");
        return;
    }

    showReportModal.value = true;
};

const handleReportConfirm = async (reason) => {
    try {
        console.log("Attempting to report content...");
        const success = await reportMessage(
            props.id,
            auth.currentUser.uid,
            reason
        );
        console.log("Report success:", success);

        if (success) {
            alert("Content reported successfully");
        } else {
            alert("Failed to report content. Please try again.");
        }
    } catch (error) {
        console.error("Error in handleReport:", error);
        alert("Failed to report content. Please try again.");
    } finally {
        showReportModal.value = false;
    }
};

const handleReportCancel = () => {
    showReportModal.value = false;
};
</script>

<template>
    <div class="d-flex flex-column">
        <div
            v-show="optionsShow"
            class="btn-group-vertical"
            role="group"
            aria-label="Vertical button group"
        >
            <!-- Edit Button -->
            <button
                class="btn btn-outline-success d-flex border-black"
                :disabled="disable[0]"
            >
                <RouterLink
                    :to="`/modify/${props.username}/${props.id}`"
                    class="fw-bold text-black text-decoration-none d-flex"
                >
                    <span class="material-icons">edit</span>
                    Edit
                </RouterLink>
            </button>

            <!-- Delete Button -->
            <button
                type="button"
                class="btn btn-outline-danger d-flex border-black"
                :disabled="disable[1]"
                @click="handleDelete"
            >
                <span class="material-icons">delete</span>
                Delete
            </button>

            <!-- Report Button -->
            <button
                type="button"
                class="btn btn-outline-warning d-flex border-black"
                @click="handleReport"
            >
                <span class="material-icons">report</span>
                Report
            </button>
        </div>
        <div
            class="btn rounded fw-bold fx-w d-flex"
            @click="optionsShow = !optionsShow"
        >
            <span class="material-icons">more_vert</span>
            Options
        </div>

        <!-- Report Confirmation Modal -->
        <ReportConfirmationModal
            :show="showReportModal"
            @confirm="handleReportConfirm"
            @cancel="handleReportCancel"
        />
    </div>
</template>

<style scoped>
.fx-w {
    width: 110px;
    position: relative;
    background-color: rgb(219, 219, 219);
}
.fx-w:hover {
    background-color: black;
    color: white;
}

/* Ensure disabled buttons are grayed out */
button:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
    border: 1px solid #d0d0d0;
    opacity: 0.6;
}
</style>
