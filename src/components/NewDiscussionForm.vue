<template>
    <div class="wrapper">
        <div class="container">
            <h2 class="title">
                {{ modify ? "Update Discussion" : "Create New Discussion" }}
            </h2>
            <form @submit.prevent="submitPost" class="form-group">
                <!-- Topics Section -->
                <div class="topics-container">
                    <h3 class="section-title">Topics</h3>
                    <div class="topics-container">
                        <input
                            v-model="newTopic"
                            @keydown.enter.prevent="addTopic"
                            placeholder="Add a topic and press Enter"
                            class="topic-input"
                        />
                        <div
                            v-for="(topic, index) in topics"
                            :key="index"
                            class="topic-item"
                        >
                            {{ topic }}
                            <button
                                type="button"
                                @click="removeTopic(index)"
                                class="remove-topic"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Title Section -->
                <div class="form-group">
                    <h3 class="section-title">Title</h3>
                    <input
                        v-if="!modify"
                        v-model="title"
                        id="title"
                        placeholder="What's your question?"
                        class="title-input"
                        required
                    />
                    <div v-else class="title-display">
                        {{ title }}
                        <span class="note">(Title cannot be modified)</span>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="form-group">
                    <h3 class="section-title">Content</h3>
                    <div
                        v-if="modify && previousContent"
                        class="previous-content"
                    >
                        <span class="note">Previous Content:</span>
                        <p class="content-text">{{ previousContent }}</p>
                    </div>
                    <textarea
                        v-model="content"
                        placeholder="Write your question in detail..."
                        class="content-input"
                        required
                    ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="submit-btn"
                    :disabled="!title || loading"
                >
                    {{
                        loading
                            ? "Submitting..."
                            : modify
                              ? "Update Discussion"
                              : "Post Discussion"
                    }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const props = defineProps({
    modify: {
        type: Boolean,
        default: false,
    },
    discussionId: {
        type: String,
        default: "",
    },
});

const router = useRouter();
const auth = getAuth();

const title = ref("");
const content = ref("");
const newTopic = ref("");
const topics = ref([]);
const loading = ref(false);
const previousContent = ref("");

onMounted(async () => {
    if (props.modify && props.discussionId) {
        try {
            const discussionRef = doc(db, "discussions", props.discussionId);
            const discussionDoc = await getDoc(discussionRef);

            if (discussionDoc.exists()) {
                const data = discussionDoc.data();
                title.value = data.title;
                content.value = data.content;
                topics.value = data.topics || [];
                previousContent.value = data.content;
            }
        } catch (error) {
            console.error("Error fetching discussion:", error);
        }
    }
});

const addTopic = () => {
    if (
        newTopic.value.trim() &&
        !topics.value.includes(newTopic.value.trim())
    ) {
        topics.value.push(newTopic.value.trim());
        newTopic.value = "";
    }
};

const removeTopic = (index) => {
    topics.value.splice(index, 1);
};

const submitPost = async () => {
    if (!title.value || !content.value) {
        console.error("Title and content are required");
        return;
    }

    loading.value = true;

    try {
        // Check if user is authenticated
        if (!auth.currentUser) {
            console.error("User is not authenticated");
            router.push("/login");
            return;
        }

        const discussionData = {
            auteur: auth.currentUser.displayName,
            contenu: content.value,
            date: new Date(),
            titre: title.value,
            topic: topics.value,
        };

        console.log("Submitting discussion:", discussionData);

        if (props.modify && props.discussionId) {
            const discussionRef = doc(db, "discussions", props.discussionId);
            console.log("Updating existing discussion:", props.discussionId);
            await updateDoc(discussionRef, {
                content: content.value,
                topics: topics.value,
                updatedAt: new Date(),
            });
            console.log("Discussion updated successfully");
        } else {
            console.log("Creating new discussion");
            const docRef = await addDoc(
                collection(db, "discussions"),
                discussionData
            );
            console.log("Discussion created with ID:", docRef.id);
        }

        router.push("/");
    } catch (error) {
        console.error("Error submitting discussion:", error);
        // Show error message to user
        alert("Failed to submit discussion. Please try again.");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.wrapper {
    background-color: #f1f2f2;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.container {
    width: 100%;
    max-width: 800px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    transition: transform 0.2s ease;
}

.container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2b2b2b;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e2e2;
}

.form-group {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 500;
    color: #2b2b2b;
    margin-bottom: 1rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e2e2;
    border-radius: 8px;
    font-size: 1rem;
    color: #2b2b2b;
    background-color: #ffffff;
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #b92b27;
    box-shadow: 0 0 0 3px rgba(185, 43, 39, 0.1);
}

.form-group textarea {
    min-height: 200px;
    resize: vertical;
    line-height: 1.6;
}

.topic-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e2e2;
    border-radius: 8px;
    font-size: 1rem;
    color: #2b2b2b;
    background-color: #ffffff;
    transition: all 0.2s ease;
}

.topic-input:focus {
    outline: none;
    border-color: #b92b27;
    box-shadow: 0 0 0 3px rgba(185, 43, 39, 0.1);
}

.topics-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
}

.topic-item {
    background-color: #f1f2f2;
    color: #2b2b2b;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
}

.topic-item:hover {
    background-color: #e2e2e2;
    transform: translateY(-1px);
}

.topic-item button {
    background: none;
    border: none;
    color: #b92b27;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    transition: color 0.2s ease;
}

.topic-item button:hover {
    color: #a52622;
}

.submit-btn {
    background-color: #b92b27;
    color: #ffffff;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    display: block;
}

.submit-btn:hover {
    background-color: #a52622;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-btn:disabled {
    background-color: #e2e2e2;
    color: #636466;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.previous-content {
    background-color: #f1f2f2;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    color: #636466;
    font-size: 0.875rem;
    white-space: pre-wrap;
    border-left: 4px solid #b92b27;
}

.note {
    color: #636466;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-style: italic;
}

.title-display {
    background-color: #f1f2f2;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: 500;
    color: #2b2b2b;
}

@media (max-width: 768px) {
    .wrapper {
        padding: 1rem;
    }

    .container {
        padding: 1.5rem;
    }

    .title {
        font-size: 1.5rem;
    }

    .section-title {
        font-size: 1.1rem;
    }

    .form-group input,
    .form-group textarea {
        padding: 0.75rem;
    }

    .submit-btn {
        width: 100%;
        max-width: none;
    }
}
</style>
