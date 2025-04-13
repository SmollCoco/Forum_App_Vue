<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { get_date_string } from "../composables/dateString";
import { getdiscId } from "@/composables/getDisc_Id";
import TopicItem from "./TopicItem.vue";
import DiscussionReplies from "./DiscussionReplies.vue";
import ReplyModal from "./ReplyModal.vue";
import DiscussionSetting from "./DiscussionSetting.vue";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { getUserInfo } from "@/composables/useUserInfo";
import defaultPfp from "@/assets/user.png";

let show_response = ref(false);

const route = useRoute();
const auth = getAuth();

const discussion = ref({});
const replies = ref([]);
const newReply = ref("");
const loading = ref(true);

const userPfp = ref(defaultPfp);

var post = reactive({
    id: route.params.id,
    contenu: "",
    titre: "something is wrong",
    date: Date().now,
    topic: [],
    auteur: "ibhi",
});

const fetchDiscussion = async () => {
    try {
        const discussionRef = doc(db, "discussions", route.params.id);
        const discussionDoc = await getDoc(discussionRef);

        if (discussionDoc.exists()) {
            discussion.value = {
                id: discussionDoc.id,
                ...discussionDoc.data(),
            };
        }
    } catch (error) {
        console.error("Error fetching discussion:", error);
    }
};

const fetchReplies = async () => {
    try {
        const repliesRef = collection(db, "replies");
        const q = query(
            repliesRef,
            where("discussionId", "==", route.params.id)
        );
        const querySnapshot = await getDocs(q);

        replies.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching replies:", error);
    }
};

const submitReply = async () => {
    if (!newReply.value.trim() || !auth.currentUser) return;

    try {
        const replyData = {
            content: newReply.value.trim(),
            discussionId: route.params.id,
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName,
            createdAt: new Date(),
        };

        await addDoc(collection(db, "replies"), replyData);
        newReply.value = "";
        await fetchReplies(); // Refresh replies after submission
    } catch (error) {
        console.error("Error submitting reply:", error);
    }
};

const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

onMounted(async () => {
    console.log(route.params);
    await getdiscId(route.params.id).then((response) => {
        post.contenu = response.contenu;
        post.titre = response.titre;
        post.date = response.date;
        post.topic = response.topic;
        post.auteur = response.auteur;

        // Fetch user profile picture
        getUserInfo(response.auteur)
            .then((userInfo) => {
                if (userInfo?.pfp) {
                    userPfp.value = userInfo.pfp;
                } else {
                    userPfp.value = defaultPfp;
                }
            })
            .catch((error) => {
                console.error("Error fetching user profile picture:", error);
                userPfp.value = defaultPfp;
            });
    });
    console.log("post detail", post);
    await fetchDiscussion();
    await fetchReplies();
    loading.value = false;
});

let date_string = computed(() => {
    return get_date_string(post.date);
});
</script>

<template>
    <div class="discussion-detail">
        <div class="discussion-item">
            <div class="discussion-content">
                <!--Header containing the author, the topics and the date-->
                <div class="discussion-header">
                    <router-link
                        :to="`/profile/${post.auteur}`"
                        class="author-link"
                    >
                        <img
                            :src="userPfp"
                            width="32"
                            height="32"
                            class="profile-picture"
                            alt="Profile"
                            @error="userPfp = defaultPfp"
                        />
                        <span>u/{{ post.auteur }}</span>
                    </router-link>
                    <span class="date">{{ date_string }}</span>
                    <div class="topics">
                        <topic-item
                            v-for="(topic, index) of post.topic"
                            :key="index"
                            :topic="topic"
                        />
                    </div>
                </div>
                <h2 class="discussion-title">{{ post.titre }}</h2>
                <div class="discussion-content-text">{{ post.contenu }}</div>
            </div>

            <div class="discussion-actions">
                <button
                    class="reply-btn"
                    @click="show_response = !show_response"
                >
                    <span class="material-icons">reply</span>
                    Reply
                </button>
                <DiscussionSetting :id="post.id" :username="post.auteur" />
            </div>

            <reply-modal
                v-if="show_response"
                :to_whom="post.auteur"
                :parent_id="post.id"
                @cancel="show_response = false"
            />
        </div>
        <DiscussionReplies :id="post.id" />
    </div>
</template>

<style scoped>
.discussion-detail {
    width: 70%;
    margin: 0 auto;
    padding: 20px;
}

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
    display: flex;
    align-items: center;
    gap: 8px;
}

.profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #b92b27;
    transition: all 0.2s ease;
}

.author-link:hover .profile-picture {
    border-color: #a52622;
    transform: scale(1.05);
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

.discussion-content-text {
    color: #636466;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 16px;
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
@media (max-width: 1200px) {
    .discussion-detail {
        max-width: 900px;
    }
}

@media (max-width: 992px) {
    .discussion-detail {
        max-width: 800px;
    }
}

@media (max-width: 768px) {
    .discussion-detail {
        padding: 16px;
        max-width: 100%;
    }

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
