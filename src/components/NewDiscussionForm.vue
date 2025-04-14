<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postDiscussion, postModification } from "@/composables/PostDiscussion";
import TopicItem from "./TopicItem.vue";
import { getdiscId } from "@/composables/getDisc_Id";

// Router setup
const route = useRoute();
const router = useRouter();

// Props
const props = defineProps({
    id: {
        type: String,
        required: true,
        default: "IBHI",
    },
    modify: {
        type: Boolean,
        default: false,
    },
});

// State
const post = reactive({
    auteur: props.id,
    topic: new Set([]),
    titre: "",
    contenu: "",
});

const topic_stream = ref("");
const to_be_edited = ref("");

// Methods
function check_input(key) {
    if (key === " " && topic_stream.value.trim()) {
        post.topic.add(topic_stream.value.trim().toLowerCase());
        topic_stream.value = "";
    }
}

function post_or_modify() {
    if (props.modify) {
        post.contenu = "Edit: " + post.contenu;
        postModification(post, router, route.params.id);
    } else {
        postDiscussion(post, router);
    }
}

// Lifecycle
onMounted(async () => {
    if (props.modify) {
        const id = route.params.id;
        const fetchedPost = await getdiscId(id);
        Object.assign(post, fetchedPost);
        post.topic = new Set(post.topic);
    }
});
</script>

<template>
    <div class="discussion-form">
        <div class="discussion-item">
            <div class="discussion-content">
                <h2 class="discussion-title">
                    {{ modify ? "Modify" : "Create" }} a post
                </h2>
                <form class="form-container">
                    <!-- Topics section -->
                    <div class="topics-section">
                        <div class="section-title">Add topics</div>
                        <div class="topics-container">
                            <TopicItem
                                v-for="(topic, index) of post.topic"
                                :key="index"
                                :topic="topic"
                                deleteable
                                @remove="(topic) => post.topic.delete(topic)"
                            />
                            <input
                                type="text"
                                class="topic-input"
                                placeholder="Add topics, Space will create a new topic"
                                v-model="topic_stream"
                                @keydown="(event) => check_input(event.key)"
                            />
                        </div>
                    </div>

                    <!-- Title section -->
                    <div class="title-section">
                        <input
                            v-if="!modify"
                            type="text"
                            id="title"
                            class="title-input"
                            placeholder="Add title"
                            v-model="post.titre"
                        />
                        <div v-else class="title-display">
                            {{ post.titre }}
                            <span class="title-warning">
                                | you can't modify the title
                            </span>
                        </div>
                    </div>

                    <!-- Content section -->
                    <div class="content-section">
                        <textarea
                            id="floatingTextarea2"
                            class="content-textarea"
                            placeholder="What do you want us to know about you?"
                            v-model="post.contenu"
                        ></textarea>
                    </div>

                    <!-- Submit button -->
                    <button
                        type="button"
                        class="submit-btn"
                        :disabled="!post.titre"
                        @click="post_or_modify"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Layout */
.discussion-form {
    width: 70%;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.discussion-item {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.discussion-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

/* Typography */
.discussion-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    color: #b92b27;
    position: relative;
    padding-bottom: 0.5rem;
}

.discussion-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #b92b27 0%, #ff6b6b 100%);
    border-radius: 2px;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3436;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-title::before {
    content: "•";
    color: #b92b27;
    font-size: 1.5rem;
    line-height: 1;
}

/* Form Elements */
.topics-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.75rem;
    margin: 1.5rem 0;
    border: 1px solid #eceff1;
    transition: all 0.3s ease;
}

.topics-section:hover {
    border-color: rgba(185, 43, 39, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.topics-container {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    min-height: 60px;
    transition: all 0.3s ease;
}

.topics-container:focus-within {
    border-color: rgba(185, 43, 39, 0.3);
    box-shadow: 0 4px 12px rgba(185, 43, 39, 0.1);
}

.topic-input {
    flex: 1;
    min-width: 200px;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: 50px;
    font-size: 0.95rem;
    background: transparent;
    transition: all 0.2s ease;
    color: #2d3436;
}

.topic-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(185, 43, 39, 0.15);
}

.topic-input::placeholder {
    color: #a0a0a0;
    font-weight: 500;
}

/* Add styles for the topic items */
:deep(.topic-item) {
    background: linear-gradient(135deg, #b92b27 0%, #e55039 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(185, 43, 39, 0.1);
}

:deep(.topic-item:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(185, 43, 39, 0.2);
}

:deep(.topic-item .delete-btn) {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    padding: 0;
}

:deep(.topic-item .delete-btn:hover) {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.title-section {
    margin: 2.5rem 0;
}

.title-input,
.title-display {
    width: 100%;
    padding: 1.25rem;
    border: 2px solid #eceff1;
    border-radius: 12px;
    font-size: 1.375rem;
    font-weight: 650;
    transition: all 0.2s ease;
}

.title-input:focus {
    border-color: rgba(185, 43, 39, 0.3);
    box-shadow: 0 4px 12px rgba(185, 43, 39, 0.1);
}

.title-display {
    background: #f8f9fa;
    color: #2d3436;
    border-style: dashed;
}

.title-warning {
    font-size: 0.875rem;
    color: #e74c3c;
    font-weight: 500;
    margin-left: 0.75rem;
    opacity: 0.8;
}

.content-section {
    margin: 2rem 0;
}

.content-textarea {
    width: 100%;
    min-height: 280px;
    padding: 1.5rem;
    border: 2px solid #eceff1;
    border-radius: 16px;
    font-size: 1rem;
    line-height: 1.7;
    transition: all 0.2s ease;
}

.content-textarea:focus {
    border-color: rgba(185, 43, 39, 0.3);
    box-shadow: 0 4px 16px rgba(185, 43, 39, 0.1);
}

.submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, #b92b27 0%, #e55039 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: all 0.25s ease;
    margin-top: 2rem;
    position: relative;
    overflow: hidden;
}

.submit-btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transition: left 0.6s;
}

.submit-btn:hover::after {
    left: 100%;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(185, 43, 39, 0.2);
}

.submit-btn:disabled {
    background: #e0e0e0;
    color: #a0a0a0;
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
    .discussion-item {
        padding: 1.75rem;
        border-radius: 12px;
    }

    .discussion-title {
        font-size: 1.75rem;
    }

    .topics-section {
        padding: 1.25rem;
    }

    .topic-input {
        min-width: 100%;
    }

    .title-input,
    .title-display {
        font-size: 1.25rem;
        padding: 1rem;
    }

    .content-textarea {
        min-height: 220px;
        padding: 1.25rem;
    }
}
</style>
