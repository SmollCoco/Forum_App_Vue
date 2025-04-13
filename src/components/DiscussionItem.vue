<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed } from "vue";
import TopicItem from "./TopicItem.vue";
import ReplyModal from "./ReplyModal.vue";
import { get_date_string } from "../composables/dateString";
import DiscussionSetting from "./DiscussionSetting.vue";

const props = defineProps({
    id: {
        type: String,
        required: true,
        default: "id",
    },
    auteur: {
        type: String,
        required: true,
        default: "Yassine",
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    titre: {
        type: String,
        required: true,
        default: "Dummy Post",
    },
    topic: {
        type: Array,
        required: true,
        default: () => ["Friendship", "Leadership"],
    },
    contenu: {
        type: String,
        required: true,
        default: "Some content",
    },
});

let date_string = computed(() => {
    return get_date_string(props.date);
});

let preview = computed(() => {
    return props.contenu.substring(0, 50);
});

let show_response = ref(false);
</script>

<template>
    <div class="discussion-item">
        <router-link :to="`/discussion/${id}`" class="discussion-content">
            <!--Header containing the author, the topics and the date-->
            <div class="discussion-header">
                <router-link :to="`/profile/${auteur}`" class="author-link">
                    <span>u/{{ auteur }}</span>
                </router-link>
                <span class="date">{{ date_string }}</span>
                <div class="topics">
                    <topic-item
                        v-for="(i, index) of topic"
                        :key="index"
                        :topic="i"
                    />
                </div>
            </div>
            <h2 class="discussion-title">{{ titre }}</h2>
            <div class="discussion-preview">{{ preview }}</div>
        </router-link>

        <div class="discussion-actions">
            <button class="reply-btn" @click="show_response = !show_response">
                <span class="material-icons">reply</span>
                Reply
            </button>
            <DiscussionSetting :id="id" :username="auteur" />
        </div>

        <reply-modal
            v-if="show_response"
            :to_whom="auteur"
            :parent_id="id"
            @cancel="show_response = false"
        />
    </div>
</template>

<style scoped>
.discussion-item {
    background-color: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

.discussion-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.discussion-content {
    display: block;
    text-decoration: none;
    color: inherit;
}

.discussion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.author-link {
    text-decoration: none;
    color: #b92b27;
    font-weight: 500;
    transition: color 0.2s ease;
}

.author-link:hover {
    color: #a52622;
}

.date {
    color: #636466;
    font-size: 0.9rem;
}

.topics {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.discussion-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 12px;
    color: #b92b27;
    line-height: 1.3;
    transition: color 0.2s ease;
}

.discussion-content:hover .discussion-title {
    color: #a52622;
}

.discussion-preview {
    color: #636466;
    font-size: 0.95rem;
    line-height: 1.5;
}

.discussion-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #e2e2e2;
}

.reply-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    background-color: #f1f2f2;
    padding: 8px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: #2b2b2b;
    border: none;
}

.reply-btn:hover {
    background-color: #2b2b2b;
    color: #ffffff;
}

.reply-btn .material-icons {
    font-size: 18px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .discussion-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .discussion-title {
        font-size: 1.1rem;
    }

    .discussion-item {
        padding: 16px;
    }
}
</style>
