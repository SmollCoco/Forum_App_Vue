<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue';
import DiscussionItem from './DiscussionItem.vue'
import { useStore } from '@/composables/getDiscussions';

const { discussions, fetchDiscussions } = useStore();
onMounted(() => {
  fetchDiscussions().then(() => {
    
    console.log('discussions1', discussions.value);
  });
});
</script>

<template>
    <div class="d-flex justify-content-center">
        <div class="w-75">
            <hr class="border-1 m-0" />
            <div v-for="discussion in discussions" :key="discussion.id">
                <div v-if="discussion.parent==null">
                    <DiscussionItem v-bind="discussion" />
                    <hr class="border-1 m-0" />
                </div>
        
      </div>
            
        </div>
    </div>
</template>