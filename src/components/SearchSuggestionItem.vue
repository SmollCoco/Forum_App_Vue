<!-- eslint-disable no-unused-vars -->
<script setup>
    const props = defineProps({
        type: {
            type: String,
            required: true,
            default: "User", // Can be either a user or a 'Topic'
        },
        value: {
            type: String,
            required: true,
            default: "Aya",
        }
    })
</script>

<template>
    <div class="w-100 p-2 d-flex gap-lg-1 border-bottom">
        <router-link v-if="type == 'User' " :to="`/profile/${value}`"
            class="d-flex gap-4 text-decoration-none align-items-center"><img src="../assets/user.png" width="40"
                class="rounded-circle d-block"> <span class="d-block link"> u/{{ value }} </span></router-link>
                <!--else if type == 'Topic' -->
        <router-link v-else :to="`/discussion/topic/${value}`"
            class="d-flex gap-4 text-decoration-none align-items-center"><img src="../assets/tag.png" width="40"
                class="rounded-circle d-block"> <span class="d-block link"> topic/{{ value }} </span></router-link>
    </div>
    
</template>

<style scoped>
.link{
    font-weight: bold;
    color: black;
    text-decoration: none;
}
.link:hover{
    color: rgb(10, 73, 209);
}
</style>