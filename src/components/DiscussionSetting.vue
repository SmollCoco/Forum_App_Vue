<script setup>
import { ref, watch } from "vue";
import { DeleteDisc } from "../composables/SupDisc";
import { auth } from "@/firebase";
import { getUserInfo } from "@/composables/useUserInfo";
import { useRouter } from "vue-router";
import { reportDiscussion } from "@/composables/SignalerDisc";

const optionsShow = ref(false);
const router = useRouter();

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
            disable.value[0] = user.displayName !== props.username; // Disable edit if not the owner
            disable.value[1] = !(
                user.displayName === props.username || userInfo?.isAdmin
            ); // Disable delete if not the owner or admin
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
    try {
        await reportDiscussion(props.id);
        alert("Discussion reported successfully.");
    } catch (error) {
        console.error("Error reporting discussion:", error);
        alert("Failed to report discussion. Please try again.");
    }
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
