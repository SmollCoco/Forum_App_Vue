<script setup>
import { ref, onMounted, watch } from 'vue';
import DiscussionItem from './DiscussionItem.vue';
import { useStore } from '@/composables/getDiscussions';
import { getTopic_Disc } from '@/composables/getTopic_Disc';

const props = defineProps({
  topic: {
    type: String,
    required: false,
    default: "",
  },
});

const { discussions, fetchDiscussions } = useStore();
const filteredDiscussions = ref([]);

async function filterDiscussions() {

  await fetchDiscussions();


  if (!props.topic) {
    filteredDiscussions.value = discussions.value.filter(disc => disc.parent == null);

  } else {
    console.log('Filtering with topic:', props.topic);
    filteredDiscussions.value = await getTopic_Disc("", props.topic);
    console.log('Filtered results:', filteredDiscussions.value);
  }
}

watch(() => props.topic, filterDiscussions);

onMounted(filterDiscussions);
</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="w-75">
      <hr class="border-1 m-0" />
      <div v-for="discussion of filteredDiscussions" :key="discussion.id">
        <div v-if="discussion.parent == null">
          <DiscussionItem v-bind="discussion" />
          <hr class="border-1 m-0" />
        </div>

      </div>

    </div>
  </div>
</template>