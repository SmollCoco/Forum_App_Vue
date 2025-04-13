<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="modal" @click.self="handleCancel">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Report Content</h2>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">
                            Please select a reason for reporting this content:
                        </p>

                        <div class="report-options">
                            <label class="option-item">
                                <input
                                    type="radio"
                                    value="inappropriate"
                                    v-model="selectedReason"
                                />
                                <span>Inappropriate Content</span>
                            </label>

                            <label class="option-item">
                                <input
                                    type="radio"
                                    value="spam"
                                    v-model="selectedReason"
                                />
                                <span>Spam or Advertisement</span>
                            </label>

                            <label class="option-item">
                                <input
                                    type="radio"
                                    value="harassment"
                                    v-model="selectedReason"
                                />
                                <span>Harassment or Bullying</span>
                            </label>

                            <label class="option-item">
                                <input
                                    type="radio"
                                    value="other"
                                    v-model="selectedReason"
                                />
                                <span>Other</span>
                            </label>
                        </div>

                        <div
                            v-if="selectedReason === 'other'"
                            class="other-reason"
                        >
                            <textarea
                                v-model="otherReasonText"
                                placeholder="Please specify the reason..."
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-cancel" @click="handleCancel">
                            Cancel
                        </button>
                        <button
                            class="btn-report"
                            @click="handleConfirm"
                            :disabled="!isValid"
                        >
                            Report
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";

defineProps({
    show: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["confirm", "cancel"]);

const selectedReason = ref("");
const otherReasonText = ref("");

const isValid = computed(() => {
    if (!selectedReason.value) return false;
    if (selectedReason.value === "other" && !otherReasonText.value.trim())
        return false;
    return true;
});

const handleConfirm = () => {
    if (!isValid.value) return;

    const reason =
        selectedReason.value === "other"
            ? otherReasonText.value
            : selectedReason.value;

    emit("confirm", reason);
    resetForm();
};

const handleCancel = () => {
    emit("cancel");
    resetForm();
};

const resetForm = () => {
    selectedReason.value = "";
    otherReasonText.value = "";
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 70%;
    max-width: 500px;
}

.modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.modal-body {
    padding: 20px;
}

.modal-description {
    margin: 0 0 16px 0;
    color: #666;
}

.report-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.option-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.option-item:hover {
    background-color: #f5f5f5;
}

.option-item input[type="radio"] {
    margin: 0;
}

.other-reason {
    margin-top: 16px;
}

.other-reason textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
}

.modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel,
.btn-report {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.btn-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.btn-cancel:hover {
    background-color: #d0d0d0;
}

.btn-report {
    background-color: #f44336;
    color: white;
}

.btn-report:hover:not(:disabled) {
    background-color: #e53935;
}

.btn-report:disabled {
    background-color: #ffcdd2;
    cursor: not-allowed;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.95);
}
</style>
