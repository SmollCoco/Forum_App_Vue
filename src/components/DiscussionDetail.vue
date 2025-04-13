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

let show_response = ref(false);

const route = useRoute();
const auth = getAuth();

const discussion = ref({});
const replies = ref([]);
const newReply = ref("");
const loading = ref(true);

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
    <div class="d-flex justify-content-center">
        <div class="w-75 bg-opacity-10 bg-black rounded">
            <div class="m-2 p-2 rounded border border-black">
                <div class="w-100 d-flex gap-lg-2 flex-column rounded p-2">
                    <!--Header containing the author, the topics and the date-->
                    <div class="d-flex align-items-center gap-lg-2 z-1">
                        <router-link
                            :to="`/profile/${post.auteur}`"
                            class="d-flex gap-2 text-decoration-none align-items-center"
                        >
                            <img
                                src="../assets/discussion.png"
                                width="40"
                                class="rounded-circle d-block"
                            />
                            <span class="d-block link div-link">
                                u/{{ post.auteur }}
                            </span>
                        </router-link>
                        <span style="color: gray; font-size: small">
                            | {{ date_string }} |
                        </span>
                        <div v-for="(topic, index) of post.topic" :key="index">
                            <topic-item :topic="topic" />
                        </div>
                    </div>
                    <div class="fs-3 fw-bold div-link">{{ post.titre }}</div>
                    <div>{{ post.contenu }}</div>
                </div>
                <div
                    class="w-100 d-flex gap-lg-2 justify-content-between rounded p-2"
                >
                    <div
                        class="reply-btn rounded-pill fw-bold fx-w h-25 align-self-end p-1 d-flex"
                        @click="show_response = !show_response"
                    >
                        <span class="material-icons">reply</span>
                        Reply
                    </div>
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
    </div>
</template>

<style scoped>
.link {
    font-weight: 500;
    color: black;
    text-decoration: none;
}

.link:hover {
    color: rgb(10, 73, 209);
}

.r-link {
    font-weight: 500;
    color: black;
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.05);
}

.fx-w {
    width: 90px;
    position: relative;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>
