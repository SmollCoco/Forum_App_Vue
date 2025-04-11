<template>
   <div class="d-flex flex-column">
      <NavbarItem class="z-1"/>
      <DiscussionList :topic="route.params.topic"  class="mt-5 z-n1"/>
      
   </div>
</template>

<script setup>

import NavbarItem from '../components/NavbarItem.vue';
import DiscussionList from '@/components/DiscussionList.vue';
import { useRoute } from 'vue-router';
const route=useRoute();
console.log(route);

</script>
