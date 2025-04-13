<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postDiscussion, postModification } from '@/composables/PostDiscussion';
import TopicItem from './TopicItem.vue';
import { getdiscId } from '@/composables/getDisc_Id';

const route = useRoute();
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
let to_be_edited = ref("");

function check_input(key) {
    console.log("Great")
    if (key === ' ' && topic_stream.value.trim()){
        post.topic.add(topic_stream.value.trim().toLowerCase());
        topic_stream.value = "";
    }
    console.log(post);
}

onMounted(async () => {
    if (props.modify) {
        let id = route.params.id;
        const fetchedPost = await getdiscId(id);
        Object.assign(post, fetchedPost);
    }
})

function post_or_modify(){
    if(props.modify){
        post.contenu += ' EDIT: ' + to_be_edited.value;
        postModification(post, router, route.params.id)
    }
    else{
        postDiscussion(post, router)
    }
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
                    <input v-if="!modify" type="text" id="title" class="form-control rounded-pill p-4"
                        placeholder="Add title" v-model="post.titre">
                    <div v-else id="title" class="form-control rounded-pill p-4 my-3">
                        {{ post.titre }}
                        <span class="fs-6 text-danger d-block"> | you can't modify the title</span>
                    </div>
                </div>
                <!--Here we add the content-->
                <div class="form-floating" v-if="!modify">
                    <textarea class="form-control" placeholder="What do you want us to know about you?"
                        id="floatingTextarea2" style="height: 300px" v-model="post.contenu"></textarea>
                    <label for="floatingTextarea2">Comments</label>
                </div>
                <div v-else>
                    <div class="rounded border mb-4 p-4 fw-semibold fs-6">
                        <span class="text-primary mb-1 d-block">Your previous content. To preserve integrity you are
                            only able to add text</span>
                        <br>
                        {{ post.contenu }}
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="What do you want us to know about you?"
                            id="floatingTextarea2" style="height: 300px" v-model="to_be_edited"></textarea>
                        <label for="floatingTextarea2">Edit as you wish</label>
                    </div>
                </div>
                <!--Here we add the submission button-->
                <input type="button" class="btn rounded-pill fw-bold fx-w mt-3" value="Submit" :disabled="!post.titre"
                    @click="post_or_modify">
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
