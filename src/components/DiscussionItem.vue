<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed } from "vue";
import TopicItem from "./TopicItem.vue";
import ReplyModal from "./ReplyModal.vue";
import { get_date_string } from "../composables/dateString";
import DiscussionSetting from "./DiscussionSetting.vue";
import { reportDiscussion } from "@/composables/SignalerDisc";

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

const handleReport = async () => {
    await reportDiscussion(props.id);
};
</script>

<template>
    <div class="discussion-item">
        <!-- Link to the discussion -->
        <router-link :to="`/discussion/${id}`" class="discussion-link">
            <div class="discussion-header">
                <!-- Author and date -->
                <router-link :to="`/profile/${auteur}`" class="author-link">
                    <span class="author">u/{{ auteur }}</span>
                </router-link>
                <span class="date">| {{ date_string }} |</span>
                <!-- Topics -->
                <div class="topics">
                    <topic-item
                        v-for="(i, index) in topic"
                        :key="index"
                        :topic="i"
                    />
                </div>
            </div>
            <!-- Title and preview -->
            <div class="discussion-title">{{ titre }}</div>
            <div class="discussion-preview">{{ preview }}</div>
        </router-link>

        <!-- Actions: Reply and Settings -->
        <div class="discussion-actions">
            <button class="reply-btn" @click="show_response = !show_response">
                Reply
            </button>
            <DiscussionSetting :id="id" :username="auteur" />
        </div>

        <!-- Reply Modal -->
        <reply-modal
            v-if="show_response"
            :to_whom="auteur"
            :parent_id="id"
            @cancel="show_response = false"
        />
    </div>
</template>

<style scoped>
/* General styling for the discussion item */
.discussion-item {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
    padding: 16px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
}

.discussion-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

/* Link styling */
.discussion-link {
    text-decoration: none;
    color: inherit;
}

/* Header styling */
.discussion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.author-link {
    text-decoration: none;
    color: var(--primary-color);
}

.author-link:hover {
    text-decoration: underline;
}

.author {
    font-weight: bold;
}

.date {
    color: gray;
    font-size: small;
}

.topics {
    display: flex;
    gap: 4px;
}

/* Title and preview styling */
.discussion-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 8px;
}

.discussion-preview {
    color: var(--text-color);
    font-size: 0.95rem;
}

/* Actions styling */
.discussion-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
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
