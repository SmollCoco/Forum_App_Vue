<template>
   <NavbarItem />
   <DiscussionList :filtred="route.params.topic" class="mt-5"/>
</template>

<script setup>
import { useRoute } from 'vue-router';
import NavbarItem from '../components/NavbarItem.vue';
import DiscussionList from '@/components/DiscussionList.vue';
const route=useRoute();
</script>
