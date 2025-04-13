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
            const userDoc = await getDoc(doc(db, "users", user.displayName));
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
    const canUserReport = await canReport(user.displayName, props.id);
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
            auth.currentUser.displayName,
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
    <div class="settings-container">
        <div
            v-show="optionsShow"
            class="btn-group-vertical"
            role="group"
            aria-label="Vertical button group"
        >
            <!-- Edit Button -->
            <button class="btn btn-outline-success" :disabled="disable[0]">
                <RouterLink
                    :to="`/modify/${props.username}/${props.id}`"
                    class="btn-link"
                >
                    <span class="material-icons">edit</span>
                    Edit
                </RouterLink>
            </button>

            <!-- Delete Button -->
            <button
                type="button"
                class="btn btn-outline-danger"
                :disabled="disable[1]"
                @click="handleDelete"
            >
                <span class="material-icons">delete</span>
                Delete
            </button>

            <!-- Report Button -->
            <button
                type="button"
                class="btn btn-outline-warning"
                @click="handleReport"
            >
                <span class="material-icons">report</span>
                Report
            </button>
        </div>
        <button class="options-btn" @click="optionsShow = !optionsShow">
            <span class="material-icons">more_vert</span>
            Options
        </button>

        <!-- Report Confirmation Modal -->
        <ReportConfirmationModal
            :show="showReportModal"
            @confirm="handleReportConfirm"
            @cancel="handleReportCancel"
        />
    </div>
</template>

<style scoped>
.settings-container {
    position: relative;
    z-index: 100;
}

.options-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #f1f2f2;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    color: #2b2b2b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 110px;
}

.options-btn:hover {
    background-color: #2b2b2b;
    color: #ffffff;
    transform: translateY(-1px);
}

.btn-group-vertical {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e2e2;
    z-index: 1000;
    min-width: 150px;
    overflow: hidden;
}

.btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    text-align: left;
    transition: all 0.2s ease;
    cursor: pointer;
    border-bottom: 1px solid #e2e2e2;
}

.btn:last-child {
    border-bottom: none;
}

.btn-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    width: 100%;
}

.btn-outline-success {
    color: #2e7d32;
}

.btn-outline-success:hover {
    background-color: #e8f5e9;
}

.btn-outline-danger {
    color: #b92b27;
}

.btn-outline-danger:hover {
    background-color: #ffebee;
}

.btn-outline-warning {
    color: #f57c00;
}

.btn-outline-warning:hover {
    background-color: #fff3e0;
}

.material-icons {
    font-size: 20px;
}

/* Ensure disabled buttons are properly styled */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

button:disabled:hover {
    background: none;
    transform: none;
}

button:disabled .btn-link {
    pointer-events: none;
}
</style>
