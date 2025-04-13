<!-- eslint-disable no-unused-vars -->
<script setup>
import { getReplies } from "@/composables/getReplies";
import { onMounted, ref } from "vue";
import ReplyItem from "./ReplyItem.vue";
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});
//pour recuperer les reponses
const replies = ref([]);

onMounted(async () => {
    await getReplies(props.id, replies.value);
    console.log("Replies0", replies.value);
});
</script>

<template>
    <div class="mx-3 p-1 border-left">
        <div v-for="(reply, index) of replies" :key="index">
            <ReplyItem v-bind="reply" />
        </div>
    </div>
</template>

<style scoped>
.border-left {
    border-left: solid black 2px;
}
</style>
