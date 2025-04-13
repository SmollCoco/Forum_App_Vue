<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; // Adjust the path based on your project structure
const props = defineProps({
        username: {
            type: String,
        },
        id: {
            type: String,
        }
    });

function authStateListener() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

let is_disabled = ref(true);

onMounted(async () => {
    let user_connected = await authStateListener();
    console.log(user_connected);
    is_disabled.value = user_connected ? props.username !== user_connected.displayName : true;
});
</script>

<template>
    <RouterLink :to="`/modify/${username}/${id}`">
        <button :disabled="is_disabled">
            button
        </button>
    </RouterLink>
</template>