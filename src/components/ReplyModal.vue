<!-- eslint-disable no-unused-vars -->
<script setup>
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { auth } from '@/firebase'
    const router = useRouter()
    const props = defineProps({
        to_whom: {
            type: String,
            required: true,
            default: "User",
        },
        parent_id: {
            type: String,
            required: true,
        }
    });
    let reply_text = ref('')
    let user_connected = ref(false);
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in; you can fetch additional data if needed.
            user_connected.value = true;
        } else {
            // No user is logged in.
            user_connected.value = false;
        }
    });
    
    function post_reply(parent, reply){
        console.log("hi");
        // From what i know, a response has an author a content, a date, a parent_id
        // the date should be Date.now()
        // The function provides a parent and a content
        // The author should be the person connected thus making the authentication necessary
        router.push(`/discussion/${parent}`);
    }

</script>

<template>
    <div class="mt-2 d-flex flex-column gap-3 p-2 border rounded">
        <div class="form-floating">
            <textarea class="form-control"
                style="height: 100px" v-model="reply_text"></textarea>
            <label for="floatingTextarea2">Reply to @{{ to_whom }}</label>
        </div>
        <div class="d-flex gap-2">
            <button type="button" class="rounded-pill btn" :class="(user_connected) ? 'btn-dark' : 'btn-danger'" :disabled="reply_text == '' && !user_connected" @click="post_reply(parent_id, reply_text)">Send</button>
            <button type="button" class="rounded-pill btn btn-outline-danger" @click="$emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
.border{
    border: solid grey;
}
</style>