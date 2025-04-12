<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { get_date_string } from '../composables/dateString'
import { getdiscId } from '@/composables/getDisc_Id';
import TopicItem from './TopicItem.vue';
import DiscussionReplies from './DiscussionReplies.vue';
import ReplyModal from './ReplyModal.vue';
let show_response = ref(false);

const route=useRoute();
let post= reactive({
    id: route.params.id,
    contenu:"",
    titre:"something is wrong",
    date:Date().now,
    topic:[],
    auteur:"yassine",
});


onMounted(
    async ()=>{
        console.log(route.params);
        await getdiscId(route.params.id).then((response) => {
            post.contenu = response.contenu;
            post.titre = response.titre;
            post.date = response.date;
            post.topic = response.topic;
            post.auteur = response.auteur;
        });
        console.log(post);
    }
)

let date_string = computed(() => { return get_date_string(post.date)});
</script>

<template>

    <div class="d-flex justify-content-center">
        <div class="w-75 bg-opacity-10 bg-black rounded">
            <div class="m-2 p-2 rounded border border-black">
                <div class="w-100 d-flex gap-lg-2 flex-column rounded p-2">
                    <!--Header containing the author, the topics and the date-->
                    <div class="d-flex align-items-center gap-lg-2 z-1">
                        <router-link :to="`/profile/${post.auteur}`"
                            class="d-flex gap-2 text-decoration-none align-items-center">
                            <img src="../assets/discussion.png" width="40" class="rounded-circle d-block">
                            <span class="d-block link div-link"> u/{{ post.auteur }}
                            </span>
                        </router-link>
                        <span style="color: gray; font-size: small;"> | {{ date_string }} | </span>
                        <div v-for="(topic, index) of post.topic" :key="index">
                            <topic-item :topic="topic" />
                        </div>
                    </div>
                    <div class="fs-3 fw-bold div-link"> {{ post.titre }}</div>
                    <div> {{ post.contenu }} </div>
                </div>
                <div class="btn rounded-pill fw-bold fx-w" @click="show_response = !show_response">
                    Reply
                </div>
                <reply-modal v-if="show_response" :to_whom="post.auteur" :parent_id="post.id" @cancel="show_response = false" />
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
    width: 75px;
    position: relative;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>
