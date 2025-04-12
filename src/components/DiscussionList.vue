<script setup>
import { ref, onMounted, watch } from 'vue';
import DiscussionItem from './DiscussionItem.vue';
import { useStore } from '@/composables/getDiscussions';
import { getTopic_Disc } from '@/composables/getTopic_Disc';
import {DateFilter} from '@/composables/date_filter';

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

console.log(discussions.value[0].date);
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

const ordre=ref("Date ⬇");
 function toogle(){
  ordre.value=ordre.value=="Date ⬆"? ordre.value="Date ⬇" : ordre.value="Date ⬆";
  filteredDiscussions.value=DateFilter(filteredDiscussions.value,ordre.value);

}
</script>

<template>
  <div type="button" class="btn rounded-pill fw-bold fx-w mx-5 my-2" v-on:click="toogle">{{ ordre }}</div>
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
<style scoped>
.fx-w {
    width: 90px;
    position: relative;
    background-color: rgb(219, 219, 219);
    align-self:end ;
}

.fx-w:hover {
    background-color: black;
    color: white;
}
</style>
