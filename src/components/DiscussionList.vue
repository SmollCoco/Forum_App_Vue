<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from "vue";
import DiscussionItem from "./DiscussionItem.vue";
import { useStore } from "@/composables/getDiscussions";
import { DateFilter } from "@/composables/date_filter";

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
            <div
                type="button"
                class="btn rounded-pill fw-bold fx-w d-flex align-items-center"
                @click="toggle"
            >
                Date <span class="material-icons">{{ ordre }}</span>
            </div>
        </div>

        <!-- Discussions List -->
        <div class="discussions-container">
            <div class="w-75">
                <hr class="border-1 m-0" />
                <div
                    v-for="discussion in filteredDiscussions"
                    :key="discussion.id"
                >
                    <DiscussionItem
                        :id="discussion.id"
                        :auteur="discussion.auteur"
                        :titre="discussion.titre"
                        :contenu="discussion.contenu"
                        :date="discussion.date"
                        :topic="discussion.topic"
                    />
                    <hr class="border-1 m-0" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.discussion-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.date-sorting-container {
    display: flex;
    justify-content: flex-end;
    width: 75%;
    margin-bottom: 10px;
}

.fx-w {
    width: 90px;
    position: relative;
    background-color: rgb(219, 219, 219);
    align-self: end;
}

.fx-w:hover {
    background-color: black;
    color: white;
}

.discussions-container {
    display: flex;
    justify-content: center;
    width: 100%;
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
