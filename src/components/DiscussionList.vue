<script setup>
import { ref, onMounted, watch } from "vue";
import DiscussionItem from "./DiscussionItem.vue";
import { useStore } from "@/composables/getDiscussions";
import { getTopic_Disc } from "@/composables/getTopic_Disc";
import { DateFilter } from "@/composables/date_filter";

const props = defineProps({
    topic: {
        type: String,
        required: false,
        default: "",
    },
});

const { discussions, fetchDiscussions } = useStore();
const filteredDiscussions = ref([]);
const ordre = ref("arrow_downward");

async function filterDiscussions() {
    await fetchDiscussions();
    filteredDiscussions.value = discussions.value.filter(
        (discussion) => discussion.parent == null
    );
}

function toggle() {
    ordre.value =
        ordre.value === "arrow_upward" ? "arrow_downward" : "arrow_upward";
    filteredDiscussions.value = DateFilter(
        filteredDiscussions.value,
        ordre.value
    );
}

onMounted(filterDiscussions);
</script>

<template>
    <div class="discussion-list-container">
        <!-- Date Sorting Button -->
        <div class="date-sorting-container">
            <button class="sort-button" @click="toggle">
                Date <span class="material-icons">{{ ordre }}</span>
            </button>
        </div>

        <!-- Discussions List -->
        <div class="discussions-wrapper">
            <DiscussionItem
                v-for="discussion in filteredDiscussions"
                :key="discussion.id"
                :id="discussion.id"
                :auteur="discussion.auteur"
                :titre="discussion.titre"
                :contenu="discussion.contenu"
                :date="discussion.date"
                :topic="discussion.topic"
            />
        </div>
    </div>
</template>

<style scoped>
.discussion-list-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.date-sorting-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.sort-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #f1f2f2;
    border: 1px solid #e2e2e2;
    border-radius: 999px;
    color: #2b2b2b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.sort-button:hover {
    background-color: #2b2b2b;
    color: #ffffff;
    transform: translateY(-1px);
}

.sort-button .material-icons {
    font-size: 18px;
}

.discussions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .discussion-list-container {
        padding: 16px;
    }

    .sort-button {
        padding: 6px 12px;
        font-size: 14px;
    }
}

.r-link {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
    padding: 16px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
}

.r-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

.reply-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 8px 16px;
    border-radius: 999px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.reply-btn:hover {
    background-color: var(--primary-hover);
}
</style>
