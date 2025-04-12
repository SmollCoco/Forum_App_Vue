<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue';
import TopicItem from './TopicItem.vue';
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
let topics = ref(new Set([]));
// topics.value.add("Aya");
// topics.value.add("Yassine");
let topic_stream = ref("");

function check_input(key) {
    console.log("Great")
    if (key === ' ' && topic_stream.value.trim()){
        topics.value.add(topic_stream.value.trim().toLowerCase());
        topic_stream.value = "";
    }
}

</script>

<template>
    <div class="d-flex justify-content-center">
        <div class="w-75">
            <div class="fs-2 fw-bold">
                {{ (modify) ? 'Modify' : 'Create' }} a post
            </div>
            <!--Here we will choose the topics-->
            <div class=" mt-2 border rounded p-3">
                <div class="fs-3 fw-bold ps-5">
                    Add topics
                </div>
                <div class="d-flex gap-2 p-2 flex-wrap">
                    <TopicItem deleteable :topic="topic" @remove="(topic) => topics.delete(topic)"
                        v-for="(topic, index) of topics" :key="index" />
                    <input type="email" class="form-control rounded-pill w-25"
                        placeholder="Add topics, Space will create a new topic" v-model="topic_stream"
                        @keydown=" (event) => check_input(event.key)">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>