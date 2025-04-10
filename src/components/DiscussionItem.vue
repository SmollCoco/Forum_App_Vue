<!-- eslint-disable no-unused-vars -->
<script setup>
import { computed } from 'vue';
import TopicItem from './TopicItem.vue';
const props = defineProps({
    id: {
        type: String,
        required: true,
        default: "id",
    },
    author: {
        type: String,
        required: true,
        default: "Yassine",
    },
    preview: {
        type: String,
        required: true,
        default: "Here should be a preview of the post",
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    title: {
        type: String,
        required: true,
        default: "Dummy Post"
    },
    topics: {
        type: Array,
        required: true,
        default: () => ["Friendship", "Leadership"],
    }
});

let date_string = computed(() => {
    return props.date.toLocaleDateString();
});
</script>

<template>
    <router-link :to="`/discussion/${id}`" class="r-link mx-1">
        <div class="w-100 d-flex gap-lg-1 flex-column rounded p-2 r-link">
            <!--Header containing the author, the topics and the date-->
            <div class="d-flex align-items-center gap-lg-2 z-1">
                <router-link :to="`/profile/${value}`" class="d-flex gap-2 text-decoration-none align-items-center">
                    <img src="../assets/discussion.png" width="40" class="rounded-circle d-block">
                    <span class="d-block link div-link"> u/{{ author }}
                    </span>
                </router-link>
                <span style="color: gray; font-size: small;"> | {{ date_string }} | </span>
                <div v-for="(topic, index) of topics" :key="index">
                    <topic-item :topic="topic" />
                </div>
            </div>
            <div class="fs-3 fw-bold div-link"> {{ title }}</div>
            <div> {{ preview }} </div>
            <div id="reply button">tre bien </div>
        </div>
    </router-link>
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
}

.r-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
.div-link:hover{
    text-decoration: underline;
}
</style>