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

const emit = defineEmits(["clear-topic"]);

async function filterDiscussions() {
    await fetchDiscussions();
    console.log(discussions.value[0].date);

    if (!props.topic) {
        filteredDiscussions.value = discussions.value.filter(
            (disc) => disc.parent == null
        );
    } else {
        console.log("Filtering with topic:", props.topic);
        filteredDiscussions.value = await getTopic_Disc("", props.topic);
        console.log("Filtered results:", filteredDiscussions.value);
    }
}

watch(() => props.topic, filterDiscussions);

onMounted(filterDiscussions);

const ordre = ref("arrow_downward");
function toggle() {
    ordre.value =
        ordre.value === "arrow_upward" ? "arrow_downward" : "arrow_upward";
    filteredDiscussions.value = DateFilter(
        filteredDiscussions.value,
        ordre.value
    );
}
</script>

<template>
    <div class="discussion-list-container">
        <!-- Topic Indicator -->
        <div class="topic-indicator" v-if="props.topic">
            <span class="topic-label">Showing discussions in topic:</span>
            <span class="topic-value">{{ props.topic }}</span>
        </div>

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

.topic-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #e3f2fd;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    color: #1976d2;
}

.topic-label {
    font-weight: 500;
}

.topic-value {
    text-transform: capitalize;
    font-weight: 600;
}

.clear-topic-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #1976d2;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.clear-topic-btn:hover {
    background-color: rgba(25, 118, 210, 0.1);
}

.clear-topic-btn .material-icons {
    font-size: 1.25rem;
}
</style>
