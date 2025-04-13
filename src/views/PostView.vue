<!-- eslint-disable no-unused-vars -->
<script setup>
import { useRoute } from 'vue-router';
import NavbarItem from '@/components/NavbarItem.vue';
import NewDiscussionForm from '@/components/NewDiscussionForm.vue';
const route = useRoute();

let id = route.params.username
</script>

<template>
    <div class="d-flex flex-column">
        <NavbarItem class="z-2" />
        <NewDiscussionForm :id="id" :modify="route.name == 'ModifyPost'" class="mt-5"/>
    </div>
</template>
