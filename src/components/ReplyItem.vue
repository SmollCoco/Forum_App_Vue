<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed } from 'vue';
import { get_date_string } from '../composables/dateString'
import ReplyModal from './ReplyModal.vue';
let show_response = ref(false);
const props = defineProps({
    auteur: {
        type: String,
        required: true,
        default: "Aya",
    },
    contenu: {
        type: String,
        required: true,
        default: 'Amazing',
    },
    date: {
        type: String,
        required: true,
        default: () => new Date()
    },
    parent: {
        type: String,
        required: true,
    }
});

let date_string = computed(() => { return get_date_string(props.date) });
</script>

<template>
    <div class="bg-white p-2 r-link">
        <div class="w-100 d-flex gap-1 flex-column rounded">
            <!--Header containing the author, the topics and the date-->
            <div class="d-flex align-items-center gap-1 z-1">
                <router-link :to="`/profile/${auteur}`" class="d-flex gap-1 text-decoration-none align-items-center">
                    <img src="../assets/discussion.png" width="25" class="rounded-circle d-block">
                    <span class="d-block link div-link"> u/{{ auteur }}
                    </span>
                </router-link>
                <span style="color: gray; font-size: small;"> | {{ date_string }} | </span>
            </div>
            <div> {{ contenu }} </div>
        </div>
        <div class="btn rounded-pill fw-bold fx-w" @click="show_response = !show_response">
            Reply
        </div>
        <reply-modal v-if="show_response" :to_whom="auteur" :parent_id="id" @cancel="show_response = false" />
    </div>
</template>

<style scoped>
.r-link {
    font-weight: 500;
    color: black;
    text-decoration: none;
}

.r-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.div-link{
    font-size: 14px;
}

.div-link:hover {
    text-decoration: underline;
}

.fx-w {
    font-size: 14px;
    width: 60px;
    position: relative;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>