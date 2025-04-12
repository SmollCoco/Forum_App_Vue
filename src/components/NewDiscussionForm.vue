<!-- eslint-disable no-unused-vars -->
<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { postDiscussion } from '@/composables/PostDiscussion';
import TopicItem from './TopicItem.vue';

const router = useRouter();

const props = defineProps({
    id: {
        type: String,
        required: true,
        default: "IBHI",
    },
    modify: {
        type: Boolean,
        default: false,
    }
});

let post = reactive({
    auteur: props.id,
    topic: new Set([]),
    titre: "",
    contenu: "",
});

let topic_stream = ref("");

function check_input(key) {
    console.log("Great")
    if (key === ' ' && topic_stream.value.trim()){
        post.topic.add(topic_stream.value.trim().toLowerCase());
        topic_stream.value = "";
    }
    console.log(post);
}

</script>

<template>
    <div class="d-flex justify-content-center">
        <div class="w-75  h100">
            <div class="fs-2 fw-bold">
                {{ (modify) ? 'Modify' : 'Create' }} a post
            </div>
            <form class="d-flex flex-column justify-content-evenly h-100">
                <!--Here we will choose the topics-->
                <div class=" mt-5 border rounded p-3">
                    <div class="fs-3 fw-bold ps-1">
                        Add topics
                    </div>
                    <div class="d-flex gap-2 p-2 flex-wrap ps-4">
                        <TopicItem deleteable :topic="topic" @remove="(topic) => topics.delete(topic)"
                            v-for="(topic, index) of post.topic" :key="index" />
                        <input type="text" class="form-control rounded-pill w-25"
                            placeholder="Add topics, Space will create a new topic" v-model="topic_stream"
                            @keydown=" (event) => check_input(event.key)">
                    </div>
                </div>
                <!--Here we add the title-->
                <div>
                    <input type="text" id="title" class="form-control rounded-pill p-4" placeholder="Add title"
                        v-model="post.titre">
                </div>
                <!--Here we add the content-->
                <div class="form-floating">
                    <textarea class="form-control" placeholder="What do you want us to know about you?"
                        id="floatingTextarea2" style="height: 300px"></textarea>
                    <label for="floatingTextarea2">Comments</label>
                </div>
                <!--Here we add the submission button-->
                <input type="button" class="btn rounded-pill fw-bold fx-w" value="Submit" :disabled="!post.titre" @click="postDiscussion(post, router)">
            </form>
        </div>
    </div>
</template>

<style scoped>
#title::placeholder{
    color: #c72e3d;
    font-weight: normal;
    font-size: 1rem;
}
#title{
    font-weight: bold;
    font-size: 1.25rem;
    color: black;
}
#title:focus {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.75);
    border-color: black !important;
    outline: none;
}
#title:focus::placeholder{
    color: transparent;
}
.h100{
    height: 80vh;
}
.fx-w {
    width: 90px;
    position: relative;
    text-align: center;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>