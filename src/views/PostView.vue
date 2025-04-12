<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import NavbarItem from '@/components/NavbarItem.vue';
import NewDiscussionForm from '@/components/NewDiscussionForm.vue';
const route = useRoute();

let id = ref("IBHI");
// let id = route.params.id
</script>

<template>
    <div class="d-flex flex-column">
        <NavbarItem class="z-2" />
        <NewDiscussionForm :id="id" :modify="route.name == 'ModifyPost'" class="mt-5"/>
    </div>
</template>
